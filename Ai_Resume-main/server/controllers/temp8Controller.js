const Temp8Resume = require("../models/Temp8Model.js");
const { enhanceWithGemini } = require("../services/geminiService1.js");
const puppeteer = require("puppeteer");

// ✅ Fetch Resume Data
const getResume = async (req, res) => {
  try {
    // console.log("✅ API hit! Fetching resume from DB...");
    
    const resume = await Temp8Resume.findOne();
    // console.log("🎯 Resume Data from DB:", resume);
    if (!resume) {
      console.log("❌ No resume found in database!");
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("🔥 Backend Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const saveResume = async (req, res) => {
  try {
    const { experience, ...otherData } = req.body;

    // Validate experience data
    if (experience && Array.isArray(experience)) {
      experience.forEach((exp, idx) => {
        if (!exp.title || !exp.companyName || !exp.date || !exp.companyLocation) {
          console.warn(`⚠️ Missing required fields in experience[${idx}]`);
          throw new Error(`Missing required fields in experience[${idx}]`);
        }
        if (!exp.accomplishment) {
          console.warn(`⚠️ Missing 'accomplishment' in experience[${idx}]`);
          exp.accomplishment = ""; // Initialize as an empty string if missing
        }
      });
    }

    // Check if a resume already exists
    const existingResume = await Resume.findOne();

    if (existingResume) {
      // Update only the fields provided in the request
      const updatedResume = await Temp8Resume.findByIdAndUpdate(
        existingResume._id,
        { $set: { ...otherData, experience } },
        { new: true, runValidators: true } // Return the updated document and validate the schema
      );
      console.log("✅ Resume updated successfully:", updatedResume);
      res.json({ message: "Resume updated successfully", resume: updatedResume });
    } else {
      // Create a new resume if none exists
      const newResume = await Resume.create({ ...otherData, experience });
      console.log("✅ New resume created successfully:", newResume);
      res.json({ message: "Resume created successfully", resume: newResume });
    }
  } catch (error) {
    console.error("🔥 Error saving resume:", error);
    res.status(500).json({ error: error.message });
  }
};
  

  
const enhanceResume = async (req, res) => {
  try {
    const { section, content } = req.body;

    // ✅ Ensure valid content before proceeding
    if (!section || !content || (typeof content !== "string" && !Array.isArray(content))) {
      console.error("❌ Invalid enhancement request:", { section, content });
      return res.status(400).json({ error: "Invalid request. Content must be a string or an array." });
    }

    console.log("Received API request for enhancement:", req.body);

    let enhancedContent;

    if (section === "summary") {
      // ✅ Enhance summary using AI
      enhancedContent = await enhanceWithGemini(section, content);
    } else if (section === "experience" || section === "projects") {
      // ✅ Ensure AI response retains `_id`
      enhancedContent = await Promise.all(
        content.map(async (item) => {
          const enhancedText = await enhanceWithGemini(section, item.accomplishment);
          return {
            _id: item._id, // ✅ Retain original ID
            bullets: enhancedText,
          };
        })
      );
    } else if (section === "achievements") {
      // ✅ Enhance skills and languages descriptions
      enhancedContent = await enhanceWithGemini(section, content);
    } else {
      return res.status(400).json({ error: "Invalid section provided" });
    }   

    // ✅ Ensure AI response is valid
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

const generatePDF = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
module.exports = { getResume, saveResume,enhanceResume, generatePDF  };

