const mongoose = require('mongoose');

// Experience Schema
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  companyLocation: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  accomplishment: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Education Schema
const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  keyAchievements: {
    type: String,
    required: true,
    trim: true
  },
  describe: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Project Schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Main Resume Schema
const resumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\d\s\+\-\(\)]+$/.test(v);
      },
      message: 'Phone number contains invalid characters'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  linkedin: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  experience: {
    type: [experienceSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one experience entry is required'
    }
  },
  education: {
    type: [educationSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one education entry is required'
    }
  },
  achievements: {
    type: [achievementSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one achievement entry is required'
    }
  },
  courses: {
    type: [courseSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one course entry is required'
    }
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  projects: {
    type: [projectSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one project entry is required'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
resumeSchema.index({ email: 1 });
resumeSchema.index({ createdAt: -1 });

// Virtual for full name display
resumeSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.role}`;
});

// Pre-save middleware to clean and validate data
resumeSchema.pre('save', function(next) {
  // Clean skills array
  if (this.skills && Array.isArray(this.skills)) {
    this.skills = this.skills
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }
  
  next();
});

// Static method to find resume by email
resumeSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

// Instance method to get summary info
resumeSchema.methods.getSummaryInfo = function() {
  return {
    id: this._id,
    name: this.name,
    role: this.role,
    email: this.email,
    lastUpdated: this.updatedAt
  };
};

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;