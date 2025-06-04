const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  personalInfo: {
    name: String,
    title: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
  },
  summary: String,
  experience: [
    {
      title: String,
      company: String,
      location: String,
      duration: String,
      achievements: [String],
    },
  ],
  education: [
    {
      degree: String,
      school: String,
      location: String,
      duration: String,
    },
  ],
  skills: [String],
  certifications: [String],
}, { timestamps: true });

module.exports = mongoose.model("ResumeEditorModern", resumeSchema);
