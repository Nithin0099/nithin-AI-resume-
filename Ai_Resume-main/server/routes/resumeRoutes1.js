const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/controller"); // ✅ Ensure path is correct

// ✅ Fix Routes
router.post("/create", resumeController.createResume);
router.post("/save", resumeController.saveResume);
router.post("/generate-pdf", resumeController.generatePDF);
router.post("/enhanceField", resumeController.enhanceField);

module.exports = router;
