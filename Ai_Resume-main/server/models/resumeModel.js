// import mongoose from "mongoose";
const mongoose = require("mongoose");

const ResumeTemp3Schema = new mongoose.Schema({
  profile: String,
  experiences: [
    {
      id: { type: String, required: true },
      title: String,
      company: String,
      duration: String,
      bullets: [String],
    },
  ],
  projects: [
    {
      id: { type: String, required: true },
      name: String,
      description: String,
      technologies: String,
    },
  ],
  education: [
    {
      id: { type: String, required: true },
      degree: String,
      institution: String,
      duration: String,
    },
  ],
  certifications: [
    {
      id: { type: String, required: true },
      name: String,
      organization: String,
      issuedDate: String,
    },
  ],  
  skills: [String],
});

module.exports = mongoose.model("ResumeTemp3", ResumeTemp3Schema);