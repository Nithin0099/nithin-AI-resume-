const Resume = require('../models/Resume');
const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (you can also use OpenAI)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to validate resume data
const validateResumeData = (resumeData) => {
  const errors = [];
  
  if (!resumeData.name || resumeData.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!resumeData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!resumeData.phone || resumeData.phone.trim().length === 0) {
    errors.push('Phone number is required');
  }
  
  return errors;
};

// Create a new resume
const createResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Validate resume data
    const validationErrors = validateResumeData(resumeData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if resume with this email already exists
    const existingResume = await Resume.findByEmail(resumeData.email);
    if (existingResume) {
      return res.status(409).json({
        success: false,
        message: 'Resume with this email already exists',
        data: existingResume
      });
    }

    // Create new resume
    const newResume = new Resume(resumeData);
    const savedResume = await newResume.save();

    console.log('✅ Resume created successfully:', savedResume.getSummaryInfo());

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: savedResume
    });

  } catch (error) {
    console.error('❌ Error creating resume:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Resume with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Save/Update resume
const saveResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Validate resume data
    const validationErrors = validateResumeData(resumeData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    let savedResume;

    if (resumeData._id) {
      // Update existing resume
      savedResume = await Resume.findByIdAndUpdate(
        resumeData._id,
        resumeData,
        { new: true, runValidators: true }
      );
      
      if (!savedResume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
    } else {
      // Create new resume or find by email
      const existingResume = await Resume.findByEmail(resumeData.email);
      
      if (existingResume) {
        savedResume = await Resume.findByIdAndUpdate(
          existingResume._id,
          resumeData,
          { new: true, runValidators: true }
        );
      } else {
        savedResume = await new Resume(resumeData).save();
      }
    }

    console.log('✅ Resume saved successfully:', savedResume.getSummaryInfo());

    res.status(200).json({
      success: true,
      message: 'Resume saved successfully',
      data: savedResume
    });

  } catch (error) {
    console.error('❌ Error saving resume:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Load resume by email
const loadResume = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const resume = await Resume.findByEmail(email);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume loaded successfully',
      data: resume
    });

  } catch (error) {
    console.error('❌ Error loading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Generate PDF
const generatePdf = async (req, res) => {
  let browser;
  try {
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Create HTML content for PDF
    const htmlContent = generateResumeHTML(resumeData);

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    });

    await browser.close();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    
    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Enhance specific field using AI
const enhanceField = async (req, res) => {
  try {
    const { resumeId, field } = req.body;
    
    if (!resumeId || !field) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID and field are required'
      });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Get AI enhancement
    const enhancedContent = await getAIEnhancement(resume[field], field, resume.role);
    
    // Update the specific field
    resume[field] = enhancedContent;
    const updatedResume = await resume.save();

    console.log(`✅ Field '${field}' enhanced successfully for resume:`, resume.getSummaryInfo());

    res.status(200).json({
      success: true,
      message: `${field} enhanced successfully`,
      data: updatedResume
    });

  } catch (error) {
    console.error(`❌ Error enhancing field:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to enhance field',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// AI Enhancement helper function
const getAIEnhancement = async (content, field, role) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('AI API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let prompt = '';
    
    switch (field) {
      case 'summary':
        prompt = `Enhance this professional summary for a ${role} role. Make it more compelling and ATS-friendly while keeping it concise (2-3 lines): "${content}"`;
        break;
      case 'skills':
        prompt = `Enhance this skills list for a ${role} role. Add relevant technical and soft skills, organize them better: "${Array.isArray(content) ? content.join(', ') : content}"`;
        break;
      case 'experience':
        prompt = `Enhance these work experiences for a ${role} role. Improve descriptions with action verbs and quantified achievements: ${JSON.stringify(content)}`;
        break;
      case 'achievements':
        prompt = `Enhance these achievements for a ${role} role. Make them more impactful with specific metrics and results: ${JSON.stringify(content)}`;
        break;
      case 'courses':
        prompt = `Enhance these courses for a ${role} role. Add relevant courses and improve descriptions: ${JSON.stringify(content)}`;
        break;
      case 'projects':
        prompt = `Enhance these projects for a ${role} role. Improve descriptions with technologies used and outcomes: ${JSON.stringify(content)}`;
        break;
      default:
        prompt = `Enhance this ${field} content for a ${role} role: "${content}"`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedContent = response.text();

    // Parse response based on field type
    if (field === 'skills') {
      // Return as array
      return enhancedContent.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    } else if (['experience', 'achievements', 'courses', 'projects'].includes(field)) {
      // Try to parse JSON, fallback to original if parsing fails
      try {
        return JSON.parse(enhancedContent);
      } catch {
        return content; // Return original if AI response isn't valid JSON
      }
    }

    return enhancedContent.trim();

  } catch (error) {
    console.error('❌ AI Enhancement Error:', error);
    return content; // Return original content if AI enhancement fails
  }
};

// Generate HTML for PDF
const generateResumeHTML = (resumeData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.4; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .name { font-size: 24px; font-weight: bold; margin: 0; }
        .role { font-size: 16px; color: #666; margin: 5px 0; }
        .contact { font-size: 12px; margin: 10px 0; }
        .section { margin: 15px 0; }
        .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
        .entry { margin: 10px 0; }
        .entry-header { font-weight: bold; display: flex; justify-content: space-between; }
        .entry-subheader { font-style: italic; color: #666; display: flex; justify-content: space-between; }
        .skills { display: flex; flex-wrap: wrap; gap: 5px; }
        .skill { background: #f0f0f0; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${resumeData.name}</h1>
        <div class="role">${resumeData.role}</div>
        <div class="contact">
          ${resumeData.phone} | ${resumeData.email} | ${resumeData.linkedin} | ${resumeData.location}
        </div>
      </div>

      <div class="section">
        <div class="section-title">SUMMARY</div>
        <div>${resumeData.summary}</div>
      </div>

      <div class="section">
        <div class="section-title">EXPERIENCE</div>
        ${resumeData.experience?.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <span>${exp.companyName}</span>
              <span>${exp.companyLocation}</span>
            </div>
            <div class="entry-subheader">
              <span>${exp.title}</span>
              <span>${exp.date}</span>
            </div>
            <div>${exp.description}</div>
            <div>${exp.accomplishment}</div>
          </div>
        `).join('') || ''}
      </div>

      <div class="section">
        <div class="section-title">EDUCATION</div>
        ${resumeData.education?.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <span>${edu.institution}</span>
              <span>${edu.grade}</span>
            </div>
            <div class="entry-subheader">
              <span>${edu.degree}</span>
              <span>${edu.duration}</span>
            </div>
          </div>
        `).join('') || ''}
      </div>

      <div class="section">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        ${resumeData.achievements?.map(ach => `
          <div class="entry">
            <div style="font-weight: bold;">${ach.keyAchievements}</div>
            <div>${ach.describe}</div>
          </div>
        `).join('') || ''}
      </div>

      <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="skills">
          ${resumeData.skills?.map(skill => `<span class="skill">${skill}</span>`).join('') || ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">COURSES</div>
        ${resumeData.courses?.map(course => `
          <div class="entry">
            <div style="font-weight: bold;">${course.title}</div>
            <div>${course.description}</div>
          </div>
        `).join('') || ''}
      </div>

      <div class="section">
        <div class="section-title">PROJECTS</div>
        ${resumeData.projects?.map(project => `
          <div class="entry">
            <div class="entry-header">
              <span style="font-weight: bold;">${project.title}</span>
              <span>${project.duration}</span>
            </div>
            <div>${project.description}</div>
          </div>
        `).join('') || ''}
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  createResume,
  saveResume,
  loadResume,
  generatePdf,
  enhanceField
};