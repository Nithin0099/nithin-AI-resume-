const express = require("express");
const router = express.Router();

// Dummy inline functions to ensure it works — replace later with real logic
const getResume = (req, res) => {
  res.send("Get resume working!");
};

const saveResume = (req, res) => {
  res.send("Save resume working!");
};

const enhanceResume = (req, res) => {
  res.send("Enhance resume working!");
};

const generatePDF = (req, res) => {
  res.send("Generate PDF working!");
};

// Routes
router.get("/get", getResume);
router.post("/save", saveResume);
router.post("/enhance", enhanceResume);
router.post("/generate-pdf", generatePDF);

module.exports = router;
