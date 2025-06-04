// temp6Routes.js
const express = require('express');
const router = express.Router();
const { saveResume, enhanceField, generatePDFTemp6 } = require('../controllers/temp6Controller');

// Routes
router.post('/save', saveResume);
router.post('/enhanceField', enhanceField);
router.post('/generate-pdf', generatePDFTemp6);

module.exports = router;