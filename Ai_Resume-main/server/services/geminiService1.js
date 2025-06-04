const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

const enhanceWithGemini = async (section, data) => {

  try {
    let prompt;

    if (section === "summary") {
      prompt = `You are an expert in resume writing. Enhance the following profile summary using the given details. Make it more impactful, professional, and concise.

      ### **Candidate Details:**
      ${data}

      ### **Instructions**
      - Focus on achievements, strengths, and unique value.
      - Use strong action words (e.g., "Led", "Optimized", "Developed").
      - Keep the summary within 3-4 lines (around 40-60 words).
      - Do NOT include bullet points or explanations—only the enhanced summary.

      Now, generate the improved profile summary:`;
    } else if (section === "projects" || section === "experience") {
      const dataArray = Array.isArray(data) ? data : data.split("\n").filter(line => line.trim() !== "");

      prompt = `You are a resume expert. Improve the following **${section}** bullet points while keeping the **original information intact**.
      - Do **NOT** replace content with placeholders like "[Skill 1]" or "[Industry]".
      - Use **strong action verbs** (e.g., "Developed", "Led", "Optimized").
      - Improve clarity, grammar, and professionalism.
      - Retain the same number of bullet points and order.

      ### **Original Bullet Points:**
      ${dataArray.map((line, index) => `${index + 1}. ${line}`).join("\n")}

      Now, return the improved bullet points in the **exact same order**, separated by newline characters:`;
    } else if (section === "achievements") {
      const describeContent = data[0].describe   
      console.log("🚀 Enhancing section with data:", section, describeContent);
      prompt = `You are an expert in resume writing. Enhance the following profile achievement using the given details. Make it more impactful, professional, and concise.

      
      ${describeContent}

      ### **Instructions**
      - Focus on achievements, strengths, and unique value.
      - Use strong action words for achievements .
      - Keep the achievements strictly within 20 words.
      - Do NOT include bullet points or explanations—only the enhanced acheivements .

      Now, generate the improved profile achievement:`;
     
    }

    const requestData = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
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
// Change this 👇
module.exports = {
  enhanceWithGemini
};
