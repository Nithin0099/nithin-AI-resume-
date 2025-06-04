const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/temp5Controller");

// Updated Routes
router.post("/save", resumeController.saveResume);       
router.get("/load", resumeController.loadResume);       
router.post("/generate-pdf", resumeController.generatePDF); 
router.post("/enhanceField", resumeController.enhanceField); 

module.exports = router;