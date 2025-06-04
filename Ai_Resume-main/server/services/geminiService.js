//import axios from "axios";
//import dotenv from "dotenv";
const axios = require("axios");
const dotenv = require("dotenv");


dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

 const enhanceWithGemini = async (section, data) => {
  try {
    let prompt;
    
    if (section === "profile") {
      // const { profile, experienceTitle, experienceYears, skills, education } = data;

      prompt = `You are an expert in resume writing. Enhance the following profile summary using the given details. Make it more impactful, professional, and concise. 

### **Candidate Details:**
- **Job Title:** ${data.experienceTitle}
- **Years of Experience:** ${data.experienceYears} years
- **Key Skills:** ${data.skills}
- **Education:** ${data.education}
- **Existing Profile Summary:** ${data.content}  

### **Instructions**
- Focus on achievements, strengths, and unique value.  
- Use strong action words (e.g., "Led", "Optimized", "Developed").  
- Keep the summary within 3-4 lines (around 40-60 words).  
- Do NOT include bullet points or explanations—only the enhanced summary.  


Now, generate the improved profile summary:`;

    } else if (section === "projects") {
      prompt = `You are an expert at improving resume project descriptions. Improve the descriptions below while keeping them concise, professional, and impactful. 
    
    ### **Enhancement Rules:**
    - Keep descriptions the same length but improve clarity and professionalism.
    - Use strong action verbs (e.g., "Developed", "Optimized", "Engineered").
    - Add measurable impact where relevant (e.g., "Reduced processing time by 30%").
    - Avoid redundant phrases and keep a formal tone.
    
    ### **Original Descriptions:**
    ${data.split("\n").map((line, index) => `${index + 1}. ${line}`).join("\n")}
    
    Now, return the improved descriptions **in the same order** without numbering:`;
    }
    
    else {
      prompt = `You are an expert resume writer. Improve the following resume bullet points while keeping the same number of lines.
    
    ### **Enhancement Guidelines:**
    - Retain the same number of bullet points without merging or removing.
    - Improve grammar, clarity, and professionalism.
    - Avoid reusing the exact same words—use synonyms and varied phrasing.
    - Where possible, add quantifiable metrics (e.g., "Increased revenue by 20%").
    - Ensure the output is concise, impactful, and free from filler words.
    - Remove any unnecessary empty lines in the response.
    - Preserve important industry-specific keywords.
    - Use clear, concise, and professional language.
    - Dont do numbering to the content strictly telling
    - Dont add any prefix or suffix to the content (either number, special characters etc).
    - Maintain standard resume formatting for ATS readability.
    - Use strong action verbs and quantifiable achievements where possible.
    
    ### **Original Bullet Points:**
    ${data.split("\n").map((line, index) => `${index + 1}. ${line}`).join("\n")}
    
    Now, return the improved bullet points as it is and stricly follow the guidelines `;
    }
    
    const requestData = {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      requestData
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Enhancement failed.";

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw new Error("Failed to fetch from Gemini API");
  }
};

module.exports = { enhanceWithGemini };
