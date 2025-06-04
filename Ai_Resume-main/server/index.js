// // const express = require("express");
// // const cors = require("cors");
// // require("dotenv").config();
// // const path = require("path");
// // const bodyParser = require("body-parser");
// // const connectDB = require("./config/db");
// // const formRoutes = require("./routes/formRoutes");
// // const connectToMongo=require('./config/resumedb');
// // const resumeRoutes = require("./routes/resumeRoutes");
// // const connectEditable = require("./config/editableResume");
// // // const editRouter = require("./routes/editableResume")


// // const app = express();
// // const port = process.env.port || 5000;

// // // Middleware
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json());
// // app.use(cors());
// // app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// // app.use(express.static(path.join(__dirname, "../client/build")));
// // app.use(bodyParser.json());

// // // Connect to MongoDB
// // connectDB();
// // connectToMongo();
// // connectEditable();


// // // Use routes
// // app.use("/api", formRoutes);
// // app.use("/output", resumeRoutes);
// // // app.use("/api/editresume",editRouter);

// // app.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirname, "../enhancecv/public/index.html"));
// // });

// // // Start server
// // app.listen(port, () => {
// //   console.log(`Server running on http://localhost:${port}`);
// // });


// // server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectToMongo = require("./config/resume1.config");
// // Import routes
// const  router = require('./routes/resume1.route');
// // const router1 = require('./routes/resumeRoutes')


// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware setup
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// connectToMongo();


// // Use routes
// app.use('/api/resume',router);
// app.use('/api/auth',require('./routes/auth'))

// // app.use("/output", router1);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




const fs = require('fs');
const pdfParse = require('pdf-parse');
const ejs = require('ejs');

async function extractTextFromPDF(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdfParse(dataBuffer);
        return data.text.trim();
    } catch (error) {
        console.error("Error reading PDF:", error);
        return "";
    }
}

function categorizeText(text) {
    const sections = {
        profile: [], key_expertise: [], project_experience: [],
        education: [], languages: [], certifications: [], links: []
    };
    
    const lines = text.split("\n");
    let currentSection = "profile";
    
    const sectionHeaders = {
        "KEY EXPERTISE": "key_expertise",
        "PROJECT EXPERIENCE": "project_experience",
        "EDUCATION": "education",
        "LANGUAGES": "languages",
        "CERTIFICATIONS": "certifications",
        "LINKS": "links"
    };
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        for (const [header, section] of Object.entries(sectionHeaders)) {
            if (line.toUpperCase().includes(header)) {
                currentSection = section;
                line = line.replace(header, "").trim();
            }
        }
        
        sections[currentSection].push(line);
    }
    
    return Object.fromEntries(Object.entries(sections).map(([key, value]) => [key, value.length ? value.join("<br>") : "N/A"]));
}

function generateHTML(sections, outputHtml) {
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Resume Extracted Content</title>
        <script>
            function copyToClipboard(id) {
                var text = document.getElementById(id).innerText;
                navigator.clipboard.writeText(text).then(() => {
                    alert("Copied to clipboard!");
                });
            }
        </script>
    </head>
    <body>
        <h1>Resume Extracted Content</h1>
        <% for (const [section, content] of Object.entries(sections)) { %>
            <h2><%= section.replace('_', ' ').toUpperCase() %></h2>
            <div contenteditable="true" id="<%= section %>" style="border: 1px solid black; padding: 10px; min-height: 50px;">
                <%= content %>
            </div>
            <button onclick="copyToClipboard('<%= section %>')">Copy</button>
        <% } %>
    </body>
    </html>`;

    const htmlContent = ejs.render(template, { sections });
    fs.writeFileSync(outputHtml, htmlContent, 'utf8');
    console.log(`Generated HTML saved to ${outputHtml}`);
}

async function main(pdfPath, outputHtml) {
    const text = await extractTextFromPDF(pdfPath);
    if (!text) {
        console.error("No text extracted from PDF.");
        return;
    }
    console.log("Extracted Text:\n", text);
    
    const sections = categorizeText(text);
    generateHTML(sections, outputHtml);
}

const pdfFilePath = "C:/Users/Thinkpad T480/Downloads/sakshi_resume.pdf"; // Change to your PDF path
const outputHtmlPath = "output.html";
main(pdfFilePath, outputHtmlPath);