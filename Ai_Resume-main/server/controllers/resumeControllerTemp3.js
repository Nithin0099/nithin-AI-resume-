const puppeteer = require("puppeteer");
const { enhanceWithGemini } = require('../services/geminiService.js');
const ResumeTemp3 = require("../models/resumeModel.js");

const enhanceResume = async (req, res) => {
  try {
    const { section, content, experienceTitle, experienceYears, skills, education } = req.body;

    console.log("Received API request for enhancement:", req.body);

    if (!section || !content) {
      return res.status(400).json({ error: "Missing section or content" });
    }

    let enhancedContent;

    if (section === "profile") {
      enhancedContent = await enhanceWithGemini(section, {
        content,
        experienceTitle,
        experienceYears,
        skills,
        education,
      });
    } else if (section === "experience" || section === "projects") {
      enhancedContent = await Promise.all(
        content.map(async (item) => {
          const enhancedText = await enhanceWithGemini(section, item.description || item.bullets);
          return {
            id: item.id,
            ...(section === "experience" ? { bullets: enhancedText } : { description: enhancedText }),
          };
        })
      );
    } else {
      return res.status(400).json({ error: "Invalid section provided" });
    }

    if (!enhancedContent || (Array.isArray(enhancedContent) && enhancedContent.length === 0)) {
      console.error("Unexpected AI response:", enhancedContent);
      return res.status(500).json({ error: "AI returned an invalid response" });
    }

    console.log("Sending AI-enhanced response:", enhancedContent);
    res.json({ section, enhancedContent });
  } catch (error) {
    console.error("Error enhancing resume:", error);
    res.status(500).json({ error: "Failed to enhance resume", details: error.message });
  }
};

const handleGeneratePdf = async (req, res) => {
  try {
    const { clientURL } = req.body;
    if (!clientURL) {
      return res.status(400).json({ message: "Client URL is required" });
    }

    console.log("✅ Received request to generate PDF from:", clientURL);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(clientURL, { waitUntil: "networkidle2" });

    console.log("Waiting for #resume-container...");
    await page.waitForSelector("#resume-container", { visible: true, timeout: 60000 });

    console.log("Applying ATS-friendly styles...");
    await page.addStyleTag({
      content: `
        * {
          font-family: Arial, sans-serif !important;
          color: #000 !important;
        }
        body {
          font-size: 12pt !important;
          background: white !important;
        }
        h1, h2, h3 {
          font-size: 14pt !important;
          font-weight: bold !important;
        }
        .sidebar, .no-print, button, .nav, .download-button {
          display: none !important;
        }
        p, li, td, th, span, div {
          font-size: 12pt !important;
          line-height: 1.5;
        }
        #resume-container {
          padding: 20px;
        }
      `,
    });

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};

const saveResume = async (req, res) => {
  try {
    const { profileSectionText, experiences, projects, education, certifications, skills } = req.body;

    console.log("Received data to save:", req.body);

    let resume = await ResumeTemp3.findOne();
    if (!resume) {
      resume = new ResumeTemp3({});
    }

    resume.profile = profileSectionText;
    resume.experiences = experiences;
    resume.projects = projects;
    resume.education = education;
    resume.certifications = certifications;
    resume.skills = skills;

    await resume.save();
    res.json({ message: "Resume saved successfully!" });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ error: "Failed to save resume", details: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await ResumeTemp3.findOne();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};


module.exports = {getResume, enhanceResume, handleGeneratePdf, saveResume} ;
