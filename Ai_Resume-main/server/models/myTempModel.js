const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: { type: String },
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
      date: { type: String },
      companyLocation: { type: String },
      accomplishment: [{ type: String }],
    },
  ],

  education: [
    {
      degree: { type: String },
      institution: { type: String },
      duration: { type: String },
      location: { type: String },
    },
  ],

  achievements: [
    {
      keyAchievements: { type: String },
      describe: { type: String },
    },
  ],

  
  skills: [
    {
      category: String,
      items: [String],
    },
  ],

  
  languages: [
    {
      name: String,
      level: String,
      dots: Number,
    },
  ],

  projects: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Mytemp", resumeSchema);
