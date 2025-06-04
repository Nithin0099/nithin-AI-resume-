const mongoose = require("mongoose");

const temp4ResumeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String },
    contact: { type: String },
    summary: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    experience: [
      {
        title: { type: String },
        company: { type: String },
        dates: {
          from: { type: String },
          to: { type: String },
        },
        details: { type: String },
      },
    ],
    achievements: [
      {
        title: { type: String },
        achievements: { type: [String], default: [] },
      },
    ],
    education: [
      {
        degree: { type: String },
        date: { type: String },
        school: { type: String },
      },
    ],
    courses: [
      {
        title: { type: String },
        issuedby: { type: String },
        date: { type: String },
      },
    ],
    languages: { type: [String], default: [] },
    projects: [
      {
        title: { type: String },
        dates: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temp4Resume", temp4ResumeSchema);