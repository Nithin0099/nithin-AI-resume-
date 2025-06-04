// api.jsx
import axios from "axios";

export const fetchResume = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/temp3/resume");
    console.log("Fetched resume data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
};

export const saveResume = async (resumeData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/temp3/resume/save",
      resumeData
    );
    console.log("Resume saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw error;
  }
};

export const downloadResumePDF = async (clientURL) => {
  console.log("📤 Sending request to generate PDF for:", clientURL);
  try {
    const response = await axios.post(
      "http://localhost:5000/api/temp3/generate-pdf",
      { clientURL },
      { responseType: "blob" }
    );
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error("❌ Error downloading PDF:", error);
    return null;
  }
};

export const enhanceResumeSection = async (section, data) => {
  try {
    const response = await axios.post("http://localhost:5000/api/temp3/enhance", data);
    return response.data.enhancedContent;
  } catch (error) {
    console.error("Error enhancing resume section:", error);
    throw error;
  }
};