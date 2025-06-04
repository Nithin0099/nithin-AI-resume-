require("dotenv").config();
const axios = require("axios");
const Resume = require('../models/Resume.model');
const express = require("express");
const router = express.Router();
const puppeteer = require('puppeteer');
const fs = require('fs').promises; // Use promises for async file operations
// Import Google Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); //Best for detailed resume improvements
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); //Best for fast resume enhancements


/**
 * Helper: Enhance a single field using Gemini API.
 * Uses retries with delay (exponential backoff) to mitigate rate limits.
 */
const GeminiFunctionField = async (category, fieldName, userInput, retries = 3) => {
  while (retries > 0) {
    try {
      console.log(`🔹 Sending AI request for ${category} field '${fieldName}':`, userInput);
      // For the "skills" category, add a note to keep the response brief.
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
        console.error(`❌ AI response for ${category} field '${fieldName}' is empty`);
        return userInput;
      }
      const cleanResponse = responseText.replace(/```json|```/g, "").trim();
      const parsedResponse = JSON.parse(cleanResponse);
      if (parsedResponse && parsedResponse[fieldName] && parsedResponse[fieldName].trim().length > 0) {
        return parsedResponse[fieldName];
      } else {
        console.warn(`❌ AI returned invalid/empty response for ${category} field '${fieldName}', using original value.`);
        return userInput;
      }
    } catch (error) {
      console.error(`❌ Error enhancing ${category} field '${fieldName}':`, error.message);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 7000)); // wait longer to help avoid rate limits
    }
  }
  console.error(`❌ AI failed for ${category} field '${fieldName}' after retries. Keeping original data.`);
  return userInput;
};

/**
 * Helper: Enhance experience entries.
 * For each experience item, we enhance the "description" field (or you can choose to combine it with "accomplishment").
 */
const enhanceExperience = async (experienceArray) => {
  if (!Array.isArray(experienceArray)) return experienceArray;
  const enhancedArray = [];
  for (const exp of experienceArray) {
    // Here we enhance only the "description" field. (You can also concatenate accomplishment if desired.)
    const textToEnhance = exp.description || "";
    const enhancedDescription = await GeminiFunctionField("experience", "description", textToEnhance);
    // Optionally, you could also enhance the "accomplishment" field separately.
    const enhancedExp = { ...exp, description: enhancedDescription };
    enhancedArray.push(enhancedExp);
  }
  return enhancedArray;
};

/**
 * Helper: Enhance achievements.
 * For each achievement, we enhance only the "describe" field.
 */
const enhanceAchievements = async (achievementsArray) => {
  if (!Array.isArray(achievementsArray)) return achievementsArray;
  const enhancedArray = [];
  for (const ach of achievementsArray) {
    const textToEnhance = ach.describe || "";
    const enhancedDescribe = await GeminiFunctionField("achievements", "describe", textToEnhance);
    const enhancedAch = { ...ach, describe: enhancedDescribe };
    enhancedArray.push(enhancedAch);
  }
  return enhancedArray;
};

/**
 * Helper: Enhance courses.
 * For each course, we enhance only the "description" field.
 */
const enhanceCourses = async (coursesArray) => {
  if (!Array.isArray(coursesArray)) return coursesArray;
  const enhancedArray = [];
  for (const course of coursesArray) {
    const textToEnhance = course.description || "";
    const enhancedDescription = await GeminiFunctionField("courses", "description", textToEnhance);
    const enhancedCourse = { ...course, description: enhancedDescription };
    enhancedArray.push(enhancedCourse);
  }
  return enhancedArray;
};

/**
 * Helper: Enhance projects.
 * For each project, we enhance only the "description" field.
 * (Note: In your updated model, the start and end dates have been combined into a "duration" field.)
 */
const enhanceProjects = async (projectsArray) => {
  if (!Array.isArray(projectsArray)) return projectsArray;
  const enhancedArray = [];
  for (const project of projectsArray) {
    const textToEnhance = project.description || "";
    const enhancedDescription = await GeminiFunctionField("projects", "description", textToEnhance);
    const enhancedProject = { ...project, description: enhancedDescription };
    enhancedArray.push(enhancedProject);
  }
  return enhancedArray;
};

