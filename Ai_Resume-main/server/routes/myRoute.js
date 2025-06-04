
const express = require('express');
const router = express.Router();
const { saveResume, enhanceField,getResume,downloadPDF } = require('../controllers/myTempController');

// Routes
router.post('/save', saveResume);
router.post('/enhance', enhanceField);
router.get("/resume/:id", getResume); //
router.get("/download/:resumeId", downloadPDF);

module.exports = router;