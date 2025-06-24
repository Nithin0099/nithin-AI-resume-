import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Temp1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Temp2 = () => {
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);
  const [resumeData, setResumeData] = useState({
    name: "Your Name",
    role: "The role you are applying for?",
    phone: "Phone",
    email: "yourname@example.com",
    linkedin: "Linkedin/Portfolio",
    location: "Location",
    summary: "Briefly explain why you are a great fit for this role. I am a strong fit for the web developer role because of my comprehensive understanding of both frontend and backend technologies, including expertise in JavaScript, React, Node.js, and modern web development frameworks.",
    experience: [{
      title: 'Your Title',
      companyName: 'Company Name',
      date: 'Date',
      companyLocation: 'Company Location',
      description: 'Company Description. Web development company specializing in creating innovative, user-centric digital solutions.',
      accomplishment: 'Your accomplishment. Contributed significantly to high-profile projects.'
    }],
    education: [{
      degree: 'Btech/Information Technology',
      institution: 'School or University',
      duration: 'Date Period',
      grade: "GPA:8.5"
    }],
    achievements: [{
      keyAchievements: 'Your Achievement',
      describe: "Describe what you did. Consistently demonstrated exceptional technical skills and leadership."
    }],
    courses: [{
      title: 'Course Name',
      description: 'Course Description'
    }],
    skills: ['HTML, CSS', "Accounting & Budgeting", "Proficient with POS systems", "Excellent interpersonal and communication skills"],
    projects: [{
      title: 'Project Name',
      duration: 'Date period',
      description: 'Summary of your work. A weather app built with React to display real-time weather information.'
    }]
  });
  const [showButtons, setShowButtons] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const isValidEmail = (email) => {
    const trimmedEmail = email.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^@\s]+$/;
    return re.test(trimmedEmail);
  };

  useEffect(() => {
    const loadSavedResume = async () => {
      if (resumeData.email === "yourname@example.com") return;
      if (!isValidEmail(resumeData.email)) return;
      try {
        const response = await axios.get('http://localhost:5000/api/resume1/load', {
          params: { email: resumeData.email },
        });
        if (response.data?.data) {
          setResumeData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load saved resume:", error);
      }
    };
    loadSavedResume();
  }, [resumeData.email]);

  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    experience: true,
    education: true,
    achievements: true,
    skills: true,
    courses: true,
    projects: true,
  });

  const [isOpen, setIsOpen] = useState(false);

  const removeBlock = (block) => {
    setVisibleSections({ ...visibleSections, [block]: false });
  };

  const handleUserContent = (section, key, value, index = null) => {
    let sanitizedValue = value;
    if (section === "email") {
      sanitizedValue = value.replace(/[^\w@.-]/g, '').trim();
    }
    setResumeData(prevData => {
      const updatedData = { ...prevData };
      if (section === "skills") {
        updatedData.skills = sanitizedValue.split(",").map(skill => skill.trim());
      } else if (Array.isArray(updatedData[section])) {
        updatedData[section] = [...updatedData[section]];
        updatedData[section][index] = { ...updatedData[section][index], [key]: sanitizedValue };
      } else {
        updatedData[section] = sanitizedValue;
      }
      console.log("Updated resumeData:", updatedData);
      return updatedData;
    });
  };

  const addNewEntry = (section) => {
    setResumeData(prevData => {
      const updatedResumeData = { ...prevData };
      const newEntry = section === "experience" ? {
        title: 'Your Title',
        companyName: 'Company Name',
        date: 'Date',
        companyLocation: 'Company Location',
        description: 'Company Description',
        accomplishment: 'Your accomplishment'
      } : section === "education" ? {
        degree: 'Degree and Field of Study',
        institution: 'School or University',
        duration: 'Date Period',
        grade: "GPA:8.5"
      } : section === "courses" ? {
        title: 'Course Name',
        description: 'Course Description'
      } : section === "projects" ? {
        title: 'Project Name',
        duration: 'Date period',
        description: 'Project Summary'
      } : section === "achievements" ? {
        keyAchievements: 'Achievement Title',
        describe: 'Describe the achievement'
      } : null;

      if (newEntry) {
        updatedResumeData[section] = [...(updatedResumeData[section] || []), newEntry];
      }
      return updatedResumeData;
    });
  };

  const removeEntry = (section, index) => {
    setResumeData(prevData => {
      const updatedData = { ...prevData };
      updatedData[section] = updatedData[section].filter((_, i) => i !== index);
      return updatedData;
    });
  };

  const resumeRef = useRef(null);

  const handleAIEnhancement = async () => {
    const now = Date.now();
    const doubleClickThreshold = 300; // 300ms threshold for double click
    
    if (now - lastClickTime < doubleClickThreshold) {
      // Double click detected - close the enhancement options
      setShowEnhancementOptions(false);
      setLastClickTime(0);
      return;
    }
    
    setLastClickTime(now);
    
    if (!resumeData._id) {
      await createResume();
      alert("Resume created. Click AI Assistant again.");
      return;
    }
    setLoading(true);
    setShowEnhancementOptions(true);
    setLoading(false); 
  };

  const downloadPdf = async () => {
    try {
        setLoading(true);
        const response = await axios.post(
            "http://localhost:5000/api/resume1/generate-pdf",
            { resumeData },
            {
                responseType: "blob",
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response || !response.data || !(response.data instanceof Blob)) {
            throw new Error("Invalid PDF response");
        }

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `resume_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setLoading(false);
        }, 100);

    } catch (error) {
        console.error("Download failed:", error);
        alert("PDF generation failed. Please check your resume data.");
        setLoading(false);
    }
  };

  const createResume = async () => {
    if (!isValidEmail(resumeData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/resume1/create', { resumeData });
      if (response.data?.data?._id) {
        setResumeData(prev => ({ ...prev, _id: response.data.data._id }));
        alert("✅ Resume created successfully!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setResumeData(error.response.data.data);
        alert("Resume already exists. Loaded existing resume.");
      } else {
        console.error("❌ Resume Creation Error:", error);
        alert("Failed to create resume.");
      }
    }
  };

  const saveResume = async () => {
    if (!resumeData) {
      alert("No resume data to save!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/resume1/save", { resumeData });
      if (response.data?.data?._id) {
        setResumeData(prev => ({ ...prev, _id: response.data.data._id }));
        alert("Resume saved successfully!");
      }
    } catch (error) {
      console.error("❌ Error saving resume:", error);
      alert("Failed to save resume.");
    }
  };

  const enhanceSingleField = async (field, index = null) => {
    if (!resumeData._id) {
      await saveResume();
      alert("Please save your resume before enhancing a field.");
      return;
    }
    try {
      await saveResume();
      console.log(`🔹 Sending request to enhance ${field}:`, index !== null ? resumeData[field][index] : resumeData[field]);
  
      const response = await axios.post('http://localhost:5000/api/resume1/enhanceField', {
        resumeId: resumeData._id,
        field,
        index
      });
  
      if (response.data?.data) {
        console.log(`✅ Field ${field} enhanced:`, response.data.data);
        setResumeData(response.data.data);
        alert(`${field} enhanced successfully!`);
      }
    } catch (error) {
      console.error(`❌ Error enhancing ${field}:`, error);
      alert(`Failed to enhance ${field}.`);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 text-xs">
      <div className="hidden md:block w-1/6 bg-gray-800 text-white p-4 min-h-screen">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">Loading...</p>
            </div>
          </div>
        )}
        <button
          className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors"
          onClick={handleAIEnhancement}
        >
          🤖 AI Assistant
        </button>
        {showEnhancementOptions && (
          <div className="ai-field-enhancement mb-4 p-2 bg-gray-700 rounded">
            <h4 className="text-center mb-2 font-bold">Enhance Specific Field</h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("summary")}
              >
                Enhance Summary
              </button>
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("skills")}
              >
                Enhance Skills
              </button>
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("experience")}
              >
                Enhance All Experiences
              </button>
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("education")}
              >
                Enhance Education
              </button>
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("achievements")}
              >
                Enhance Achievements
              </button>
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("courses")}
              >
                Enhance Courses
              </button>
              <button
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => enhanceSingleField("projects")}
              >
                Enhance Projects
              </button>
            </div>
          </div>
        )}
        <button
          className="w-full bg-blue-500 text-white p-2 mb-2 rounded hover:bg-blue-600 transition-colors"
          onClick={saveResume}
        >
          Save Resume
        </button>
        <button
          className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
          onClick={downloadPdf}
        >
          ⬇️ Download
        </button>
      </div>

      <div className="md:hidden fixed left-4 right-2 z-50">
        <button
          className="bg-gray-800 text-white p-3 rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰ Menu
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 bg-gray-800 p-2 rounded shadow-lg mt-2">
            <button
              className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors"
              onClick={handleAIEnhancement}
            >
              🤖 AI Assistant
            </button>
            <button
              className="w-full bg-blue-500 text-white p-2 mb-2 rounded hover:bg-blue-600 transition-colors"
              onClick={saveResume}
            >
              Save Resume
            </button>
            <button
              className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
              onClick={downloadPdf}
            >
              ⬇️ Download
            </button>
          </div>
        )}
      </div>

      <div className="editResume w-6/7 bg-white p-4 ml-24">
        <div id="resumeBody">
          <div className="firstBlock">
            <div
              className="user-name"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUserContent("name", null, e.target.textContent)
              }
            >
              <h2 className="res-h2">{resumeData?.name}</h2>
            </div>
            <div
              className="user-role"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUserContent("role", null, e.target.textContent)
              }
            >
              {resumeData?.role}
            </div>
            <div className="user-contacts">
              {resumeData?.phone && (
                <div className="user-phone">
                  <FontAwesomeIcon icon={faPhone} />{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleUserContent("phone", null, e.target.textContent)
                    }
                  >
                    {resumeData.phone}
                  </span>
                  {" | "}
                </div>
              )}
              {resumeData?.email && (
                <div className="user-email">
                  <FontAwesomeIcon icon={faEnvelope} />{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleUserContent("email", null, e.target.textContent)
                    }
                  >
                    {resumeData.email}
                  </span>
                  {" | "}
                </div>
              )}
              {resumeData?.linkedin && (
                <div className="user-linkedin">
                  <FontAwesomeIcon icon={faLinkedin} />{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleUserContent("linkedin", null, e.target.textContent)
                    }
                  >
                    {resumeData.linkedin}
                  </span>
                  {" | "}
                </div>
              )}
              {resumeData?.location && (
                <div className="user-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleUserContent("location", null, e.target.textContent)
                    }
                  >
                    {resumeData.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {visibleSections.summary && (
            <div>
              <div className="summaryblock">
                <h3 className="headings">Summary</h3>
                <div
                  className="user-summary"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUserContent("summary", null, e.target.textContent)
                  }
                >
                  {resumeData?.summary}
                </div>
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("summary")}
              >
                Remove Summary
              </button>
            </div>
          )}

          {visibleSections.experience && (
            <div>
              <div className="experienceblock">
                <h3 className="headings">Experience</h3>
                {resumeData?.experience?.map((exp, idx) => (
                  <div key={idx} className="user-experience">
                    <div className="exp1">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "experience",
                            "companyName",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para1">{exp.companyName}</p>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "experience",
                            "companyLocation",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para2">{exp.companyLocation}</p>
                      </div>
                    </div>
                    <div className="exp1">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "experience",
                            "title",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para1">{exp.title}</p>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "experience",
                            "date",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para2">{exp.date}</p>
                      </div>
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "experience",
                          "description",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      {exp.description}
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "experience",
                          "accomplishment",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      {exp.accomplishment}
                    </div>
                    <div className="flex gap-2">
                      {resumeData?.experience?.length > 1 && (
                        <button
                          onClick={() => removeEntry("experience", idx)}
                          className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                          Remove
                        </button>
                      )}
                      <button
                        onClick={() => addNewEntry("experience")}
                        className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        + New Entry
                      </button>
                      {showEnhancementOptions && (
                        <button
                          onClick={() => enhanceSingleField("experience", idx)}
                          className="enhance-btn bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                          Enhance This
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {resumeData?.experience?.length === 0 && (
                  <button
                    onClick={() => addNewEntry("experience")}
                    className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    + Add Experience
                  </button>
                )}
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("experience")}
                style={{ margin: "10px 0px" }}
              >
                Remove Experience
              </button>
            </div>
          )}

          {visibleSections.education && (
            <div>
              <div className="educationblock">
                <h3 className="headings">Education</h3>
                {resumeData?.education?.map((edu, idx) => (
                  <div key={idx} className="user-education">
                    <div className="exp1">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "education",
                            "institution",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para1">{edu.institution}</p>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "education",
                            "grade",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para3">{edu.grade}</p>
                      </div>
                    </div>
                    <div className="exp1">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "education",
                            "degree",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para2">{edu.degree}</p>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "education",
                            "duration",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para3">{edu.duration}</p>
                      </div>
                    </div>
                    {resumeData?.education?.length > 1 && (
                      <button
                        onClick={() => removeEntry("education", idx)}
                        className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Remove
                      </button>
                    )}
                    {showEnhancementOptions && (
                      <button
                        onClick={() => enhanceSingleField("education", idx)}
                        className="enhance-btn bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Enhance This
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addNewEntry("education")}
                  className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  + New Entry
                </button>
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("education")}
                style={{ margin: "10px 0px" }}
              >
                Remove Education
              </button>
            </div>
          )}

          {visibleSections.achievements && (
            <div>
              <div className="achievementblock">
                <h3 className="headings">Key Achievements</h3>
                {resumeData?.achievements?.map((ach, idx) => (
                  <div key={idx} className="user-education">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "achievements",
                          "keyAchievements",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      <p className="para2">{ach.keyAchievements}</p>
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "achievements",
                          "describe",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      <p className="para3">{ach.describe}</p>
                    </div>
                    {resumeData?.achievements?.length > 1 && (
                      <button
                        onClick={() => removeEntry("achievements", idx)}
                        className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Remove
                      </button>
                    )}
                    {showEnhancementOptions && (
                      <button
                        onClick={() => enhanceSingleField("achievements", idx)}
                        className="enhance-btn bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Enhance This
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addNewEntry("achievements")}
                  className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  + New Entry
                </button>
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("achievements")}
                style={{ margin: "10px 0px" }}
              >
                Remove Achievements
              </button>
            </div>
          )}

          {visibleSections.skills && (
            <div className="skillsblock">
              <h3 className="headings">Skills</h3>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  console.log("Skills input:", e.target.textContent);
                  handleUserContent("skills", null, e.target.textContent);
                }}
              >
                {resumeData?.skills?.join(", ")}
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("skills")}
              >
                Remove Skills
              </button>
            </div>
          )}

          {visibleSections.courses && (
            <div>
              <div className="coursesblock">
                <h3 className="headings">Courses</h3>
                {resumeData?.courses?.map((course, idx) => (
                  <div key={idx} className="user-course">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "courses",
                          "title",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      <p className="para2">{course.title}</p>
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "courses",
                          "description",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      <p className="para3">{course.description}</p>
                    </div>
                    {resumeData?.courses?.length > 1 && (
                      <button
                        onClick={() => removeEntry("courses", idx)}
                        className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Remove
                      </button>
                    )}
                    {showEnhancementOptions && (
                      <button
                        onClick={() => enhanceSingleField("courses", idx)}
                        className="enhance-btn bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Enhance This
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addNewEntry("courses")}
                  className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  + New Entry
                </button>
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("courses")}
                style={{ margin: "10px 0px" }}
              >
                Remove Courses
              </button>
            </div>
          )}

          {visibleSections.projects && (
            <div>
              <div className="projectblock">
                <h3 className="headings">Projects</h3>
                {resumeData?.projects?.map((prj, idx) => (
                  <div key={idx} className="user-project">
                    <div className="exp1">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "projects",
                            "title",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para1">{prj.title}</p>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUserContent(
                            "projects",
                            "duration",
                            e.target.textContent,
                            idx
                          )
                        }
                      >
                        <p className="para2">{prj.duration}</p>
                      </div>
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUserContent(
                          "projects",
                          "description",
                          e.target.textContent,
                          idx
                        )
                      }
                    >
                      <p className="para2">{prj.description}</p>
                    </div>
                    {resumeData?.projects?.length > 1 && (
                      <button
                        onClick={() => removeEntry("projects", idx)}
                        className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Remove
                      </button>
                    )}
                    {showEnhancementOptions && (
                      <button
                        onClick={() => enhanceSingleField("projects", idx)}
                        className="enhance-btn bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        Enhance This
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addNewEntry("projects")}
                  className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  + New Entry
                </button>
              </div>
              <button
                className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => removeBlock("projects")}
                style={{ margin: "10px 0px" }}
              >
                Remove Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Temp2;
