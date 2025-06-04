const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    header: {
      name: { type: String },
      title: { type: String },
      contact: {
        phone: { type: String },
        email: { type: String },
        location: { type: String },
      },
    },
    summary: { type: String },
    experience: [
      {
        id: { type: Number },
        title: { type: String },
        company: { type: String },
        period: { type: String },
        description: { type: String },
        achievements: [{ type: String }],
      },
    ],
    achievements: [
      {
        id: { type: Number },
        title: { type: String },
        description: { type: String },
        year: { type: String },
      },
    ],
    projects: [
      {
        id: { type: Number },
        title: { type: String },
        description: { type: String },
        technologies: { type: String },
        year: { type: String },
      },
    ],
    education: [
      {
        id: { type: Number },
        school: { type: String },
        degree: { type: String },
        period: { type: String },
      },
    ],
    skills: {
      clientSide: { type: String },
      serverSide: { type: String },
      devOps: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temp5Resume", resumeSchema);