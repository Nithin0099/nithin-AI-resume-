
const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  linkedin: { type: String, trim: true },
  location: { type: String, trim: true },
  summary: { type: String, trim: true },

  experience: [
    {
      title: { type: String, required: true, trim: true },
      companyName: { type: String, required: true, trim: true },
      date: { type: String, required: true, trim: true },
      companyLocation: { type: String, required: true, trim: true },
      accomplishment: { type: String, required: true, trim: true },
    },
  ],

  education: [
    {
      degree: { type: String, required: true, trim: true },
      institution: { type: String, required: true, trim: true },
      duration: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
    },
  ],

  achievements: [
    {
      keyAchievements: { type: String, required: true, trim: true },
      describe: { type: String, required: true, trim: true },
    },
  ],

  languages: [
    {
      name: { type: String, required: true, trim: true },
      level: { type: String, required: true, trim: true },
      dots: { type: Number, default: 0 },
    },
  ],

  skills: [
    {
      category: { type: String, required: true, trim: true },
      items: { type: [String], default: [] },
    },
  ],

  projects: [
    {
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      duration: { type: String, required: true, trim: true },
    },
  ],
},
{ timestamps: true } // ✅ Adds createdAt & updatedAt fields
);


module.exports = mongoose.model("Temp8Resume", ResumeSchema);