/**
 * Helper: Enhance skills.
 * For each skill (string), enhance it.
 */
const enhanceSkills = async (skillsArray) => {
  if (!Array.isArray(skillsArray)) return skillsArray;
  const enhancedArray = [];
  for (const skill of skillsArray) {
    const enhancedSkill = await GeminiFunctionField("skills", "skill", skill);
    enhancedArray.push(enhancedSkill);
  }
  return enhancedArray;
};

// Create Resume (no AI enhancements)
const createResume = async (req, res) => {
  try {
    console.log("🔹 Received Resume Data:", req.body); // <-- Check if data is coming from frontend

    if (!req.body.resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }
    
    const { email } = req.body.resumeData;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingResume = await Resume.findOne({ email });
    if (existingResume) {
      return res.status(409).json({ message: "Resume already exists", data: existingResume });
    }

    const newResume = new Resume(req.body.resumeData);
    const savedResume = await newResume.save();

    console.log("✅ Created Resume ID:", savedResume._id);
    res.status(201).json({ message: "Resume created successfully", data: savedResume });

  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};


// Save Resume (update or create without AI)
const saveResume = async (req, res) => {
  try {
    const resumeData = req.body.resumeData;
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }
    console.log("🔹 Received Resume Data for Saving:", resumeData);
    const formattedResume = {
      name: resumeData.name || "No Name Provided",
      role: resumeData.role || "No Role Provided",
      phone: resumeData.phone || "No Phone Provided",
      email: resumeData.email || "No Email Provided",
      linkedin: resumeData.linkedin || "No LinkedIn Provided",
      location: resumeData.location || "No Location Provided",
      summary: resumeData.summary || "No Summary Provided",
      experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
      education: Array.isArray(resumeData.education) ? resumeData.education : [],
      skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
      achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements : [],
      courses: Array.isArray(resumeData.courses) ? resumeData.courses : [],
      projects: Array.isArray(resumeData.projects) ? resumeData.projects : []
    };

    let savedResume;
    if (resumeData._id) {
      savedResume = await Resume.findByIdAndUpdate(resumeData._id, formattedResume, { new: true });
      if (!savedResume) {
        return res.status(404).json({ message: "Resume not found for update" });
      }
    } else {
      const newResume = new Resume(formattedResume);
      savedResume = await newResume.save();
    }
    console.log("✅ Resume saved successfully:", savedResume);
    res.status(200).json({ message: "Resume saved successfully", data: savedResume });
  } catch (error) {
    console.error("❌ Error saving resume:", error);
    res.status(500).json({ message: "Error saving resume", error: error.message });
  }
};

