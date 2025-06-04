import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

export const handleGeneratePdf = async (req, res) => {
  let browser;
  try {
    const { clientURL } = req.body;
    if (!clientURL) {
      return res.status(400).json({ message: "Client URL is required" });
    }

    console.log("✅ Received request to generate PDF from:", clientURL);
  
    // 1️⃣ Launch Puppeteer and open the frontend URL
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(clientURL, { waitUntil: "networkidle2" });

    // 2️⃣ Remove the Left Section and Hide Sidebars/Buttons
    await page.waitForSelector("#resume-container", { visible: true });

    await page.evaluate(async () => {
      const leftSection = document.querySelector(".left-section"); // Change selector if needed
      if (leftSection) leftSection.remove(); // Completely remove left section

      document.querySelectorAll("button, .sidebar, .nav").forEach(el => {
        el.style.display = "none"; // Hide buttons and sidebars
      });
      await  new Promise((resolve) => {
        setTimeout(resolve, 2000); // Wait 3 seconds for state updates
      });
    });

    // 3️⃣ Get the resume section's exact dimensions
    const resumeElement = await page.$("#resume-container");
    if (!resumeElement) {
      throw new Error("Resume container not found!");
    }

    const boundingBox = await resumeElement.boundingBox();
    if (!boundingBox) {
      throw new Error("Unable to get bounding box of resume container.");
    }

    // 4️⃣ Generate PDF with only the resume section
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    });

    await browser.close();

    // 5️⃣ Send the generated PDF
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
  finally {
    await browser.close(); // Ensure the browser is closed
  }
};


router.post("/generate-pdf", async (req, res) => {
  try {
    console.log("Generating PDF...");
    handleGeneratePdf(req,res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
