import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCog, FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import Sidebar2 from "./Sidebar2";
import "./Temp7.css";
import axios from "axios";

export const Temp7 = () => {
  const [resume, setResume] = useState({
    name: "NITHYA SREE",
    designation: "Graphic Designer | Logo Design Specialist | UX Optimization",
    contact: "+91 9876543210  |  nithya@gmail.com  |  www.linkedin.com/in/nithya",
    summary: [
      "Creative and skilled Graphic Designer with over 3 years of experience in logo design, posters, flyers, business cards, and invitations.",
      "Proficient in using various design tools to create visually compelling designs that align with clients' needs and brand identity.",
      "Passionate about developing unique visual concepts and delivering impactful design solutions."
    ],
    skills: ["User -Centered Design", "Adobe Illustrator", "Adobe Photoshop", "Wireframing & Prototyping"],
    experience: [
      {
        title: "Junior Graphic Designer",
        company: "XYZ Design Studio",
        dates: { from: "March 2021", to: "Present" },
        details: "Designed branding materials, improving brand identity for clients."
      }
    ],
    achievements: [
      {
        title: "Best Junior Graphic Designer",
        achievements: [
          "Designed branding materials, improving brand identity for clients.",
          "Developed a new branding strategy for a startup, resulting in a 25% rise in customer engagement."
        ]
      }
    ],
    education: [
      { degree: "Bachelor of Fine Arts in Graphic Design", date: "June 2020", school: "Madras University, Chennai" }
    ],
    courses: [
      { title: "Graphic Design Specialization", issuedby: "Google", date: "January 2020" },
    ],
    languages: [],
    projects: []

  });

  const [resumeSections, setResumeSections] = useState([]);
  
  const handleAddSection = (sectionid) => {
    setResumeSections((prevSections) => [...prevSections, sectionid]);
  };  
  

  const [activeSection, setActiveSection] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    designation: true,
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    title: true,
    company: true,
    dates: true,
    details: true,
    achievements: true,
    education: true,
    degree: true,
    school: true,
    issuedby: true
  });

  const [showDatePicker, setShowDatePicker] = useState(null);
  const [dateType, setDateType] = useState("from");
  const [presentChecked, setPresentChecked] = useState(false);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);
  const [showExperienceSettings, setShowExperienceSettings] = useState(false);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(null);
  const [showEducationSettings, setShowEducationSettings] = useState(false);
  const [showAchievementsSettings, setShowAchievementsSettings] = useState(false);
  const [selectedAchievementIndex, setSelectedAchievementIndex] = useState(null);
  const [showCoursesSettings, setShowCoursesSettings] = useState(false);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowExperienceSettings(null);
        setShowAchievementsSettings(false);
        setShowEducationSettings(false);
        setShowCoursesSettings(false);
        setShowSettings(false);
      }
      
    };
     // Fetch resume data from backend
    const email = "neel.grey@example.com";  // Replace with actual user email
    axios.get(`http://localhost:5000/api/resume/load?email=${email}`)
      .then(response => setResume(response.data))
      .catch(error => console.error("Error fetching resume:", error));

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

const saveResume = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/resume/save", {
      resumeData: resume
    });
    if (response.data?.data?._id) {
      setResume(prev => ({ ...prev, _id: response.data.data._id }));
      alert("Resume saved successfully!");
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    alert("Failed to save resume.");
  }
};

const enhanceSingleField = async (category, fieldName, userInput) => {
  try {
    const prompt = `Enhance this ${category} field '${fieldName}': ${userInput}`;
    const result = await geminiModel.generateContent([prompt]);
    return result.response.text().trim();
  } catch (error) {
    return userInput;
  }
};


