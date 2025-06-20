const Resume = require('../models/Resume');
const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const debounce = require('lodash.debounce');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Auto-save configuration
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const AUTO_SAVE_DEBOUNCE = 5000; // 5 seconds

// Track changes for auto-saving
const changeTrackers = new Map();

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

// Enhanced save function with auto-save support
const saveResumeData = async (resumeData, options = {}) => {
  const { isAutoSave = false, userId } = options;
  
  try {
    // Validate resume data (skip some validations for auto-save)
    const validationErrors = validateResumeData(resumeData);
    if (!isAutoSave && validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    let savedResume;

    if (resumeData._id) {
      // Update existing resume by ID
      savedResume = await Resume.findByIdAndUpdate(
        resumeData._id,
        { $set: resumeData, lastSavedAt: new Date() },
        { new: true, runValidators: !isAutoSave, upsert: false }
      );
      
      if (!savedResume) {
        throw new Error('Resume not found');
      }
    } else {
      // Look for existing resume by email
      const existingResume = await Resume.findOne({ email: resumeData.email });
      
      if (existingResume) {
        // Update existing resume
        savedResume = await Resume.findByIdAndUpdate(
          existingResume._id,
          { $set: resumeData, lastSavedAt: new Date() },
          { new: true, runValidators: !isAutoSave }
        );
      } else {
        // Create new resume
        const newResume = new Resume({
          ...resumeData,
          createdBy: userId,
          lastSavedAt: new Date()
        });
        savedResume = await newResume.save();
      }
    }

    console.log(`✅ Resume ${isAutoSave ? 'auto-saved' : 'saved'} successfully with ID:`, savedResume._id);
    return savedResume;

  } catch (error) {
    console.error(`❌ Error ${isAutoSave ? 'auto-saving' : 'saving'} resume:`, error);
    throw error;
  }
};

// Debounced auto-save function
const debouncedAutoSave = debounce(async (userId, resumeData) => {
  try {
    if (!changeTrackers.has(userId)) {
      return;
    }

    const { lastData, pendingSave } = changeTrackers.get(userId);
    
    // Only save if there are pending changes
    if (pendingSave && JSON.stringify(lastData) !== JSON.stringify(resumeData)) {
      console.log(`🔄 Auto-saving resume for user ${userId}`);
      await saveResumeData(resumeData, { isAutoSave: true, userId });
      changeTrackers.set(userId, {
        lastData: resumeData,
        pendingSave: false,
        lastSavedAt: new Date()
      });
    }
  } catch (error) {
    console.error('❌ Auto-save failed:', error);
  }
}, AUTO_SAVE_DEBOUNCE);

// Track changes and trigger auto-save
const trackChanges = (userId, resumeData) => {
  if (!changeTrackers.has(userId)) {
    changeTrackers.set(userId, {
      lastData: resumeData,
      pendingSave: false,
      lastSavedAt: null
    });
  } else {
    const tracker = changeTrackers.get(userId);
    tracker.pendingSave = true;
    changeTrackers.set(userId, tracker);
  }

  // Trigger debounced auto-save
  debouncedAutoSave(userId, resumeData);
};

// Create a new resume
const createResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const userId = req.user?.id;
    
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
    const existingResume = await Resume.findOne({ email: resumeData.email });
    if (existingResume) {
      return res.status(409).json({
        success: false,
        message: 'Resume with this email already exists',
        data: existingResume
      });
    }

    // Create new resume
    const savedResume = await saveResumeData({
      ...resumeData,
      createdBy: userId
    });

    // Initialize auto-save tracking
    trackChanges(userId, savedResume.toObject());

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: savedResume,
      resumeId: savedResume._id,
      autoSaveEnabled: true
    });

  } catch (error) {
    console.error('❌ Error creating resume:', error);
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
    const userId = req.user?.id;
    
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

    // Save resume
    const savedResume = await saveResumeData(resumeData, { userId });

    // Update auto-save tracking
    trackChanges(userId, savedResume.toObject());

    res.status(200).json({
      success: true,
      message: 'Resume saved successfully',
      data: savedResume,
      resumeId: savedResume._id.toString(),
      canEnhance: true,
      isSaved: true,
      autoSaveEnabled: true,
      lastSavedAt: savedResume.lastSavedAt
    });

  } catch (error) {
    console.error('❌ Error saving resume:', error);
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
    const userId = req.user?.id;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const resume = await Resume.findOne({ email: email });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Initialize auto-save tracking
    trackChanges(userId, resume.toObject());

    res.status(200).json({
      success: true,
      message: 'Resume loaded successfully',
      data: resume,
      resumeId: resume._id.toString(),
      canEnhance: true,
      isSaved: true,
      autoSaveEnabled: true,
      lastSavedAt: resume.lastSavedAt
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

// Generate PDF from resume
const generatePdf = async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Generate HTML from resume data (simplified)
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; }
            .section { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${resumeData.name || 'Resume'}</h1>
          <div class="section">
            <h2>Summary</h2>
            <p>${resumeData.summary || 'No summary provided'}</p>
          </div>
          <!-- Add more sections as needed -->
        </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf'
    });
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Enhance specific field or entry in resume
const enhanceField = async (req, res) => {
  try {
    const { resumeId, field, index } = req.body;
    
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required'
      });
    }

    if (!field) {
      return res.status(400).json({
        success: false,
        message: 'Field to enhance is required'
      });
    }

    // Get the current resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare enhancement prompt based on field type
    let prompt = '';
    let fieldData = resume[field];
    let enhancedData = null;

    if (index !== undefined && index !== null && Array.isArray(fieldData)) {
      // Enhance specific entry in an array field
      if (index >= fieldData.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid index for field array'
        });
      }

      const entry = fieldData[index];
      
      switch (field) {
        case 'experience':
          prompt = `Enhance this work experience entry for a professional resume. Keep it concise but impactful. Here are the current details:
          - Job Title: ${entry.title || 'Not specified'}
          - Company: ${entry.companyName || 'Not specified'}
          - Dates: ${entry.date || 'Not specified'}
          - Location: ${entry.companyLocation || 'Not specified'}
          - Description: ${entry.description || 'No description provided'}
          - Accomplishments: ${entry.accomplishment || 'No accomplishments provided'}
          
          Please return enhanced versions of both the description and accomplishment in JSON format:
          {
            "description": "Enhanced job description...",
            "accomplishment": "Enhanced accomplishment..."
          }`;
          break;
          
        case 'education':
          prompt = `Enhance this education entry for a professional resume:
          - Degree: ${entry.degree || 'Not specified'}
          - Institution: ${entry.institution || 'Not specified'}
          - Dates: ${entry.duration || 'Not specified'}
          - Grade: ${entry.grade || 'Not specified'}
          
          Return enhanced degree and institution description in JSON format:
          {
            "degree": "Enhanced degree description...",
            "institution": "Enhanced institution description..."
          }`;
          break;
          
        case 'achievements':
          prompt = `Enhance this achievement for a professional resume:
          - Achievement: ${entry.keyAchievements || 'Not specified'}
          - Description: ${entry.describe || 'No description provided'}
          
          Return enhanced achievement and description in JSON format:
          {
            "keyAchievements": "Enhanced achievement...",
            "describe": "Enhanced description..."
          }`;
          break;
          
        case 'projects':
          prompt = `Enhance this project description for a professional resume:
          - Project: ${entry.title || 'Not specified'}
          - Duration: ${entry.duration || 'Not specified'}
          - Description: ${entry.description || 'No description provided'}
          
          Return enhanced description in JSON format:
          {
            "description": "Enhanced project description..."
          }`;
          break;
          
        case 'courses':
          prompt = `Enhance this course description for a professional resume:
          - Course: ${entry.title || 'Not specified'}
          - Description: ${entry.description || 'No description provided'}
          
          Return enhanced description in JSON format:
          {
            "description": "Enhanced course description..."
          }`;
          break;
          
        default:
          return res.status(400).json({
            success: false,
            message: 'Field not supported for individual entry enhancement'
          });
      }

      // Call Gemini AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      try {
        enhancedData = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse AI response:', e);
        return res.status(500).json({
          success: false,
          message: 'Failed to parse AI enhancement response'
        });
      }

      // Update the specific entry
      const updatedEntry = {
        ...entry.toObject(),
        ...enhancedData
      };

      // Create a new array with the updated entry
      const updatedArray = [...fieldData];
      updatedArray[index] = updatedEntry;

      // Save the enhanced resume
      const savedResume = await Resume.findByIdAndUpdate(
        resumeId,
        { $set: { [field]: updatedArray } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: `Enhanced ${field} entry successfully`,
        data: savedResume[field][index],
        enhancedField: field,
        enhancedIndex: index
      });

    } else {
      // Enhance the entire field (original functionality)
      switch (field) {
        case 'summary':
          prompt = `Enhance this resume summary to make it more professional and tailored for a ${resume.role || 'job'} position. Keep it concise (3-4 sentences). Current summary: ${resume.summary || 'No summary provided'}`;
          break;
          
        case 'skills':
          prompt = `Enhance and categorize these skills for a resume. Current skills: ${resume.skills?.join(', ') || 'No skills provided'}. Return only a comma-separated list of enhanced skills.`;
          break;
          
        default:
          return res.status(400).json({
            success: false,
            message: 'Field not supported for enhancement'
          });
      }

      // Call Gemini AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const enhancedText = response.text();

      // Update the resume
      const update = {};
      if (field === 'skills') {
        update[field] = enhancedText.split(',').map(skill => skill.trim());
      } else {
        update[field] = enhancedText;
      }

      const savedResume = await Resume.findByIdAndUpdate(
        resumeId,
        { $set: update },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: `Enhanced ${field} successfully`,
        data: savedResume[field]
      });
    }

  } catch (error) {
    console.error(`❌ Error enhancing ${field}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to enhance ${field}`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createResume,
  saveResume,
  loadResume,
  generatePdf,
  enhanceField,
  trackChanges
};