// Enhance a single field with exponential backoff
const enhanceField = async (req, res) => {
  try {
    const { resumeId, field } = req.body;
    if (!resumeId || !field) {
      return res.status(400).json({ message: "Resume ID and field are required" });
    }
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    console.log(`✅ Found Resume Data for single field ${field}:`, resume);

    // Helper function to enhance a value with exponential backoff
    const enhanceValue = async (category, key, value) => {
      let retries = 3;
      let delay = 5000;
      while (retries > 0) {
        try {
          const result = await GeminiFunctionField(category, key, value);
          if (result && result.trim().length > 0) {
            return result;
          }
          return value;
        } catch (error) {
          console.error(`❌ Error enhancing ${category} field '${key}':`, error.message);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
      return value;
    };

    if (field === "summary") {
      resume.summary = await enhanceValue("summary", "summary", resume.summary);
    } else if (field === "skills") {
      resume.skills = await enhanceSkills(resume.skills);
    } else if (field === "experience") {
      resume.experience = await enhanceExperience(resume.experience);
    } else if (field === "achievements") {
      resume.achievements = await enhanceAchievements(resume.achievements);
    } else if (field === "courses") {
      resume.courses = await enhanceCourses(resume.courses);
    } else if (field === "projects") {
      resume.projects = await enhanceProjects(resume.projects);
    } else {
      return res.status(400).json({ message: `Field '${field}' not supported for enhancement` });
    }

    const updatedResume = await resume.save();
    console.log(`✅ Field ${field} enhanced and updated in DB:`, updatedResume);
    res.json({ message: `Field ${field} enhanced successfully`, data: updatedResume });
  } catch (error) {
    console.error("❌ Error enhancing field:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};
// PDF Generation and Download
const generateAndDownloadPDF = async (req, res) => {
  try {
    const { resumeData } = req.body;
    console.log("Resume Data:", resumeData);

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    const htmlContent = generateHTML(resumeData);
    const pdfBuffer = await generatePDF(htmlContent);

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

    // Send the PDF buffer as the response
    res.send(pdfBuffer);

    // Optional: Save the PDF to disk for debugging
    await fs.writeFile("savedResume.pdf", pdfBuffer);
    console.log("PDF saved to savedResume.pdf");
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};

// ✅ Function to generate HTML from resumeData (Corrected)
const generateHTML = (resumeData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume - ${resumeData?.name ?? "Unknown"}</title>
      <style>
        /* Base styles */
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          color: #333;
          font-size: 12pt;
        }

        /* Print-specific styles */
        @media print {
          body {
            padding: 0;
            font-size: 11pt;
          }
          .section {
            page-break-inside: avoid;
            break-inside: avoid-page;
          }
        }

        /* Layout styles */
        .header {
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 15px;
        }

        h1 {
          color: #2c3e50;
          margin: 5px 0;
          font-size: 28pt;
        }

        h2 {
          color: #34495e;
          margin: 20px 0 10px;
          font-size: 18pt;
          border-bottom: 1px solid #bdc3c7;
          padding-bottom: 5px;
          page-break-after: avoid;
        }

        .experience-item, .education-item, .course-item, .project-item {
          margin-bottom: 20px;
        }

        ul {
          padding-left: 20px;
        }

        /* Improved spacing and page-break handling */
        .section {
          margin-bottom: 25px;
          line-height: 1.5;
          page-break-inside: avoid;
        }

      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resumeData?.name ?? "Unknown"}</h1>
        <p>${resumeData?.role ?? ""}</p>
        <div class="contact-info">
          <p>${resumeData?.email ?? ""} | ${resumeData?.phone ?? ""}</p>
          <p>${resumeData?.linkedin ?? ""} | ${resumeData?.location ?? ""}</p>
        </div>
      </div>

      <!-- Summary Section -->
      ${resumeData?.summary ? `
      <div class="section">
        <h2>Summary</h2>
        <p>${resumeData.summary}</p>
      </div>` : ''}

      <!-- Experience Section -->
      ${resumeData?.experience?.length > 0 ? `
      <div class="section">
        <h2>Experience</h2>
        ${resumeData.experience.map(exp => `
          <div class="experience-item">
            <h3>${exp.companyName}</h3>
            <p><strong>${exp.title}</strong> | ${exp.date}</p>
            <p>${exp.description}</p>
            ${exp.accomplishment ? `<p><em>${exp.accomplishment}</em></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Education Section -->
      ${resumeData?.education?.length > 0 ? `
      <div class="section">
        <h2>Education</h2>
        ${resumeData.education.map(edu => `
          <div class="education-item">
            <h3>${edu.institution}</h3>
            <p>${edu.degree} (${edu.duration})</p>
            ${edu.grade ? `<p>Grade: ${edu.grade}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Skills Section -->
      ${resumeData?.skills?.length > 0 ? `
      <div class="section">
        <h2>Skills</h2>
        <ul>
          ${resumeData.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Courses Section -->
      ${resumeData?.courses?.length > 0 ? `
      <div class="section">
        <h2>Courses</h2>
        ${resumeData.courses.map(course => `
          <div class="course-item">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Projects Section -->
      ${resumeData?.projects?.length > 0 ? `
      <div class="section">
        <h2>Projects</h2>
        ${resumeData.projects.map(project => `
          <div class="project-item">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p>${project.duration}</p>
          </div>
        `).join('')}
      </div>` : ''}

    </body>
    </html>
  `;
};

// Helper function to generate PDF using Puppeteer
const generatePDF = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    const htmlContent = generateHTML(resumeData);

    await page.setContent(htmlContent, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm"
      }
    });

    await browser.close();

    // ✅ Fix: Set headers to ensure Postman treats the response as a binary PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });

    // ✅ Send PDF as binary data
    res.end(pdfBuffer);

  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};


module.exports = { createResume, saveResume, generatePDF, enhanceField };