const downloadPdf = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/resume/generate-pdf",
      { resumeData: resume },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Download failed:", error);
    alert("PDF generation failed.");
  }
};

  const handleSelectSection = (section) => {
    console.log("Selected Section:", section);
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
    if (index !== null && resume.skills.length > 0) {
      const updatedSkills = [...resume.skills];
      updatedSkills.splice(index, 1);
      setResume({ ...resume, skills: updatedSkills });
    }
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        { title: "New Position", company: "New Company", dates: { from: "MM/YYYY", to: "MM/YYYY" }, details: "Details here" }
      ]
    });
  };

  const removeExperience = (index) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index)
    });
  };

  const updateDate = (date, index) => {
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace(",", "");
    const updatedExperience = [...resume.experience];
    updatedExperience[index].dates[dateType] = formattedDate;
    if (dateType === "to" && presentChecked) {
      updatedExperience[index].dates.to = "Present";
    }
    setResume({ ...resume, experience: updatedExperience });
  };

  const addAchievement = () => {
    setResume({
      ...resume,
      achievements: [
        ...resume.achievements,
        { title: "New Achievement", achievements: ["Achievement details"] }
      ]
    });
  };

  const removeAchievement = (index) => {
    setResume({
      ...resume,
      achievements: resume.achievements.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        { degree: "New Degree", dates: { from: "MM/YYYY", to: "MM/YYYY" }, school: "New School" }
      ]
    });
  };

  const removeEducation = (index) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index)
    });
  };

  const addCourses = () => {
    setResume({
      ...resume,
      courses: [
        ...resume.courses,
        { title: "New title", issuedby: "New Issued by", dates: { from: "MM/YYYY", to: "MM/YYYY" } }
      ]
    });
  };

  const removeCourses = (index) => {
    setResume({
      ...resume,
      courses: resume.courses.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="resume-main-container flex">
      <Sidebar2
        onAddSection={handleAddSection}
        onSelectSection={handleSelectSection}
        downloadPdf={downloadPdf}
      />

      {/* Main Content Area */}
      <div className="main-content w-full">
        <div className="resume-wrapper flex bg-white shadow-lg rounded-lg w-full max-w-[1000px] p-4 relative">
          {activeSection === "name" && (
            <FaCog
              className="absolute top-10 right-10 cursor-pointer text-gray-600 text-xl"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
            />
          )}

          <div id="resume-content" className="w-full">
            {/* Name Section */}
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
                >
                  {resume.name}
                </div>
              )}
              {visibleFields.designation && (
                <div
                  className="resume-designation-input text-lg text-black-700"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {resume.designation}
                </div>
              )}
              {visibleFields.contact && (
                <div
                  className="resume-contact-input text-sm text-black-700"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {resume.contact}
                </div>
              )}
            </div>

            {/* Settings Popup */}
            {showSettings && (
              <div
                className="settings-popup p-4 bg-gray-100 rounded-lg shadow-lg absolute top-12 right-4"
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  "name",
                  "designation",
                  "contact",
                  "summary",
                  "skills",
                  "experience",
                  "achievements",
                  "education",
                  "courses",
                  "languages",
                  "projects",
                ].map((field) => (
                  <div
                    key={field}
                    className="toggle-row flex justify-between items-center mb-2"
                  >
                    <span className="text-sm font-medium">
                      Show {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
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

            {/* Profile & Skills Section */}
            <div className="resume-summary-skills-container gap-6">
              {/* Profile Section */}
              {visibleFields.summary && (
                <div
                  className="resume-summary-section pb-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSection("profile");
                  }}
                >
                  <h3 className="text-lg font-bold uppercase border-b pb-2">
                    Profile
                  </h3>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="text-gray-700 mt-2"
                  >
                    {resume.summary.join("\n")}
                  </div>
                </div>
              )}

              {/* Key Skills Section */}
              {visibleFields.skills && (
                <div
                  className="resume-skills-section pb-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSection("skills");
                  }}
                >
                  <h3 className="text-lg font-bold uppercase border-b pb-2">
                    Key Skills
                  </h3>
                  <ul className="resume-list text-gray-700 mt-2">
                    {resume.skills.map((skill, index) => (
                      <li key={index}>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleSkillChange(index, e.target.textContent)
                          }
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

            {/* Experience Section */}
            {visibleFields.experience && (
              <div
                className="resume-experience-section w-full pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("experience");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">
                  Work Experience
                </h3>
                {resume.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="experience-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
                  >
                    <div
                      className="text-lg font-semibold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleExperienceChange(
                          index,
                          "title",
                          e.target.textContent
                        )
                      }
                    >
                      {exp.title}
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleExperienceChange(
                          index,
                          "company",
                          e.target.textContent
                        )
                      }
                    >
                      {exp.company}
                    </div>
                    <div className="text-gray-700 mt-2 text-sm flex gap-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleExperienceChange(
                            index,
                            "from",
                            e.target.textContent
                          )
                        }
                      >
                        {exp.dates.from}
                      </div>
                      <span>-</span>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleExperienceChange(
                            index,
                            "to",
                            e.target.textContent
                          )
                        }
                      >
                        {exp.dates.to}
                      </div>
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleExperienceChange(
                          index,
                          "details",
                          e.target.textContent
                        )
                      }
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

            {/* Achievements Section */}
            {visibleFields.achievements && (
              <div
                className="resume-achievements-section w-full pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("achievements");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">
                  Achievements
                </h3>
                {resume.achievements.map((ach, index) => (
                  <div
                    key={index}
                    className="achievement-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
                  >
                    <div
                      className="text-lg font-semibold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleAchievementChange(index, e.target.textContent)
                      }
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
                              updated[index].achievements[detailIndex] =
                                e.target.textContent;
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

            {/* Education Section */}
            {visibleFields.education && (
              <div
                className="resume-education-section w-full pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("education");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">
                  Education
                </h3>
                {resume.education.map((edu, index) => (
                  <div
                    key={index}
                    className="education-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
                  >
                    <div
                      className="text-lg font-semibold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleEducationChange(
                          index,
                          "degree",
                          e.target.textContent
                        )
                      }
                    >
                      {edu.degree}
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleEducationChange(
                          index,
                          "school",
                          e.target.textContent
                        )
                      }
                    >
                      {edu.school}
                    </div>
                    <div
                      className="text-gray-700 mt-2 text-sm"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleEducationChange(
                          index,
                          "date",
                          e.target.textContent
                        )
                      }
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

            {/* Courses Section */}
            {visibleFields.courses && (
              <div
                className="resume-courses-section w-full pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("courses");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">
                  Courses
                </h3>
                {resume.courses.map((course, index) => (
                  <div
                    key={index}
                    className="course-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
                  >
                    <div
                      className="text-lg font-semibold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleCourseChange(index, "title", e.target.textContent)
                      }
                    >
                      {course.title}
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleCourseChange(
                          index,
                          "issuedby",
                          e.target.textContent
                        )
                      }
                    >
                      {course.issuedby}
                    </div>
                    <div
                      className="text-gray-700 mt-2 text-sm"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleCourseChange(index, "date", e.target.textContent)
                      }
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

            {/* Languages Section */}
            {visibleFields.languages && (
              <div
                className="resume-languages-section w-full pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("languages");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">
                  Languages
                </h3>
                <ul className="resume-list text-gray-700 mt-2">
                  {resume.languages.map((language, index) => (
                    <li key={index}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleLanguageChange(index, e.target.textContent)
                        }
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
                        onClick={() =>
                          removeLanguage(resume.languages.length - 1)
                        }
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </ul>
              </div>
            )}

            {/* Projects Section */}
            {visibleFields.projects && (
              <div
                className="resume-projects-section w-full pb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("projects");
                }}
              >
                <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">
                  Projects
                </h3>
                {resume.projects.map((project, index) => (
                  <div
                    key={index}
                    className="project-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
                  >
                    <div
                      className="text-lg font-semibold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleProjectChange(
                          index,
                          "title",
                          e.target.textContent
                        )
                      }
                    >
                      {project.title}
                    </div>
                    <div
                      className="text-gray-700 mt-2"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleProjectChange(
                          index,
                          "dates",
                          e.target.textContent
                        )
                      }
                    >
                      {project.dates}
                    </div>
                    <div
                      className="text-gray-700"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleProjectChange(
                          index,
                          "description",
                          e.target.textContent
                        )
                      }
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

export default Temp7;