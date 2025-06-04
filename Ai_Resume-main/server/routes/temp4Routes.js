const express = require("express");
const router = express.Router();
const temp4Controller = require("../controllers/temp4Controller");

router.post("/create", temp4Controller.createResume);
router.post("/save", temp4Controller.saveResume);
router.get("/load", temp4Controller.loadResume);
router.post("/enhanceField", temp4Controller.enhanceField);
router.post("/generate-pdf", temp4Controller.generatePDF);

module.exports = router;