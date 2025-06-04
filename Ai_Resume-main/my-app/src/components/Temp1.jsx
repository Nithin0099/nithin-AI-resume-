import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { useRef } from "react";
import './Temp1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import EnhanceWithAIDropdown from "./save";
const Temp1 = () => {
    const activeElementRef = useRef(null);
    const activeCaretPosRef = useRef(0);
    const [resume, setResume] = useState({
        _id: null, // ✅ Ensure we track the saved resume ID
        name: "Your Name",
        role: "The role you are applying for",
        phone: "Phone",
        email: "Email",
        linkedin: "LinkedIn/Portfolio",
        location: "Location",
        summary: "Briefly explain why you are a great fit for this role. For example: I am a strong fit for the web developer role because of my comprehensive understanding of both frontend and backend technologies, including expertise in JavaScript, React, Node.js, and modern web development frameworks. I have experience building responsive, user-friendly applications and working with APIs to create dynamic, scalable solutions. My problem-solving skills, attention to detail, and ability to adapt to new technologies enable me to deliver high-quality results.",
        experience: [
            {
                title: 'Your Title',
                companyName: 'Company Name',
                date: 'Date',
                companyLocation: 'Company Location',
                description: 'Company Description. For example: A web development company specializing in creating innovative, user-centric digital solutions that elevate brands and businesses. We offer end-to-end services including custom website development, e-commerce solutions, and mobile-responsive designs, ensuring seamless user experiences across all platforms. Leveraging the latest technologies like React, Node.js, and modern design principles, our team is committed to delivering exceptional results.',
                accomplishment: 'Your accomplishment. For example: In my time at the web development company, I consistently demonstrated exceptional technical skills and leadership, contributing significantly to the successful delivery of numerous high-profile projects. I played a pivotal role in developing scalable, user-friendly web applications.'
            }
        ],
        education: [
            {
                degree: 'Degree and Field of Study. For example: B.Tech in Information Technology',
                institution: 'School or University',
                duration: 'Date Period',
                grade: "Grade or percentage. For example: GPA: 8.5"
            }
        ],
        achievements: [
            {
                keyAchievements: 'Your Achievement',
                describe: "Describe what you did. For example: In my time at the web development company, I consistently demonstrated exceptional technical skills and leadership, contributing significantly to the successful delivery of numerous high-profile projects. I played a pivotal role in developing scalable, user-friendly web applications."
            }
        ],
        certifications: [
            {
                certificates: 'Course Name',
                link: 'Link to your certificate'
            }
        ],
        skills: ['Your skills. For example: HTML, CSS, JavaScript, React, Node.js'],
        projects: [
            {
                pname: 'Project Name',
                pdate: 'Date period',
                psummary: 'Summary of your work. For example: A weather app built with React allows users to view real-time weather information. It fetches data from APIs, displaying current temperature, humidity, and forecasts. React components manage state and UI updates, while hooks like useState and useEffect handle data fetching and UI rendering efficiently.'
            }
        ]
    });



    const [showButtons, setShowButtons] = useState(true); // Properly declared
    const [isEnhanced, setIsEnhanced] = useState(false);
    const handleUserContent = (section, key, value, index = null) => {
        // Store cursor position
        if (document.activeElement) {
            activeElementRef.current = document.activeElement;
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                activeCaretPosRef.current = range.startOffset;
            }
        }

        // Update state
        setResume(prev => {
            const updated = { ...prev };

            if (Array.isArray(updated[section])) {
                if (index !== null) {
                    updated[section] = updated[section].map((item, i) =>
                        i === index ? { ...item, [key]: value } : item
                    );
                }
            } else {
                updated[section] = value;  // ✅ Fix for single-value fields like `name`
            }

            return updated;
        });

        // Restore cursor position
        setTimeout(() => {
            if (activeElementRef.current) {
                const range = document.createRange();
                const selection = window.getSelection();

                if (!activeElementRef.current.childNodes.length) {
                    activeElementRef.current.textContent = " ";
                }

                if (activeElementRef.current.childNodes[0]?.nodeType === 3) {
                    range.setStart(
                        activeElementRef.current.childNodes[0],
                        Math.min(activeCaretPosRef.current, activeElementRef.current.childNodes[0].length)
                    );
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, 0);

    };

    // Add a new entry to a section
    const addNewEntry = (section) => {
        if (isEnhanced) return; // Prevent adding after AI enhancement
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
            grade: "Grade or percentage"
        } : section === "certifications" ? {
            certificates: 'Course Name',
            link: 'Link to your certificate'
        } : section === "projects" ? {
            pname: 'Project Name',
            pdate: 'Date period',
            psummary: 'Summary of your work'
        } : {
            keyAchievements: 'Your Achievement',
            describe: "Describe what you did"
        };

        setResume(prev => ({
            ...prev,
            [section]: [...prev[section], newEntry]
        }));
    };

    // Remove an entry from a section
    const removeEntry = (section, index) => {
        if (isEnhanced) return;

        setResume(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    // Download PDF
    // const downloadPdf = async () => {
    //   setShowButtons(false);
    //   try {
    //     const element = document.getElementById("resumeBody");
    //     const options = {
    //       margin: 0.3,
    //       filename: "resume.pdf",
    //       image: { type: "jpeg", quality: 0.98 },
    //       html2canvas: { scale: 2 },
    //       jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    //     };
    //     await html2pdf().from(element).set(options).save();

    //     if (resume._id) {
    //       await axios.post('http://localhost:5000/api/resume/save', { resumeData: resume });
    //     }
    //   } catch (error) {
    //     console.error("Error during PDF download:", error);
    //   } finally {
    //     setShowButtons(true);
    //   }
    // };

    const downloadPdf = async () => {
        // Select buttons
        const buttons = document.querySelectorAll('.download-btn');
        const entryButtons = document.querySelectorAll('.add-btn, .remove-btn');

        // Hide the buttons
        buttons.forEach(button => button.style.display = 'none');
        entryButtons.forEach(button => button.style.display = 'none');

        const element = document.getElementById("resumeBody");
        const options = {
            margin: 0.3,
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };

        try {
            // Generate PDF and download
            await html2pdf().from(element).set(options).save();

            // After PDF is downloaded, save the resume
            const response = await axios.post('http://localhost:5000/api/resume/save', { resumeData: resume });
            alert(response.data.message);
        } catch (error) {
            console.error("Error generating PDF or saving resume:", error);
            alert('Error generating PDF or saving resume');
        } finally {
            // Show buttons again after download is complete or on error
            buttons.forEach(button => button.style.display = 'block');
            entryButtons.forEach(button => button.style.display = 'block');
        }
    };

    const saveAndEnhanceResume = async () => {
        if (!resume) {
            alert("Please provide your resume details first.");
            return;
        }

        try {
            // Step 1: Save the resume first
            const saveResponse = await axios.post('http://localhost:5000/api/resume/save', {
                resumeData: resume,
            });

            if (saveResponse.data?.data?._id) {
                // Step 2: If saved successfully, set the _id and enhance the resume
                setResume(prev => ({ ...prev, _id: saveResponse.data.data._id }));
                alert("Resume saved successfully!");

                // Step 3: Enhance the resume
                const enhanceResponse = await axios.post('http://localhost:5000/api/resume/enhance', {
                    resumeId: saveResponse.data.data._id,
                });

                console.log("🟢 AI Enhanced Response:", enhanceResponse.data);

                if (enhanceResponse.data?.data) {
                    setResume(prev => ({
                        ...prev,
                        summary: enhanceResponse.data.data.summary || prev.summary,
                        experience: enhanceResponse.data.data.experience?.length ? enhanceResponse.data.data.experience : prev.experience,
                        skills: enhanceResponse.data.data.skills?.length ? enhanceResponse.data.data.skills : prev.skills,
                        achievements: enhanceResponse.data.data.achievements?.length ? enhanceResponse.data.data.achievements : prev.achievements,
                        certifications: enhanceResponse.data.data.certifications?.length ? enhanceResponse.data.data.certifications : prev.certifications,
                        projects: enhanceResponse.data.data.projects?.length ? enhanceResponse.data.data.projects : prev.projects,
                    }));

                    setIsEnhanced(true);
                    alert("Resume enhanced successfully!");
                } else {
                    console.warn("❌ AI Enhancement Failed: No data received");
                }
            } else {
                console.warn("❌ Error saving resume: No ID received");
            }
        } catch (error) {
            console.error("❌ Error during save and enhance process:", error);
        }
    };


    // Create resume
    const createResume = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/resume/create', {
                resumeData: {
                    name: resume.name,
                    role: resume.role,
                    phone: resume.phone,
                    email: resume.email,
                    linkedin: resume.linkedin,
                    location: resume.location,
                    summary: resume.summary,
                    experience: resume.experience,  // ✅ Fix field name
                    education: resume.education,
                    skills: resume.skills,
                    projects: resume.projects,
                    achievements: resume.achievements,
                    certifications: resume.certifications
                },
            });

            if (response.data?.data?._id) {
                setResume(prev => ({ ...prev, _id: response.data.data._id }));
                alert("Resume created successfully!");
            }
        } catch (error) {
            console.error("Error creating resume:", error);
        }
    };

    return (
        <div className="mainbody">
  {showButtons && (
    <div className="flex flex-wrap gap-3 sm:gap-5 my-3 justify-center">
      <button 
        onClick={downloadPdf} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
      >
        Download PDF
      </button>

      {/* <button 
        onClick={saveAndEnhanceResume} 
        disabled={isEnhanced} 
        className={`py-2 px-4 sm:px-6 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out w-full sm:w-auto 
          ${isEnhanced ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
      >
        Enhance with AI
      </button> */}


<EnhanceWithAIDropdown saveAndEnhanceResume={saveAndEnhanceResume} />

      <button 
        onClick={createResume} 
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 sm:px-2 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
      >
        Create Resume
      </button>
    </div>
  )}

            <div className="editResume">
                <div id="resumeBody">
                    <div className="firstBlock">
                        <div
                            className="user-name"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUserContent("name", null, e.target.textContent)}
                        >
                            {resume.name}
                        </div>

                        <div
                            className="user-role"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUserContent("role", null, e.target.textContent)}
                        >
                            {resume.role}
                        </div>
                        <div className="user-contacts">
                            <div
                                className="user-phone"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("phone", null, e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faPhone} /> {resume.phone}
                            </div>
                            <div
                                className="user-email"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("email", null, e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faEnvelope} /> {resume.email}
                            </div>
                            <div
                                className="user-linkedin"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("linkedin", null, e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faLinkedin} /> {resume.linkedin}
                            </div>
                            <div
                                className="user-location"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("location", null, e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> {resume.location}
                            </div>
                        </div>
                    </div>

                    <div className="summaryblock">
                        <h3 className="headings">Summary</h3>
                        <div
                            className="user-summary"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUserContent("summary", null, e.target.textContent)}
                        >
                            {resume.summary}
                        </div>
                    </div>

                    <div className="experienceblock">
                        <h3 className="headings">Experience</h3>
                        {resume.experience.map((exp, idx) => (
                            <div key={idx} className="user-experience">
                                <div className="exp1">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("experience", "companyName", e.target.textContent, idx)}
                                    >
                                        <p className='para1'>{exp.companyName}</p>
                                    </div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("experience", "companyLocation", e.target.textContent, idx)}
                                    >
                                        <p className='para2'>{exp.companyLocation}</p>
                                    </div>
                                </div>
                                <div className="exp1">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("experience", "title", e.target.textContent, idx)}
                                    >
                                        <p className='para1'>{exp.title}</p>
                                    </div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("experience", "date", e.target.textContent, idx)}
                                    >
                                        <p className='para2'>{exp.date}</p>
                                    </div>
                                </div>
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("experience", "description", e.target.textContent, idx)}
                                >
                                    {exp.description}
                                </div>
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("experience", "accomplishment", e.target.textContent, idx)}
                                >
                                    {exp.accomplishment}
                                </div>
                                {resume.experience.length > 1 && !isEnhanced && (
                                    <button onClick={() => removeEntry("experience", idx)} className="remove-btn">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addNewEntry("experience")} className="add-btn" disabled={isEnhanced}>
                            + New Entry
                        </button>
                    </div>

                    <div className="educationblock">
                        <h3 className="headings">Education</h3>
                        {resume.education.map((edu, idx) => (
                            <div key={idx} className="user-education">
                                <div className="exp1">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("education", "institution", e.target.textContent, idx)}
                                    >
                                        <p className='para1'>{edu.institution}</p>
                                    </div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("education", "grade", e.target.textContent, idx)}
                                    >
                                        <p className='para3'>{edu.grade}</p>
                                    </div>
                                </div>
                                <div className="exp1">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("education", "degree", e.target.textContent, idx)}
                                    >
                                        <p className='para2'>{edu.degree}</p>
                                    </div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("education", "duration", e.target.textContent, idx)}
                                    >
                                        <p className='para3'>{edu.duration}</p>
                                    </div>
                                </div>
                                {resume.education.length > 1 && !isEnhanced && (
                                    <button onClick={() => removeEntry("education", idx)} className="remove-btn" >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addNewEntry("education")} className="add-btn" disabled={isEnhanced}>
                            + New Entry
                        </button>
                    </div>

                    <div className="achievementblock">
                        <h3 className="headings">Key Achievements</h3>
                        {resume.achievements.map((ach, idx) => (
                            <div key={idx} className="user-education">
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("achievements", "keyAchievements", e.target.textContent, idx)}
                                >
                                    <p className='para2'>{ach.keyAchievements}</p>
                                </div>
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("achievements", "describe", e.target.textContent, idx)}
                                >
                                    <p className='para3'>{ach.describe}</p>
                                </div>
                                {resume.achievements.length > 1 && !isEnhanced && (
                                    <button onClick={() => removeEntry("achievements", idx)} className="remove-btn">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addNewEntry("achievements")} className="add-btn" disabled={isEnhanced}>
                            + New Entry
                        </button>
                    </div>

                    <div className="skillsblock">
                        <h3 className="headings">Skills</h3>
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUserContent("skills", null, e.target.textContent.split(", "))}
                        >
                            {resume.skills.join(", ")}
                        </div>
                    </div>

                    <div className="certificationcourse">
                        <h3 className="headings">Certification</h3>
                        {resume.certifications.map((cer, idx) => (
                            <div key={idx} className="user-certificate">
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("certifications", "certificates", e.target.textContent, idx)}
                                >
                                    <p className='para2'>{cer.certificates}</p>
                                </div>
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("certifications", "link", e.target.textContent, idx)}
                                >
                                    <p className='para3'>{cer.link}</p>
                                </div>
                                {resume.certifications.length > 1 && !isEnhanced && (
                                    <button onClick={() => removeEntry("certifications", idx)} className="remove-btn">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addNewEntry("certifications")} className="add-btn" disabled={isEnhanced}>
                            + New Entry
                        </button>
                    </div>

                    <div className="projectblock">
                        <h3 className="headings">Projects</h3>
                        {resume.projects.map((prj, idx) => (
                            <div key={idx} className="user-project">
                                <div className="exp1">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("projects", "pname", e.target.textContent, idx)}
                                    >
                                        <p className='para1'>{prj.pname}</p>
                                    </div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUserContent("projects", "pdate", e.target.textContent, idx)}
                                    >
                                        <p className='para2'>{prj.pdate}</p>
                                    </div>
                                </div>
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUserContent("projects", "psummary", e.currentTarget.textContent, idx)}

                                >
                                    <p className='para2'>{prj.psummary}</p>
                                </div>
                                {resume.projects.length > 1 && !isEnhanced && (
                                    <button onClick={() => removeEntry("projects", idx)} className="remove-btn">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addNewEntry("projects")} className="add-btn" disabled={isEnhanced}>
                            + New Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Temp1;










// {showButtons && (
//     <div className="button-group" style={{display:"flex", gap:"20px", margin:"10px"}}>
//        <button onClick={downloadPdf}>Download Pdf</button>
//        <button onClick={saveAndEnhanceResume} disabled={isEnhanced}>
//          Enhance with AI
//        </button>
//        {/* <button onClick={saveResume} disabled={false}>Save Resume</button> */}
//        <button onClick={createResume} disabled={false}>Create Resume</button>

//      </div>
//    )}