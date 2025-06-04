const express = require("express");
// import { enhanceResume,handleGeneratePdf,getResume,saveResume } from "../controllers/resumeControllerTemp3.js";
const { enhanceResume, handleGeneratePdf, getResume, saveResume } = require("../controllers/resumeControllerTemp3.js");


const routerTemp3 = express.Router();

routerTemp3.post("/enhance", enhanceResume);  // POST /api/enhance
routerTemp3.post("/generate-pdf",handleGeneratePdf)
routerTemp3.post("/resume/save",saveResume)
routerTemp3.get("/resume",getResume)

module.exports = routerTemp3;
