const { body, validationResult } = require("express-validator");

/**
 * Middleware to validate resume data before processing.
 */
const validateResume = [
  // Required fields
  body("resumeData.name").notEmpty().withMessage("Name is required."),
  body("resumeData.email")
    .isEmail()
    .withMessage("A valid email is required."),
  body("resumeData.phone")
    .isString()
    .notEmpty()
    .withMessage("Phone number is required."),
  
  // Optional but validated fields
  body("resumeData.linkedin")
    .optional()
    .isString()
    .withMessage("LinkedIn must be a string."),
  body("resumeData.location")
    .optional()
    .isString()
    .withMessage("Location must be a string."),
  body("resumeData.summary")
    .optional()
    .isString()
    .withMessage("Summary must be a string."),

  // Validate arrays: Experience, Education, Achievements, Courses, Projects
  body("resumeData.experience")
    .optional()
    .isArray()
    .withMessage("Experience should be an array."),
  body("resumeData.experience.*.companyName")
    .optional()
    .isString()
    .withMessage("Company Name should be a string."),
  body("resumeData.experience.*.title")
    .optional()
    .isString()
    .withMessage("Title should be a string."),
  body("resumeData.experience.*.description")
    .optional()
    .isString()
    .withMessage("Description should be a string."),
  
  body("resumeData.education")
    .optional()
    .isArray()
    .withMessage("Education should be an array."),
  body("resumeData.education.*.degree")
    .optional()
    .isString()
    .withMessage("Degree should be a string."),
  body("resumeData.education.*.institution")
    .optional()
    .isString()
    .withMessage("Institution should be a string."),

  body("resumeData.achievements")
    .optional()
    .isArray()
    .withMessage("Achievements should be an array."),
  body("resumeData.achievements.*.describe")
    .optional()
    .isString()
    .withMessage("Achievement description should be a string."),

  body("resumeData.skills")
    .optional()
    .isArray()
    .withMessage("Skills should be an array."),

  body("resumeData.projects")
    .optional()
    .isArray()
    .withMessage("Projects should be an array."),
  body("resumeData.projects.*.title")
    .optional()
    .isString()
    .withMessage("Project title should be a string."),
  body("resumeData.projects.*.description")
    .optional()
    .isString()
    .withMessage("Project description should be a string."),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateResume };
