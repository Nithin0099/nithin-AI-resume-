const express = require("express");
const { getResume, saveResume, enhanceResume, generatePDF } = require("../controllers/temp8Controller");

const router = express.Router();

router.get("/get", getResume);
router.post("/save", saveResume);
router.post("/enhance", enhanceResume);
router.post("/generate-pdf", generatePDF);

module.exports = router;