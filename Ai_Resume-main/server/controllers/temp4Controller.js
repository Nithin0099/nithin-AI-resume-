require("dotenv").config();
const axios = require("axios");
const Temp4Resume = require("../models/Temp4Resume.model");
const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Load a resume by email
 */
const loadResume = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const resume = await Temp4Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ data: resume });
  } catch (error) {
    console.error("Failed to load saved resume:", error);
    res.status(500).json({ message: "Error loading resume", error: error.message });
  }
};

/**
 * Create a new resume
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

    const existingResume = await Temp4Resume.findOne({ email });
    if (existingResume) {
      return res.status(409).json({ message: "Resume already exists", data: existingResume });
    }

    const newResume = new Temp4Resume(req.body.resumeData);
    const savedResume = await newResume.save();

    console.log("✅ Created Resume ID:", savedResume._id);
    res.status(201).json({ message: "Resume created successfully", data: savedResume });
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

/**
 * Save (update or create) a resume
 */
const saveResume = async (req, res) => {
  try {
    const resumeData = req.body.resumeData;
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }
    console.log("🔹 Received Resume Data for Saving:", resumeData);

    const formattedResume = {
      name: resumeData.name || "No Name Provided",
      designation: resumeData.designation || "No Designation Provided",
      contact: resumeData.contact || "No Contact Provided",
      email: resumeData.email || "No Email Provided",
      summary: Array.isArray(resumeData.summary) ? resumeData.summary : [],
      skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
      experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
      achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements : [],
      education: Array.isArray(resumeData.education) ? resumeData.education : [],
      courses: Array.isArray(resumeData.courses) ? resumeData.courses : [],
      languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
      projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
    };

    let savedResume;
    if (resumeData._id) {
      savedResume = await Temp4Resume.findByIdAndUpdate(resumeData._id, formattedResume, { new: true });
      if (!savedResume) {
        return res.status(404).json({ message: "Resume not found for update" });
      }
    } else {
      const newResume = new Temp4Resume(formattedResume);
      savedResume = await newResume.save();
    }
    console.log("✅ Resume saved successfully:", savedResume);
    res.status(200).json({ message: "Resume saved successfully", data: savedResume });
  } catch (error) {
    console.error("❌ Error saving resume:", error);
    res.status(500).json({ message: "Error saving resume", error: error.message });
  }
};

/**
 * Enhance a single field with AI
 */
const enhanceSingleField = async (category, fieldName, userInput) => {
  try {
    let additionalInstruction = "";
    if (category === "skills") {
      additionalInstruction = `
      - Ensure the skill remains concise (5 words max).
      - Do not rephrase it into long sentences.
      - Focus on using industry-specific keywords only.
      `;
    }

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
    const cleanResponse = responseText.replace(/```json|```/g, "").trim();
    const parsedResponse = JSON.parse(cleanResponse);
    return parsedResponse[fieldName] || userInput;
  } catch (error) {
    console.error(`Error enhancing ${category} field '${fieldName}':`, error);
    return userInput;
  }
};

/**
 * Enhance a specific field
 */
