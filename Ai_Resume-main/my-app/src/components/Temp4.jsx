import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Temp4.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCog, FaPlus, FaTrash, FaCalendarAlt, FaRobot } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Temp4 = () => {
  const [resume, setResume] = useState({
    email: "balu@gmail.com",
    name: "BALU",
    designation: "FULL STACK DEVELOPER | VIDEO EDITOR | UI/UX",
    contact: "+91 9959029270 | balu@gmail.com | www.linkedin.com/balu",
    summary: [
      "Developed and optimized machine learning models for [specific project/task].",
      "Implemented deep learning models using TensorFlow/PyTorch.",
    ],
    skills: ["FRONTEND", "BACKEND", "PYTHON DEVELOPER", "PROBLEM SOLVER"],
    experience: [
      {
        title: "SENIOR DEVELOPER",
        company: "ACCENTURE",
        dates: { from: "JAN 2020", to: "MAR 2023" },
        details: "DESIGNING WEB APPLICATIONS.",
      },
    ],
    achievements: [
      {
        title: "Best Junior Graphic Designer",
        achievements: [
          "Designed branding materials, improving brand identity for clients.",
          "Developed a new branding strategy for a startup, resulting in a 25% rise in customer engagement.",
        ],
      },
    ],
    education: [
      { degree: "Bachelors of Technology", date: "June 2019", school: "PARUL UNIVERSITY, GUJARAT" },
    ],
    courses: [
      { title: "WEB DEVELOPER", issuedby: "IBM", date: "January 2020" },
    ],
    languages: ["English", "Hindi"],
    projects: [
      {
        title: "Brand Revitalization Campaign",
        dates: "2022",
        description: "Led a brand revitalization campaign that resulted in a significant increase in brand recognition and customer loyalty.",
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    designation: true,
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    achievements: true,
    education: true,
    courses: true,
    languages: true,
    projects: true,
  });
  const settingsRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Email validation function
  const isValidEmail = (email) => {
    const trimmedEmail = email.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^@\s]+$/;
    return re.test(trimmedEmail);
  };

  // Helper function to extract email from contact
  const extractEmailFromContact = (contact) => {
    const emailMatch = contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : "balu@gmail.com"; // Fallback to default if no email is found
  };

  useEffect(() => {
    const loadSavedResume = async () => {
      // Skip if using placeholder email
      if (resume.email === "balu@gmail.com") return;
      if (!isValidEmail(resume.email)) {
        console.warn("Invalid email format, skipping resume load.");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/temp4/load`, {
          params: { email: resume.email },
        });
        if (response.data?.data) {
          console.log("Loaded resume from backend:", response.data.data);
          setResume(response.data.data);
        } else {
          console.log("No resume found for email:", resume.email);
        }
      } catch (error) {
        console.error("Failed to load saved resume:", error);
        if (error.response?.status !== 404) {
          alert("Error loading resume: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadSavedResume();

    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [resume.email]);

  const createResume = async () => {
    if (!isValidEmail(resume.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!resume.name) {
      alert("Please enter a name.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/temp4/create`, { resumeData: resume });
      if (response.data?.data?._id) {
        setResume((prev) => ({ ...prev, _id: response.data.data._id }));
        alert("✅ Resume created successfully!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Load existing resume on conflict
        setResume(error.response.data.data);
        alert("⚠ Resume already exists. Loaded existing resume.");
      } else {
        console.error("❌ Resume Creation Error:", error);
        alert("Failed to create resume: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!resume._id) {
      alert("Resume ID missing! Create a resume first.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/temp4/save`, { resumeData: resume });
      if (response.data?.data?._id) {
        setResume(response.data.data);
        alert("✅ Resume saved successfully!");
      }
    } catch (error) {
      console.error("❌ Error saving resume:", error);
      alert("Failed to save resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIEnhancement = async () => {
    if (!resume._id) {
      await createResume();
      alert("Resume created. Click AI Assistant again.");
      return;
    }
    setShowEnhancementOptions(true);
  };

  const enhanceSingleField = async (field) => {
    if (!resume._id) {
      alert("Please save your resume before enhancing a field.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/temp4/enhanceField`, {
        resumeId: resume._id,
        field,
      });
      if (response.data?.data) {
        setResume(response.data.data);
        alert(`${field} enhanced successfully!`);
      }
    } catch (error) {
      console.error(`Error enhancing ${field}:`, error);
      alert(`Failed to enhance ${field}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/temp4/generate-pdf`,
        { resumeData: resume },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF.");
    } finally {
      setLoading(false);
    }
  };

  // Remaining functions
  const handleSelectSection = (section) => {
    if (section === "ai_assistant") {
      handleAIEnhancement();
    }
  };

  const handleToggleField = (field) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...resume.skills];
    updatedSkills[index] = value;
    setResume({ ...resume, skills: updatedSkills });
  };

  const addSkill = () => {
    setResume({ ...resume, skills: [...resume.skills, "New Skill"] });
  };

  const removeSkill = (index) => {
    const updatedSkills = resume.skills.filter((_, i) => i !== index);
    setResume({ ...resume, skills: updatedSkills });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        { title: "New Position", company: "New Company", dates: { from: "MM/YYYY", to: "MM/YYYY" }, details: "Details here" },
      ],
    });
  };

  const removeExperience = (index) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index),
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...resume.experience];
    if (field === "from" || field === "to") {
      updatedExperience[index].dates[field] = value;
    } else {
      updatedExperience[index][field] = value;
    }
    setResume({ ...resume, experience: updatedExperience });
  };

  const addAchievement = () => {
    setResume({
      ...resume,
      achievements: [
        ...resume.achievements,
        { title: "New Achievement", achievements: ["New achievement detail"] },
      ],
    });
  };

  const removeAchievement = (index) => {
    setResume({
      ...resume,
      achievements: resume.achievements.filter((_, i) => i !== index),
    });
  };

  const handleAchievementChange = (index, value) => {
    const updatedAchievements = [...resume.achievements];
    updatedAchievements[index].title = value;
    setResume({ ...resume, achievements: updatedAchievements });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        { degree: "New Degree", date: "MM/YYYY", school: "New School" },
      ],
    });
  };

  const removeEducation = (index) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index),
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...resume.education];
    updatedEducation[index][field] = value;
    setResume({ ...resume, education: updatedEducation });
  };

  const addCourse = () => {
    setResume({
      ...resume,
      courses: [
        ...resume.courses,
        { title: "New Course", issuedby: "Issuer", date: "MM/YYYY" },
      ],
    });
  };

  const removeCourse = (index) => {
    setResume({
      ...resume,
      courses: resume.courses.filter((_, i) => i !== index),
    });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...resume.courses];
    updatedCourses[index][field] = value;
    setResume({ ...resume, courses: updatedCourses });
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...resume.languages];
    updatedLanguages[index] = value;
    setResume({ ...resume, languages: updatedLanguages });
  };

  const addLanguage = () => {
    setResume({ ...resume, languages: [...resume.languages, "New Language"] });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = resume.languages.filter((_, i) => i !== index);
    setResume({ ...resume, languages: updatedLanguages });
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[index][field] = value;
    setResume({ ...resume, projects: updatedProjects });
  };

  const addProject = () => {
    setResume({
      ...resume,
      projects: [
        ...resume.projects,
        { title: "New Project", dates: "MM/YYYY", description: "Description here" },
      ],
    });
  };

  const removeProject = (index) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="resume-main-container flex">
  <Sidebar
    onAddSection={() => {}}
    onSelectSection={handleSelectSection}
    handleDownloadPDF={handleDownloadPDF}
    saveResume={saveResume}
  />
  <div className="main-content w-full">
  {loading && (
  <div className="loader-overlay">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="loader mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  </div>
)}
      {showEnhancementOptions && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Enhance Specific Field</h4>
            {["summary", "skills", "experience", "achievements", "courses", "languages", "projects"].map((field) => (
              <button
                key={field}
                className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600"
                onClick={() => enhanceSingleField(field)}
              >
                Enhance {field.charAt(0).toUpperCase() + field.slice(1)}
              </button>
            ))}
            <button
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              onClick={() => setShowEnhancementOptions(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="resume-wrapper flex bg-gray shadow-lg rounded-lg w-full max-w-[1000px] p-4 relative">
        {activeSection === "name" && (
          <FaCog
            className="absolute top-10 right-10 cursor-pointer text-gray-600 text-xl"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
          />
        )}

        <div
          id="resume-content"
          className="w-full"
          onClick={() => {
            setActiveSection(null);
            setShowSettings(false);
          }}
        >
          <div
            className="name-section text-left pb-6"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSection("name");
            }}
          >
            {visibleFields.name && (
              <div
                className="resume-name-input font-bold text-3xl"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setResume({ ...resume, name: e.target.textContent })}
              >
                {resume.name}
              </div>
            )}
            {visibleFields.designation && (
              <div
                className="resume-designation-input text-lg text-black-700"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setResume({ ...resume, designation: e.target.textContent })}
              >
                {resume.designation}
              </div>
            )}
            {visibleFields.contact && (
              <div
                className="resume-contact-input text-sm text-black-700"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newContact = e.target.textContent;
                  const newEmail = extractEmailFromContact(newContact);
                  setResume((prev) => ({ ...prev, contact: newContact, email: newEmail }));
                }}
              >
                {resume.contact}
              </div>
            )}
          </div>

          {showSettings && (
            <div
              className="settings-popup p-4 bg-gray-100 rounded-lg shadow-lg absolute top-12 right-4"
              ref={settingsRef}
              onClick={(e) => e.stopPropagation()}
            >
              {["name", "designation", "contact", "summary", "skills", "experience", "achievements", "education", "courses", "languages", "projects"].map((field) => (
                <div key={field} className="toggle-row flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
                  <label className="relative inline-block w-10 h-5">
                    <input
                      type="checkbox"
                      checked={visibleFields[field]}
                      onChange={() => handleToggleField(field)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className={`slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition ${
                        visibleFields[field] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition transform ${
                          visibleFields[field] ? "translate-x-5" : ""
                        }`}
                      ></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="resume-summary-skills-container gap-6">
            {visibleFields.summary && (
              <div
                className="resume-summary-section pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("profile");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2">Profile</h3>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="text-gray-700 mt-2"
                  onBlur={(e) => setResume({ ...resume, summary: e.target.textContent.split("\n") })}
                >
                  {resume.summary.join("\n")}
                </div>
              </div>
            )}
            {visibleFields.skills && (
              <div
                className="resume-skills-section pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("skills");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2">Key Skills</h3>
                <ul className="resume-list text-gray-700 mt-2">
                  {resume.skills.map((skill, index) => (
                    <li key={index}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSkillChange(index, e.target.textContent)}
                      >
                        {skill}
                      </div>
                    </li>
                  ))}
                  {activeSection === "skills" && (
                    <div className="flex gap-3 mt-3">
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded shadow"
                        onClick={addSkill}
                      >
                        <FaPlus /> New Skill
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                        onClick={() => removeSkill(resume.skills.length - 1)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>

          {visibleFields.experience && (
            <div
              className="resume-experience-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("experience");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">Work Experience</h3>
              {resume.experience.map((exp, index) => (
                <div key={index} className="experience-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  <div
                    className="text-lg font-semibold"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleExperienceChange(index, "title", e.target.textContent)}
                  >
                    {exp.title}
                  </div>
                  <div
                    className="text-gray-700 mt-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleExperienceChange(index, "company", e.target.textContent)}
                  >
                    {exp.company}
                  </div>
                  <div className="text-gray-700 mt-2 text-sm flex gap-2">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleExperienceChange(index, "from", e.target.textContent)}
                    >
                      {exp.dates.from}
                    </div>
                    <span>-</span>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleExperienceChange(index, "to", e.target.textContent)}
                    >
                      {exp.dates.to}
                    </div>
                  </div>
                  <div
                    className="text-gray-700 mt-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleExperienceChange(index, "details", e.target.textContent)}
                  >
                    {exp.details}
                  </div>
                  {activeSection === "experience" && (
                    <div className="mt-2 flex gap-3">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white shadow"
                        onClick={addExperience}
                      >
                        <FaPlus /> New Experience
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                        onClick={() => removeExperience(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {visibleFields.achievements && (
            <div
              className="resume-achievements-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("achievements");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">Achievements</h3>
              {resume.achievements.map((ach, index) => (
                <div key={index} className="achievement-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  <div
                    className="text-lg font-semibold"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleAchievementChange(index, e.target.textContent)}
                  >
                    {ach.title}
                  </div>
                  <ul className="resume-list text-gray-700 mt-2">
                    {ach.achievements.map((detail, detailIndex) => (
                      <li key={detailIndex}>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const updated = [...resume.achievements];
                            updated[index].achievements[detailIndex] = e.target.textContent;
                            setResume({ ...resume, achievements: updated });
                          }}
                        >
                          {detail}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {activeSection === "achievements" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addAchievement}
                      >
                        <FaPlus /> New Achievement
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                        onClick={() => removeAchievement(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {visibleFields.education && (
            <div
              className="resume-education-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("education");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">Education</h3>
              {resume.education.map((edu, index) => (
                <div key={index} className="education-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  <div
                    className="text-lg font-semibold"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleEducationChange(index, "degree", e.target.textContent)}
                  >
                    {edu.degree}
                  </div>
                  <div
                    className="text-gray-700 mt-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleEducationChange(index, "school", e.target.textContent)}
                  >
                    {edu.school}
                  </div>
                  <div
                    className="text-gray-700 mt-2 text-sm"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleEducationChange(index, "date", e.target.textContent)}
                  >
                    {edu.date}
                  </div>
                  {activeSection === "education" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addEducation}
                      >
                        <FaPlus /> New Education
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                        onClick={() => removeEducation(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {visibleFields.courses && (
            <div
              className="resume-courses-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("courses");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">Courses</h3>
              {resume.courses.map((course, index) => (
                <div key={index} className="course-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  <div
                    className="text-lg font-semibold"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleCourseChange(index, "title", e.target.textContent)}
                  >
                    {course.title}
                  </div>
                  <div
                    className="text-gray-700 mt-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleCourseChange(index, "issuedby", e.target.textContent)}
                  >
                    {course.issuedby}
                  </div>
                  <div
                    className="text-gray-700 mt-2 text-sm"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleCourseChange(index, "date", e.target.textContent)}
                  >
                    {course.date}
                  </div>
                  {activeSection === "courses" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addCourse}
                      >
                        <FaPlus /> New Course
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                        onClick={() => removeCourse(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {visibleFields.languages && (
            <div
              className="resume-languages-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("languages");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">Languages</h3>
              <ul className="resume-list text-gray-700 mt-2">
                {resume.languages.map((language, index) => (
                  <li key={index}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleLanguageChange(index, e.target.textContent)}
                    >
                      {language}
                    </div>
                  </li>
                ))}
                {activeSection === "languages" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded shadow"
                      onClick={addLanguage}
                    >
                      <FaPlus /> New Language
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                      onClick={() => removeLanguage(resume.languages.length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </ul>
            </div>
          )}

          {visibleFields.projects && (
            <div
              className="resume-projects-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("projects");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">Projects</h3>
              {resume.projects.map((project, index) => (
                <div key={index} className="project-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  <div
                    className="text-lg font-semibold"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleProjectChange(index, "title", e.target.textContent)}
                  >
                    {project.title}
                  </div>
                  <div
                    className="text-gray-700 mt-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleProjectChange(index, "dates", e.target.textContent)}
                  >
                    {project.dates}
                  </div>
                  <div
                    className="text-gray-700"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleProjectChange(index, "description", e.target.textContent)}
                  >
                    {project.description}
                  </div>
                  {activeSection === "projects" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addProject}
                      >
                        <FaPlus /> New Project
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                        onClick={() => removeProject(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Temp4;