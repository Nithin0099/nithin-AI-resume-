
require("dotenv").config();
const axios = require("axios");
const Temp9Resume = require("../models/Temp9model");
const puppeteer = require("puppeteer");
const fs = require("fs").promises; // for async file operations
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI (using the flash model for faster responses)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Helper: GeminiFunctionField
 * Uses Gemini AI to enhance a given resume field.
 * Implements retries with exponential backoff to handle rate limits.
 */

//Controller function to fetch resume by ID
const getResumeByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const resume = await Temp9Resume.findOne({ email });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const GeminiFunctionField = async (category, fieldName, userInput, retries = 3) => {
  while (retries > 0) {
    try {
      console.log(`🔹 Enhancing ${category} field '${fieldName}':`, userInput);
      // For the "skills" category, we instruct Gemini to keep the response brief.
      const additionalInstruction = category === "skills"
        ? "Keep the enhanced text very concise (e.g., no more than 5 words)."
        : "";
      const prompt = `
Enhance this ${category} field '${fieldName}' while ensuring it remains ATS-optimized.
- Preserve important industry-specific keywords.
- Use clear, concise, and professional language.
- Maintain standard resume formatting for ATS readability.
- Use strong action verbs and quantifiable achievements where possible.
${additionalInstruction}
User Input: ${JSON.stringify(userInput)}
Return only valid JSON in this format: {"${fieldName}": "Enhanced ATS-optimized text"}
      `;
      const result = await geminiModel.generateContent([prompt]);
      const responseText = result.response.text().trim();
      if (!responseText) {
        console.error(`❌ Empty AI response for ${category} field '${fieldName}'`);
        return userInput;
      }
      // Remove any markdown formatting from the response
      const cleanResponse = responseText.replace(/```json|```/g, "").trim();
      const parsedResponse = JSON.parse(cleanResponse);
      if (parsedResponse && parsedResponse[fieldName] && parsedResponse[fieldName].trim().length > 0) {
        return parsedResponse[fieldName];
      } else {
        console.warn(`❌ Invalid AI response for ${category} field '${fieldName}'`);
        return userInput;
      }
    } catch (error) {
      console.error(`❌ Error enhancing ${category} field '${fieldName}':`, error.message);
      retries--;
      // Wait 7 seconds before retrying to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 7000));
    }
  }
  console.error(`❌ AI failed for ${category} field '${fieldName}' after retries`);
  return userInput;
};

/**
 * Enhancement functions for array fields.
 * These functions iterate over each array element and enhance the relevant text fields.
 */
const enhanceExperience = async (experienceArray) => {
  if (!Array.isArray(experienceArray)) return experienceArray;
  const enhancedArray = [];
  for (const exp of experienceArray) {
    const enhancedDescription = await GeminiFunctionField("experience", "description", exp.description || "");
    enhancedArray.push({ ...exp, description: enhancedDescription });
  }
  return enhancedArray;
};

const enhanceAchievements = async (achievementsArray) => {
  if (!Array.isArray(achievementsArray)) return achievementsArray;
  const enhancedArray = [];
  for (const ach of achievementsArray) {
    const enhancedDescribe = await GeminiFunctionField("achievements", "describe", ach.describe || "");
    enhancedArray.push({ ...ach, describe: enhancedDescribe });
  }
  return enhancedArray;
};

const enhanceCourses = async (coursesArray) => {
  if (!Array.isArray(coursesArray)) return coursesArray;
  const enhancedArray = [];
  for (const course of coursesArray) {
    const enhancedDescription = await GeminiFunctionField("courses", "description", course.description || "");
    enhancedArray.push({ ...course, description: enhancedDescription });
  }
  return enhancedArray;
};

const enhanceProjects = async (projectsArray) => {
  if (!Array.isArray(projectsArray)) return projectsArray;
  const enhancedArray = [];
  for (const project of projectsArray) {
    const enhancedDescription = await GeminiFunctionField("projects", "description", project.description || "");
    enhancedArray.push({ ...project, description: enhancedDescription });
  }
  return enhancedArray;
};

const enhanceSkills = async (skillsArray) => {
  if (!Array.isArray(skillsArray)) return skillsArray;
  const enhancedArray = [];
  for (const skill of skillsArray) {
    const enhancedSkill = await GeminiFunctionField("skills", "skill", skill);
    enhancedArray.push(enhancedSkill);
  }
  return enhancedArray;
};

/**
 * Controller: createResume
 * Creates a new resume entry.
 * Checks if the resume data is provided, verifies the email,
 * ensures a resume does not already exist for that email, and saves the new resume.
 */
const createResume = async (req, res) => {
  try {
    console.log("🔹 Received Resume Data:", req.body);
    if (!req.body.resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }
    const { email } = req.body.resumeData;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const existingResume = await Temp9Resume.findOne({ email });
    if (existingResume) {
      return res.status(409).json({ message: "Resume already exists", data: existingResume });
    }
    const newResume = new Temp9Resume(req.body.resumeData);
    const savedResume = await newResume.save();
    console.log("✅ Created Resume ID:", savedResume._id);
    res.status(201).json({ message: "Resume created successfully", data: savedResume });
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

/**
 * Controller: saveResume
 * Updates an existing resume or creates a new one if not found.
 * It formats the input data, validates required fields, and then either updates or saves the resume.
 */
const saveResume = async (req, res) => {
  try {
    const resumeData = req.body.resumeData;
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    console.log("🔹 Received Resume Data for Saving:", JSON.stringify(resumeData, null, 2));

    // Format the resume data
    const formattedResume = {
      name: resumeData.name || "",
      role: resumeData.role || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
      linkedin: resumeData.linkedin || "",
      location: resumeData.location || "",
      summary: resumeData.summary || "",
      experience: Array.isArray(resumeData.experience) ? resumeData.experience.map(exp => ({
        title: exp.title || "",
        companyName: exp.companyName || "",
        Startdate: exp.Startdate || "",
        end_data: exp.end_data || "",
        companyLocation: exp.companyLocation || "",
        description: exp.description || "",
        accomplishment: exp.accomplishment || ""
      })) : [],
      education: Array.isArray(resumeData.education) ? resumeData.education.map(edu => ({
        degree: edu.degree || "",
        institution: edu.institution || "",
        duration: edu.duration || "",
        grade: edu.grade || ""
      })) : [],
      skills: Array.isArray(resumeData.skills) ? resumeData.skills.filter(Boolean) : [],
      achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements.map(ach => ({
        keyAchievements: ach.keyAchievements || "",
        describe: ach.describe || ""
      })) : [],
      courses: Array.isArray(resumeData.courses) ? resumeData.courses.map(course => ({
        title: course.title || "",
        platform: course.platform || "",
        institution: course.institution || "",
        description: course.description || ""
      })) : [],
      projects: Array.isArray(resumeData.projects) ? resumeData.projects.map(proj => ({
        title: proj.title || "",
        description: proj.description || "",
        duration: proj.duration || ""
      })) : []
    };

    let savedResume;
    try {
      if (resumeData._id) {
        console.log("🔹 Updating existing resume:", resumeData._id);
        savedResume = await Temp9Resume.findByIdAndUpdate(
          resumeData._id,
          formattedResume,
          { new: true, runValidators: true }
        );
        if (!savedResume) {
          // If no resume was found with the given ID, create a new one
          console.log("🔹 Resume not found, creating new one");
          const newResume = new Temp9Resume(formattedResume);
          savedResume = await newResume.save();
        }
      } else {
        console.log("🔹 Creating new resume");
        const newResume = new Temp9Resume(formattedResume);
        savedResume = await newResume.save();
      }

      console.log("✅ Resume saved successfully:", savedResume._id);
      res.status(200).json({
        message: "Resume saved successfully",
        data: savedResume
      });
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
  } catch (error) {
    console.error("❌ Error saving resume:", error);
    res.status(500).json({
      message: "Error saving resume",
      error: error.message
    });
  }
};

/**
 * Controller: enhanceField
 * Enhances a specific resume field using the Gemini AI.
 * It checks which field to enhance (e.g., summary, skills, experience, etc.), calls the respective enhancement function,
 * updates the resume, and saves the changes to the database.
 */
const enhanceField = async (req, res) => {
  try {
    const { resumeId, field, index, content } = req.body;
    if (!resumeId || !field) {
      return res.status(400).json({ message: "Resume ID and field are required" });
    }

    const resume = await Temp9Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let enhancedContent;
    let prompt;
    
    switch (field) {
      case 'experience':
        prompt = `
          As an expert resume writer, enhance this job experience to be more impactful and ATS-friendly.
          
          Original Content:
          ${JSON.stringify(content, null, 2)}

          Guidelines:
          1. Title: Make it more specific and industry-standard
          2. Description: 
             - Start each point with strong action verbs
             - Include specific metrics and numbers
             - Highlight technical skills and tools used
             - Focus on achievements and impact
             - Use industry-relevant keywords
          3. Accomplishments:
             - Quantify results (%, $, time saved, etc.)
             - Show direct business impact
             - Highlight leadership and initiative
             - Include technical complexity if relevant

          Return ONLY the enhanced content in this exact JSON format:
          {
            "title": "enhanced title",
            "description": "enhanced description with bullet points",
            "accomplishment": "key measurable achievements"
          }
        `;
        break;

      case 'summary':
        prompt = `
          Enhance this professional summary to be more impactful and ATS-friendly.
          Make it showcase the person's expertise and value proposition.
          Keep it concise (3-4 sentences) but comprehensive.
          Use strong action verbs and industry-relevant keywords.
          Maintain a professional tone.

          Original summary: ${content}

          Return only the enhanced summary text.
        `;
        break;

      case 'skills':
        prompt = `
          Enhance these skills to be more impactful and industry-relevant.
          - Use recognized industry terms
          - Be specific (e.g., "Python" instead of just "Programming")
          - Include version numbers or specific frameworks where relevant
          - Keep each skill concise

          Original skills: ${JSON.stringify(content)}

          Return the enhanced skills as a JSON array of strings.
        `;
        break;

      case 'projects':
        prompt = `
          Enhance this project description to highlight technical skills and achievements.
          Focus on:
          - Technical complexity and problem-solving
          - Tools and technologies used
          - Measurable outcomes and impact
          - Role and responsibilities

          Original Content:
          Title: ${content.title}
          Description: ${content.description}

          Return the enhanced content in this JSON format:
          {
            "title": "enhanced project title",
            "description": "enhanced description with technical details and achievements"
          }
        `;
        break;

      case 'achievements':
        prompt = `
          Enhance these achievements to be more impactful and quantifiable.
          Focus on:
          - Specific metrics and numbers
          - Business impact
          - Technical complexity
          - Leadership and initiative

          Original Content:
          Title: ${content.title}
          Achievements: ${JSON.stringify(content.achievements)}

          Return the enhanced content in this JSON format:
          {
            "title": "enhanced category title",
            "achievements": ["enhanced achievement 1", "enhanced achievement 2", ...]
          }
        `;
        break;

      default:
        prompt = `Enhance this ${field} content to be more professional and ATS-friendly: ${JSON.stringify(content)}`;
    }

    const result = await model.generateContent([prompt]);
    const responseText = result.response.text();
    
    try {
      enhancedContent = JSON.parse(responseText.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      return res.status(500).json({ message: "Failed to process AI enhancement" });
    }

    // For experience entries, ensure the enhanced content maintains the required structure
    if (field === 'experience') {
      const enhancedExperience = {
        ...content,
        title: enhancedContent.title || content.title,
        description: enhancedContent.description || content.description,
        accomplishment: enhancedContent.accomplishment || content.accomplishment
      };
      return res.json({
        message: "Experience enhanced successfully",
        data: enhancedExperience
      });
    }

    return res.json({
      message: `${field} enhanced successfully`,
      data: enhancedContent
    });

  } catch (error) {
    console.error("Error enhancing field:", error);
    res.status(500).json({ message: "Error enhancing field", error: error.message });
  }
};

/**
 * Controller: generateAndDownloadPDF
 * Generates an HTML version of the resume, converts it to a PDF using Puppeteer,
 * and then sends the PDF as a downloadable file.
 */
const generateAndDownloadPDF = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    const htmlContent = `<html><body><h1>${resumeData.name}</h1></body></html>`; // Modify with full resume template

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=resume.pdf" });
    res.end(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};

/**
 * Helper: generateHTML
 * Converts resume data into an HTML template.
 * This HTML will be rendered as a PDF.
 */
const generateHTML = (resumeData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume - ${resumeData?.name ?? "Unknown"}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          font-size: 12pt;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 15px;
        }
        h1 { font-size: 28pt; color: #2c3e50; }
        h2 { font-size: 18pt; color: #34495e; margin-top: 20px; }
        .section { margin-bottom: 25px; }
        .experience-item, .education-item, .course-item, .project-item { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resumeData?.name ?? "Unknown"}</h1>
        <p>${resumeData?.role ?? ""}</p>
        <p>${resumeData?.email ?? ""} | ${resumeData?.phone ?? ""}</p>
        <p>${resumeData?.linkedin ?? ""} | ${resumeData?.location ?? ""}</p>
      </div>
      ${resumeData?.summary ? `<div class="section"><h2>Summary</h2><p>${resumeData.summary}</p></div>` : ''}
      ${resumeData?.experience?.length ? `<div class="section"><h2>Experience</h2>${resumeData.experience.map(exp => `
        <div class="experience-item">
          <h3>${exp.companyName}</h3>
          <p><strong>${exp.title}</strong> | ${exp.date}</p>
          <p>${exp.description}</p>
          ${exp.accomplishment ? `<p><em>${exp.accomplishment}</em></p>` : ''}
        </div>
      `).join('')}</div>` : ''}
      ${resumeData?.education?.length ? `<div class="section"><h2>Education</h2>${resumeData.education.map(edu => `
        <div class="education-item">
          <h3>${edu.institution}</h3>
          <p>${edu.degree} (${edu.duration})</p>
          ${edu.grade ? `<p>Grade: ${edu.grade}</p>` : ''}
        </div>
      `).join('')}</div>` : ''}
      ${resumeData?.skills?.length ? `<div class="section"><h2>Skills</h2><ul>${resumeData.skills.map(skill => `<li>${skill}</li>`).join('')}</ul></div>` : ''}
      ${resumeData?.courses?.length ? `<div class="section"><h2>Courses</h2>${resumeData.courses.map(course => `
        <div class="course-item">
          <h3>${course.title}</h3>
          <p>${course.description}</p>
        </div>
      `).join('')}</div>` : ''}
      ${resumeData?.projects?.length ? `<div class="section"><h2>Projects</h2>${resumeData.projects.map(project => `
        <div class="project-item">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p>${project.duration}</p>
        </div>
      `).join('')}</div>` : ''}
    </body>
    </html>
  `;
};

/**
 * Helper: generatePDFBuffer
 * Uses Puppeteer to render the provided HTML content and generate a PDF buffer.
 */
const generatePDFBuffer = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0", timeout: 30000 });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" }
  });
  await browser.close();
  return pdfBuffer;
};

// Export all controller functions so they can be used in the routes.
module.exports = {
  createResume,
  saveResume,
  enhanceField,
  generateAndDownloadPDF,
  getResumeByEmail
};
