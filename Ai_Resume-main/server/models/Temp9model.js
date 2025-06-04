
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String },
    phone: { type: String },
    email: { type: String },
    linkedin: { type: String },
    location: { type: String },
    summary: { type: String },
    experience: [
      {
        title: { type: String },
        companyName: { type: String },
        Startdate: { type: String },
        end_data: { type: String },
        companyLocation: { type: String },
        description: { type: String },
        accomplishment: { type: String },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        duration: { type: String },
        grade: { type: String },
      },
    ],
    achievements: [
      {
        keyAchievements: { type: String },
        describe: { type: String },
      },
    ],
    courses: [
      {
        title: { type: String },
        platform: { type: String },
        institution: { type: String },
        description: { type: String }
      },
    ],
    skills: { type: [String], default: [] },
    projects: [
      {
        title: { type: String },
        description: { type: String },
        duration: { type: String },
      },
    ],
    certifications: [
      {
        certificates: { type: String },
        link: { type: String },
        issueDate: { type: String },
        expiryDate: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temp9Resume", resumeSchema);