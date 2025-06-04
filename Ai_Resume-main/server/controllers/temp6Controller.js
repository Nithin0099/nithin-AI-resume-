// temp6Controller.js
require("dotenv").config();
const puppeteer = require("puppeteer");
const ResumeEditorModern = require("../models/temp6Model");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const saveResume = async (req, res) => {
  try {
    const { _id, ...resumeData } = req.body.resumeData;
    let savedResume;

    if (_id) {
      savedResume = await ResumeEditorModern.findByIdAndUpdate(_id, resumeData, { new: true });
      if (!savedResume)
         return res.status(404).json({ message: "Resume not found for update" });
    } else {
      const newResume = new ResumeEditorModern(resumeData);
      savedResume = await newResume.save();
    }

    res.status(200).json({ message: "Resume saved successfully", data: savedResume });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ message: "Error saving resume", error: error.message });
  }
};

const enhanceField = async (req, res) => {
  try {
    const { resumeId, field, data } = req.body;
    if (!resumeId || !field) return res.status(400).json({ message: "Resume ID and field are required" });

    const resume = await ResumeEditorModern.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    let prompt;
    if (field === 'experience') {
      prompt = `
Enhance the 'achievements' within the experience section of a professional resume.
- Transform into concise, powerful statements.
- Start with vivid action verbs (e.g., "Spearheaded," "Engineered").
- Quantify results with specific metrics where possible (e.g., "boosted efficiency by 25%").
- Optimize for ATS with keywords like "developed," "optimized," "led."
- Return an array of arrays, where each inner array contains enhanced achievements for each experience entry.
User Input: ${JSON.stringify(data)}
Return only valid JSON: ${JSON.stringify(data.map(() => []))}
      `;
    } else if (field === 'certifications') {
      prompt = `
Enhance the 'certifications' section of a professional resume.
- Improve wording to sound more professional and impactful.
- Include relevant details like issuer if applicable (e.g., "AWS Certified Solutions Architect - Amazon").
- Optimize for Applicant Tracking Systems (ATS).
- Return an array of strings (certification names only) wrapped in a "certifications" key.
User Input: ${JSON.stringify(data)}
Return only valid JSON: {"certifications": []}
      `;
    } else {
      prompt = `
Enhance the '${field}' section of a professional resume.
- Keep it concise and impactful.
- Use strong action verbs and measurable achievements.
- Optimize for Applicant Tracking Systems (ATS).
- Return a JSON object with the field name as the key.
User Input: ${JSON.stringify(data)}
Return only valid JSON: {"${field}": ""}
      `;
    }

    const result = await geminiModel.generateContent([prompt]);
    const responseText = result.response.text().trim();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");
    const cleanResponse = jsonMatch[0];
    const enhancedData = JSON.parse(cleanResponse);

    console.log(`Raw AI Response: ${responseText}`);
    console.log(`Parsed Enhanced Data: ${JSON.stringify(enhancedData)}`);

    if (field === 'experience') {
      resume.experience = resume.experience.map((exp, index) => ({
        ...exp,
        achievements: enhancedData[index] || exp.achievements
      }));
    } else if (field === 'certifications') {
      resume[field] = enhancedData.certifications || data;
    } else {
      resume[field] = enhancedData[field] || resume[field];
    }

    const updatedResume = await resume.save();
    res.status(200).json({ message: `${field} enhanced successfully`, data: updatedResume });
  } catch (error) {
    console.error("Error enhancing field:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

const generateHTMLTemp6 = (formData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume - ${formData.personalInfo.name}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 5mm; width: 210mm; box-sizing: border-box; }
        #modern-resume { width: 100%; overflow: visible; }
        @page { size: A4; margin: 5mm; }
        ul { break-inside: avoid; }
      </style>
    </head>
    <body>
      <div id="modern-resume" class="bg-white shadow-xl rounded-lg">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-12">
          <h1 class="text-4xl font-bold">${formData.personalInfo.name}</h1>
          <p class="text-xl mt-2">${formData.personalInfo.title}</p>
          <div class="mt-4 flex flex-wrap gap-4">
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              ${formData.personalInfo.email}
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              ${formData.personalInfo.phone}
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              ${formData.personalInfo.location}
            </div>
          </div>
        </div>
        <div class="px-8 py-6">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Professional Summary</h2>
            <p class="text-gray-600 leading-relaxed">${formData.summary}</p>
          </div>
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
            ${formData.experience.map(exp => `
              <div class="mb-6">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-700">${exp.title}</h3>
                    <p class="text-gray-600">${exp.company}</p>
                  </div>
                  <div class="text-gray-500">${exp.duration}</div>
                </div>
                <ul class="mt-2 list-disc list-inside text-gray-600">
                  ${Array.isArray(exp.achievements) ? exp.achievements.map(achievement => `<li>${achievement}</li>`).join('') : '<li>No achievements listed</li>'}
                </ul>
              </div>
            `).join('')}
          </div>
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Education</h2>
            ${formData.education.map(edu => `
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-700">${edu.degree}</h3>
                    <p class="text-gray-600">${edu.school}</p>
                  </div>
                  <div class="text-gray-500">${edu.duration}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            <div class="flex flex-wrap gap-2">
              ${formData.skills.map(skill => `<span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">${skill}</span>`).join('')}
            </div>
          </div>
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
            <ul class="list-disc list-inside text-gray-600">
              ${Array.isArray(formData.certifications) && formData.certifications.length > 0 
                ? formData.certifications.map(cert => `<li>${cert}</li>`).join('') 
                : '<li>No certifications listed</li>'}
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePDFTemp6 = async (req, res) => {
  try {
    const { formData, resumeId } = req.body;
    let pdfData = formData;

    if (resumeId) {
      const savedResume = await ResumeEditorModern.findById(resumeId);
      if (!savedResume) return res.status(404).json({ message: "Resume not found" });
      pdfData = savedResume.toObject();
    } else if (!formData) {
      return res.status(400).json({ message: "Form data or resume ID is required" });
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const htmlContent = generateHTMLTemp6(pdfData);

    await page.setContent(htmlContent, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
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

module.exports = { saveResume, enhanceField, generatePDFTemp6 };