const enhanceField = async (req, res) => {
  try {
    const { resumeId, field } = req.body;
    if (!resumeId || !field) {
      return res.status(400).json({ message: "Resume ID and field are required" });
    }
    const resume = await Temp4Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (field === "summary") {
      resume.summary = await Promise.all(
        resume.summary.map(async (item) => await enhanceSingleField("summary", "summaryItem", item))
      );
    } else if (field === "skills") {
      resume.skills = await Promise.all(
        resume.skills.map(async (skill) => await enhanceSingleField("skills", "skill", skill))
      );
    } else if (field === "experience") {
      resume.experience = await Promise.all(
        resume.experience.map(async (exp) => {
          const enhancedDetails = await enhanceSingleField("experience", "details", exp.details);
          return { ...exp, details: enhancedDetails };
        })
      );
    } else if (field === "achievements") {
      resume.achievements = await Promise.all(
        resume.achievements.map(async (ach) => {
          const enhancedAchievements = await Promise.all(
            ach.achievements.map(async (item) =>
              await enhanceSingleField("achievements", "achievement", item)
            )
          );
          return { ...ach, achievements: enhancedAchievements };
        })
      );
    } else if (field === "courses") {
      resume.courses = await Promise.all(
        resume.courses.map(async (course) => {
          const enhancedTitle = await enhanceSingleField("courses", "title", course.title);
          return { ...course, title: enhancedTitle };
        })
      );
    } else if (field === "languages") {
      resume.languages = await Promise.all(
        resume.languages.map(async (language) => await enhanceSingleField("languages", "language", language))
      );
    } else if (field === "projects") {
      resume.projects = await Promise.all(
        resume.projects.map(async (project) => {
          const enhancedTitle = await enhanceSingleField("projects", "title", project.title);
          const enhancedDescription = await enhanceSingleField("projects", "description", project.description);
          return { ...project, title: enhancedTitle, description: enhancedDescription };
        })
      );
    } else {
      return res.status(400).json({ message: `Unsupported field: ${field}` });
    }

    const updatedResume = await resume.save();
    res.status(200).json({ message: `${field} enhanced successfully`, data: updatedResume });
  } catch (error) {
    console.error("Error enhancing field:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

/**
 * Generate PDF
 */
const generateTemp4HTML = (resumeData) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .resume-wrapper { max-width: 800px; margin: auto; padding: 20px; }
          .resume-name-input { font-size: 24px; font-weight: bold; }
          .resume-designation-input { font-size: 18px; color: #555; }
          .resume-contact-input { font-size: 14px; color: #777; }
          .resume-summary-section, .resume-skills-section, .resume-experience-section,
          .resume-achievements-section, .resume-education-section, .resume-courses-section,
          .resume-languages-section, .resume-projects-section {
            margin-bottom: 20px;
          }
          h3 { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; }
          ul { list-style-type: disc; margin-left: 20px; }
          .education-item, .course-item { margin-bottom: 15px; display: block; }
        </style>
      </head>
      <body>
        <div class="resume-wrapper">
          <div class="resume-name-input">${resumeData.name || "N/A"}</div>
          <div class="resume-designation-input">${resumeData.designation || "N/A"}</div>
          <div class="resume-contact-input">${resumeData.contact || "N/A"}</div>
          <div class="resume-summary-section">
            <h3>Profile</h3>
            <p>${resumeData.summary.join("<br>") || "N/A"}</p>
          </div>
          <div class="resume-skills-section">
            <h3>Key Skills</h3>
            <ul>${resumeData.skills.map((skill) => `<li>${skill}</li>`).join("") || "<li>N/A</li>"}</ul>
          </div>
          <div class="resume-experience-section">
            <h3>Work Experience</h3>
            ${resumeData.experience
              .map(
                (exp) => `
              <div>
                <strong>${exp.title || "N/A"}</strong> at ${exp.company || "N/A"}<br>
                ${exp.dates.from || "N/A"} - ${exp.dates.to || "N/A"}<br>
                ${exp.details || "N/A"}
              </div>
            `
              )
              .join("") || "N/A"}
          </div>
          <div class="resume-achievements-section">
            <h3>Key Achievements</h3>
            ${resumeData.achievements
              .map(
                (ach) => `
              <div>
                <strong>${ach.title || "N/A"}</strong><br>
                <ul>${ach.achievements.map((item) => `<li>${item}</li>`).join("") || "<li>N/A</li>"}</ul>
              </div>
            `
              )
              .join("") || "N/A"}
          </div>
          <div class="resume-education-section">
            <h3>Education</h3>
            ${resumeData.education
              .map(
                (edu) => `
              <div class="education-item">
                ${edu.degree || "N/A"}<br>
                ${edu.school || "N/A"}<br>
                (${edu.date || "N/A"})
              </div>
            `
              )
              .join("") || "<div class='education-item'>N/A</div>"}
          </div>
          <div class="resume-courses-section">
            <h3>Courses</h3>
            ${resumeData.courses
              .map(
                (course) => `
              <div class="course-item">
                ${course.title || "N/A"}<br>
                ${course.issuedby || "N/A"}<br>
                (${course.date || "N/A"})
              </div>
            `
              )
              .join("") || "<div class='course-item'>N/A</div>"}
          </div>
          <div class="resume-languages-section">
            <h3>Languages</h3>
            <ul>${resumeData.languages.map((lang) => `<li>${lang}</li>`).join("") || "<li>N/A</li>"}</ul>
          </div>
          <div class="resume-projects-section">
            <h3>Projects</h3>
            ${resumeData.projects
              .map(
                (proj) => `
              <div>
                <strong>${proj.title || "N/A"}</strong><br>
                ${proj.dates || "N/A"}<br>
                ${proj.description || "N/A"}
              </div>
            `
              )
              .join("") || "N/A"}
          </div>
        </div>
      </body>
    </html>
  `;
};

const generatePDF = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // Generate a unique temporary directory for this session
    const tempDir = path.join(
      require("os").tmpdir(),
      `puppeteer_profile_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    );

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", `--user-data-dir=${tempDir}`],
      timeout: 60000, // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();
    const htmlContent = generateTemp4HTML(resumeData);
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    await browser.close();

    // Clean up the temporary directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn("Failed to clean up temporary directory:", cleanupError.message);
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    // Ensure the app doesn't crash on error
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};

module.exports = { createResume, saveResume, loadResume, enhanceField, generatePDF };