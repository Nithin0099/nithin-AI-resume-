  // // import React, { useState, useEffect, useRef } from "react";
  // // import "./index.css";
  // // import DatePicker from "react-datepicker";
  // // import "react-datepicker/dist/react-datepicker.css";
  // // import { FaCog, FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
  // // import Sidebar from "./components/Sidebar";

  // // const App = () => {
  // //   const [resume, setResume] = useState({
  // //     name: "BALU",
  // //     designation: "FULL STACK DEVELOPER  | VIDEO EDITOR | UI/UX",
  // //     contact: "+91 9959029270  |  balu@gmail.com  |  www.linkedin.com/balu",
  // //     summary: [
  // //       "Developed and optimized machine learning models for [specific project/task].",
  // //       "Implemented deep learning models using TensorFlow/PyTorch Conducted research on [specific AI technique] to improve model accuracy..",
  // //     ],
  // //     skills: ["FRONTEND ", "BACKEND", "PYTHON DEVELOPER ", "PROBLEM SOLVER "],
  // //     experience: [
  // //       {
  // //         title: "SENIOR DEVELOPER ",
  // //         company: "ACCENTURE ",
  // //         dates: { from: "JAN 2020", to: "MAR 2023 " },
  // //         details: "DESIGNING WEB APPLICATIONS ."
  // //       }
  // //     ],
  // //     achievements: [
  // //       {
  // //         title: "Best Junior Graphic Designer",
  // //         achievements: [
  // //           "Designed branding materials, improving brand identity for clients.",
  // //           "Developed a new branding strategy for a startup, resulting in a 25% rise in customer engagement."
  // //         ]
  // //       }
  // //     ],
  // //     education: [
  // //       { degree: "Bachelors of technology", date: "June 2019", school: "PARUL UNIVERSITY , GUJARAT" }
  // //     ],
  // //     courses: [
  // //       { title: "WEB DEVELOPER ", issuedby: "IBM", date: "January 2020" },
  // //     ],
  // //     languages: [],
  // //     projects: []

  // //   });

  // //   const [resumeSections, setResumeSections] = useState([]);
    
  // //   const handleAddSection = (sectionid) => {
  // //     setResumeSections((prevSections) => [...prevSections, sectionid]);
  // //   };  
    

  // //   const [activeSection, setActiveSection] = useState(null);
  // //   const [showSettings, setShowSettings] = useState(false);
  // //   const [visibleFields, setVisibleFields] = useState({
  // //     name: true,
  // //     designation: true,
  // //     contact: true,
  // //     summary: true,
  // //     skills: true,
  // //     experience: true,
  // //     title: true,
  // //     company: true,
  // //     dates: true,
  // //     details: true,
  // //     achievements: true,
  // //     education: true,
  // //     degree: true,
  // //     school: true,
  // //     issuedby: true
  // //   });

  // //   const [showDatePicker, setShowDatePicker] = useState(null);
  // //   const [dateType, setDateType] = useState("from");
  // //   const [presentChecked, setPresentChecked] = useState(false);
  // //   const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);
  // //   const [showExperienceSettings, setShowExperienceSettings] = useState(false);
  // //   const [selectedEducationIndex, setSelectedEducationIndex] = useState(null);
  // //   const [showEducationSettings, setShowEducationSettings] = useState(false);
  // //   const [showAchievementsSettings, setShowAchievementsSettings] = useState(false);
  // //   const [selectedAchievementIndex, setSelectedAchievementIndex] = useState(null);
  // //   const [showCoursesSettings, setShowCoursesSettings] = useState(false);
  // //   const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  // //   const settingsRef = useRef(null);

  // //   useEffect(() => {
  // //     const handleClickOutside = (event) => {
  // //       if (settingsRef.current && !settingsRef.current.contains(event.target)) {
  // //         setShowExperienceSettings(null);
  // //         setShowAchievementsSettings(false);
  // //         setShowEducationSettings(false);
  // //         setShowCoursesSettings(false);
  // //         setShowSettings(false);
  // //       }
  // //     };
    
  // //     document.addEventListener("mousedown", handleClickOutside);
  // //     return () => {
  // //       document.removeEventListener("mousedown", handleClickOutside);
  // //     };
  // //   }, []);
    
  // //   const handleSelectSection = (section) => {
  // //     console.log("Selected Section:", section);
  // //   };
    
  // //   const handleToggleField = (field) => {
  // //     setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  // //   };

  // //   const handleSkillChange = (index, value) => {
  // //     const updatedSkills = [...resume.skills];
  // //     updatedSkills[index] = value;
  // //     setResume({ ...resume, skills: updatedSkills });
  // //   };

  // //   const addSkill = () => {
  // //     setResume({ ...resume, skills: [...resume.skills, "New Skill"] });
  // //   };

  // //   const removeSkill = (index) => {
  // //     if (index !== null && resume.skills.length > 0) {
  // //       const updatedSkills = [...resume.skills];
  // //       updatedSkills.splice(index, 1);
  // //       setResume({ ...resume, skills: updatedSkills });
  // //     }
  // //   };

  // //   const addExperience = () => {
  // //     setResume({
  // //       ...resume,
  // //       experience: [
  // //         ...resume.experience,
  // //         { title: "New Position", company: "New Company", dates: { from: "MM/YYYY", to: "MM/YYYY" }, details: "Details here" }
  // //       ]
  // //     });
  // //   };

  // //   const removeExperience = (index) => {
  // //     setResume({
  // //       ...resume,
  // //       experience: resume.experience.filter((_, i) => i !== index)
  // //     });
  // //   };

  // //   const updateDate = (date, index) => {
  // //     const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace(",", "");
  // //     const updatedExperience = [...resume.experience];
  // //     updatedExperience[index].dates[dateType] = formattedDate;
  // //     if (dateType === "to" && presentChecked) {
  // //       updatedExperience[index].dates.to = "Present";
  // //     }
  // //     setResume({ ...resume, experience: updatedExperience });
  // //   };

  // //   const addAchievement = () => {
  // //     setResume({
  // //       ...resume,
  // //       achievements: [
  // //         ...resume.achievements,
  // //         { title: "New Achievement", achievements: ["Achievement details"] }
  // //       ]
  // //     });
  // //   };

  // //   const removeAchievement = (index) => {
  // //     setResume({
  // //       ...resume,
  // //       achievements: resume.achievements.filter((_, i) => i !== index),
  // //     });
  // //   };

  // //   const addEducation = () => {
  // //     setResume({
  // //       ...resume,
  // //       education: [
  // //         ...resume.education,
  // //         { degree: "New Degree", dates: { from: "MM/YYYY", to: "MM/YYYY" }, school: "New School" }
  // //       ]
  // //     });
  // //   };

  // //   const removeEducation = (index) => {
  // //     setResume({
  // //       ...resume,
  // //       education: resume.education.filter((_, i) => i !== index)
  // //     });
  // //   };

  // //   const addCourses = () => {
  // //     setResume({
  // //       ...resume,
  // //       courses: [
  // //         ...resume.courses,
  // //         { title: "New title", issuedby: "New Issued by", dates: { from: "MM/YYYY", to: "MM/YYYY" } }
  // //       ]
  // //     });
  // //   };

  // //   const removeCourses = (index) => {
  // //     setResume({
  // //       ...resume,
  // //       courses: resume.courses.filter((_, i) => i !== index)
  // //     });
  // //   };

  // //   return (
  // //     <div className="resume-main-container flex justify-center mr-[5vw]" onClick={() => {
        
  // //       setActiveSection(null);
  // //       setShowSettings(false);
  // //     }}>
  // //       <Sidebar 
  // //         onAddSection={handleAddSection} 
  // //         onSelectSection={handleSelectSection} 
  // //       />
    
  // //       {/* Main Content Area */}
  // //       <div className="resume-wrapper flex bg-gray shadow-lg rounded-lg w-[1000px] ml-[50px] p-4 relative">
  // //         {activeSection === "name" && (
  // //           <FaCog
  // //             className="absolute top-10 right-10 cursor-pointer text-gray-600 text-xl"
  // //             onClick={(e) => {
  // //               e.stopPropagation();
  // //               setShowSettings(!showSettings);
  // //             }}
  // //           />
  // //         )}
    
  // //         <div className="resume-content-container flex-1"></div>
  // //         {resumeSections.map((section) => (
  // //           <div key={section.id} className="resume-section">
  // //             <h2 className="font-bold text-lg">{section.title}</h2>
  // //             <div>{section.content}</div>
  // //           </div>
  // //         ))}
    
  // //         <div id="resume-content">
  // //           {/* Name Section */}
  // //           <div className="name-section text-left pb-6" onClick={(e) => {
  // //             e.stopPropagation();
  // //             setActiveSection("name");
  // //           }}>
  // //             {visibleFields.name && (
  // //               <div className="resume-name-input font-bold text-3xl" contentEditable suppressContentEditableWarning>
  // //                 {resume.name}
  // //               </div>
  // //             )}
  // //             {visibleFields.designation && (
  // //               <div className="resume-designation-input text-lg text-black-700" contentEditable suppressContentEditableWarning>
  // //                 {resume.designation}
  // //               </div>
  // //             )}
  // //             {visibleFields.contact && (
  // //               <div className="resume-contact-input text-sm text-black-700" contentEditable suppressContentEditableWarning>
  // //                 {resume.contact}
  // //               </div>
  // //             )}
  // //           </div>
    
  // //           {/* Settings Popup */}
  // //           {showSettings && (
  // //             <div className="settings-popup p-4 bg-gray-100 rounded-lg shadow-lg absolute top-12 right-4" onClick={(e) => e.stopPropagation()}>
  // //               {[
  // //                 { field: "name", label: "Show Name" },
  // //                 { field: "designation", label: "Show Designation" },
  // //                 { field: "contact", label: "Show Contact" }
  // //               ].map(({ field, label }) => (
  // //                 <div key={field} className="toggle-row flex justify-between items-center mb-2">
  // //                   <span className="text-sm font-medium">{label}</span>
                    
  // //                   {/* Toggle Switch */}
  // //                   <label className="relative inline-block w-10 h-5">
  // //                     <input
  // //                       type="checkbox"
  // //                       checked={visibleFields[field]}
  // //                       onChange={() => handleToggleField(field)}
  // //                       className="opacity-0 w-0 h-0"
  // //                     />
  // //                     <span
  // //                       className={`slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition ${
  // //                         visibleFields[field] ? "bg-blue-600" : "bg-gray-300"
  // //                       }`}
  // //                     >
  // //                       <span
  // //                         className={`absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition transform ${
  // //                           visibleFields[field] ? "translate-x-5" : ""
  // //                         }`}
  // //                       ></span>
  // //                     </span>
  // //                   </label>
    
  // //                 </div>
  // //               ))}
  // //             </div>
  // //           )}

  // //           {/* Profile & Skills Section */}
  // //           <div className="resume-summary-skills-container  gap-6">
  // //             {/* Profile Section */}
  // //             {visibleFields.summary && (
  // //                 <div className="resume-summary-section pb-4" onClick={(e) => {
  // //                   e.stopPropagation();
  // //                   setActiveSection("profile");
  // //                 }}>
  // //                   <h3 className="text-lg font-bold uppercase border-b pb-2">Profile</h3>
  // //                   <div contentEditable suppressContentEditableWarning className="text-gray-700 mt-2">
  // //                     {resume.summary.join("\n")}
  // //                   </div>
  // //                 </div>
  // //               )}
    
  // //               {/* Key Skills Section */}
  // //               {visibleFields.skills && (
  // //                 <div className="resume-skills-section pb-4" onClick={(e) => {
  // //                   e.stopPropagation();
  // //                   setActiveSection("skills");
  // //                 }}>
  // //                   <h3 className="text-lg font-bold uppercase border-b pb-2">Key Skills</h3>
  // //                   <ul className="list-disc list-inside text-gray-700 mt-2">
  // //                     {resume.skills.map((skill, index) => (
  // //                       <li key={index} className="skill-item">
  // //                         <div
  // //                           contentEditable
  // //                           suppressContentEditableWarning
  // //                           onBlur={(e) => handleSkillChange(index, e.target.textContent)}
  // //                           className="inline-block"
  // //                         >
  // //                           {skill}
  // //                         </div>
  // //                       </li>
  // //                     ))}

  // //                     {/* Add/Remove Skill Actions */}
  // //                     {activeSection === "skills" && (
  // //                       <div className="flex gap-3 mt-3">
  // //                         <button
  // //                           className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded shadow"
  // //                           onClick={addSkill}
  // //                         >
  // //                           <FaPlus className="icon" />
  // //                           <span>New Skill</span>
  // //                           <FaTrash
  // //                             className="icon ml-2 cursor-pointer"
  // //                             onClick={(e) => {
  // //                               e.stopPropagation(); // Prevent triggering addSkill when clicking delete
  // //                               removeSkill(selectedSkillIndex);
  // //                             }}
  // //                           />
  // //                         </button>
  // //                       </div>
  // //                     )}
  // //                   </ul>
  // //                 </div>
  // //               )}
  // //           </div>
                
  // //           <div className="resume-experience-achievements-container  gap-6">
  // //             {/* Work Experience Section */}
  // //             <div
  // //               className="resume-experience-section w-full pb-4"
  // //               onClick={(e) => {
  // //                 e.stopPropagation();
  // //                 setActiveSection("experience");
  // //               }}
  // //             >
  // //               <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">WORK EXPERIENCE</h3>
  // //               {resume.experience.map((exp, index) => (
  // //                 <div key={index} className="experience-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
  // //                   {visibleFields.title && (
  // //                     <div className="text-lg font-semibold" contentEditable>
  // //                       {exp.title}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.company && (
  // //                     <div className="text-gray-700 mt-2" contentEditable>
  // //                       {exp.company}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.dates && exp.dates ? (
  // //                     <div className="text-gray-700 mt-2 text-sm">
  // //                       {exp.dates.from || "N/A"} - {exp.dates.to || "N/A"}
  // //                     </div>
  // //                   ) : null}
  // //                   {visibleFields.details && (
  // //                     <div className="text-gray-700" contentEditable>
  // //                       {exp.details}
  // //                     </div>
  // //                   )}

  // //                   {activeSection === "experience" && (
  // //                     <div className="mt-2 flex gap-2">
  // //                       <button
  // //                         className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
  // //                         onClick={addExperience}
  // //                       >
  // //                         <FaPlus className="icon" />
  // //                         <span>New Experience</span>
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md"
  // //                         onClick={() => {
  // //                           console.log("Deleting index:", index);  // Debugging index
  // //                           removeExperience(index);
  // //                         }}
  // //                       >
  // //                         <FaTrash className="icon" />
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md"
  // //                         onClick={(e) => {
  // //                           e.stopPropagation();
  // //                           console.log("Clicked calendar for index:", index);
  // //                           setShowDatePicker((prev) => (prev === index ? null : index));
  // //                         }}
  // //                       >
  // //                         <FaCalendarAlt className="icon" />
  // //                       </button>
                
  // //                       <button
  // //                         className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
  // //                         onClick={(e) => {
  // //                           e.stopPropagation();
  // //                           console.log("Clicked settings for index:", index);
  // //                           setShowExperienceSettings((prev) => (prev === index ? null : index));
  // //                         }}
  // //                       >
  // //                         <FaCog className="icon" />
  // //                       </button>
  // //                     </div>
  // //                   )}

                  
  // //                   {showExperienceSettings === index && (
  // //                     <div  ref={settingsRef} className="absolute left-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
  // //                       {["title", "company", "dates", "details"].map((field) => (
  // //                         <div key={field} className="flex justify-between items-center py-2">
  // //                           <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
  // //                           <label className="relative inline-flex items-center cursor-pointer">
  // //                             <input
  // //                               type="checkbox"
  // //                               checked={visibleFields[field]}
  // //                               onChange={() => handleToggleField(field)}
  // //                               className="sr-only peer"
  // //                             />
  // //                             <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
  // //                               <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
  // //                             </div>
  // //                           </label>
  // //                         </div>
  // //                       ))}
  // //                     </div>  
  // //                   )}

  // //                   {/* Date Picker */}
  // //                   {showDatePicker === index && (
  // //                     <div className="mt-2 p-4 border rounded-lg shadow-md bg-gray-100 w-full">
  // //                       <div className="flex gap-2 mb-2">
  // //                         <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setDateType("from")}>
  // //                           From
  // //                         </button>
  // //                         <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setDateType("to")}>
  // //                           To
  // //                         </button>
  // //                       </div>
  // //                       <DatePicker
  // //                         selected={exp.dates?.[dateType] && exp.dates[dateType] !== "Present" ? new Date(exp.dates[dateType]) : null}
  // //                         onChange={(date) => updateDate(date, index)}
  // //                         dateFormat="MM/yyyy"
  // //                         showMonthYearPicker
  // //                       />
  // //                       {dateType === "to" && (
  // //                         <div className="flex items-center gap-2 mt-2">
  // //                           <input
  // //                             type="checkbox"
  // //                             checked={presentChecked}
  // //                             onChange={() => setPresentChecked(!presentChecked)}
  // //                           />
  // //                           <label>Present</label>
  // //                         </div>
  // //                       )}
  // //                     </div>
  // //                   )}
  // //                 </div>
  // //               ))}
  // //             </div>


  // //           {/* Key Achievements Section */}
  // //             <div
  // //               className="resume-achievements-section w-full pb-4"
  // //               onClick={(e) => {
  // //                 e.stopPropagation();
  // //                 setActiveSection("achievements");
  // //               }}
  // //             >
  // //               <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">KEY ACHIEVEMENTS</h3>
  // //               {resume.achievements.map((ach, index) => (
  // //                 <div
  // //                   key={index}
  // //                   className="achievements-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
  // //                   onClick={() => setSelectedAchievementIndex(index)}
  // //                 >
  // //                   {visibleFields.title && (
  // //                     <div className="text-lg font-semibold" contentEditable>
  // //                       {ach.title}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.achievements && (
  // //                     <ul className="text-gray-700 mt-2">
  // //                       {ach.achievements.map((achievement, i) => (
  // //                         <li key={i} contentEditable>
  // //                           {achievement}
  // //                         </li>
  // //                       ))}
  // //                     </ul>
  // //                   )}

  // //                   {activeSection === "achievements" && (
  // //                     <div className="mt-2 flex gap-2">
  // //                       <button
  // //                         className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
  // //                         onClick={addAchievement}
  // //                       >
  // //                         <FaPlus className="icon" />
  // //                         <span>New Achievement</span>
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md"
  // //                         onClick={() => {
  // //                           if (selectedAchievementIndex !== null) {
  // //                             removeAchievement(selectedAchievementIndex);
  // //                           }
  // //                         }}
  // //                       >
  // //                         <FaTrash className="icon" />
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
  // //                         onClick={(e) => {
  // //                           e.stopPropagation();
  // //                           console.log("Clicked settings for index:", index);
  // //                           setShowAchievementsSettings((prev) => (prev === index ? null : index));
  // //                         }}
  // //                       >
  // //                         <FaCog className="icon" />
  // //                       </button>
  // //                     </div>
  // //                   )}

  // //                   {/* Settings Panel */}
  // //                   {showAchievementsSettings === index && (
  // //                     <div ref={settingsRef} className="absolute right-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
  // //                       {["title", "achievements"].map((field) => (
  // //                         <div key={field} className="flex justify-between items-center py-2">
  // //                           <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
  // //                           <label className="relative inline-flex items-center cursor-pointer">
  // //                             <input
  // //                               type="checkbox"
  // //                               checked={visibleFields[field]}
  // //                               onChange={() => handleToggleField(field)}
  // //                               className="sr-only peer"
  // //                             />
  // //                             <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
  // //                               <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
  // //                             </div>
  // //                           </label>
  // //                         </div>
  // //                       ))}
  // //                     </div>
  // //                   )}
  // //                 </div>
  // //               ))}
  // //             </div>
  // //           </div>

  // //           <div className="resume-education-courses-container  gap-6">
  // //             { /* Education Section */}
  // //             <div
  // //               className="resume-education-section w-full pb-4"
  // //               onClick={(e) => {
  // //                 e.stopPropagation();
  // //                 setActiveSection("education");
  // //               }}
  // //             >
  // //               <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">EDUCATION</h3>
  // //               {resume.education.map((edu, index) => (
  // //                 <div key={index} className="education-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
  // //                   {visibleFields.degree && (
  // //                     <div className="text-lg font-semibold" contentEditable>
  // //                       {edu.degree}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.school && (
  // //                     <div className="text-gray-600" contentEditable>
  // //                       {edu.school}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.dates && edu.dates ? (
  // //                     <div className="text-gray-500 text-sm">
  // //                       {edu.dates.from || "N/A"} - {edu.dates.to || "N/A"}
  // //                     </div>
  // //                   ) : null}

  // //                   {activeSection === "education" && (
  // //                     <div className="mt-2 flex gap-2">
  // //                       <button
  // //                         className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
  // //                         onClick={addEducation}
  // //                       >
  // //                         <FaPlus className="icon" />
  // //                         <span>New Education</span>
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md"
  // //                         onClick={() => removeEducation(index)}
  // //                       >
  // //                         <FaTrash className="icon" />
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
  // //                         onClick={(e) => {
  // //                           e.stopPropagation();
  // //                           console.log("Clicked settings for index:", index);
  // //                           setShowEducationSettings((prev) => (prev === index ? null : index));
  // //                         }}
  // //                       >
  // //                         <FaCog className="icon" />
  // //                       </button>
  // //                     </div>
  // //                   )}

  // //                   {/* Settings Panel */}
  // //                   {showEducationSettings === index && (
  // //                     <div ref={settingsRef} className="absolute left-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
  // //                       {["degree", "school"].map((field) => (
  // //                         <div key={field} className="flex justify-between items-center py-2">
  // //                           <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
  // //                           <label className="relative inline-flex items-center cursor-pointer">
  // //                             <input
  // //                               type="checkbox"
  // //                               checked={visibleFields[field]}
  // //                               onChange={() => handleToggleField(field)}
  // //                               className="sr-only peer"
  // //                             />
  // //                             <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
  // //                               <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
  // //                             </div>
  // //                           </label>
  // //                         </div>
  // //                       ))}
  // //                     </div>
  // //                   )}
  // //                 </div>
  // //               ))}
  // //             </div>
          
  // //             { /* Courses Section */ }
  // //             <div
  // //               className="resume-courses-section w-full pb-4"
  // //               onClick={(e) => {
  // //                 e.stopPropagation();
  // //                 setActiveSection("courses");
  // //               }}
  // //             >
  // //               <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">COURSES</h3>
  // //               {resume.courses.map((cou, index) => (
  // //                 <div key={index} className="course-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
  // //                   {visibleFields.title && (
  // //                     <div className="text-lg font-semibold" contentEditable>
  // //                       {cou.title}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.issuedby && (
  // //                     <div className="text-gray-600" contentEditable>
  // //                       {cou.issuedby}
  // //                     </div>
  // //                   )}
  // //                   {visibleFields.dates && cou.dates ? (
  // //                     <div className="text-gray-500 text-sm">
  // //                       {cou.dates.from || "N/A"} - {cou.dates.to || "N/A"}
  // //                     </div>
  // //                   ) : null}

  // //                   {activeSection === "courses" && (
  // //                     <div className="mt-2 flex gap-2">
  // //                       <button
  // //                         className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
  // //                         onClick={addCourses}
  // //                       >
  // //                         <FaPlus className="icon" />
  // //                         <span>New Course</span>
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md"
  // //                         onClick={() => removeCourses(index)}
  // //                       >
  // //                         <FaTrash className="icon" />
  // //                       </button>

  // //                       <button
  // //                         className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
  // //                         onClick={(e) => {
  // //                           e.stopPropagation();
  // //                           console.log("Clicked settings for index:", index);
  // //                           setShowCoursesSettings((prev) => (prev === index ? null : index));
  // //                         }}
  // //                       >
  // //                         <FaCog className="icon" />
  // //                       </button>
  // //                     </div>
  // //                   )}

  // //                   {/* Settings Panel */}
  // //                   {showCoursesSettings === index && (
  // //                     <div ref={settingsRef} className="absolute right-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
  // //                       {["title", "issuedby"].map((field) => (
  // //                         <div key={field} className="flex justify-between items-center py-2">
  // //                           <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
  // //                           <label className="relative inline-flex items-center cursor-pointer">
  // //                             <input
  // //                               type="checkbox"
  // //                               checked={visibleFields[field]}
  // //                               onChange={() => handleToggleField(field)}
  // //                               className="sr-only peer"
  // //                             />
  // //                             <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
  // //                             <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
  // //                             </div>
  // //                           </label>
  // //                         </div>
  // //                       ))}
  // //                     </div>
  // //                   )}
  // //                 </div>
  // //               ))}
  // //             </div>
  // //           </div>
  // //         </div>
  // //       </div>
  // //     </div>
  // //   );
  // // };


  // // export default App;



  // // import React, { useState } from "react";
  // // import Sidebar from "./components/Sidebar";
  // // import { FaPlus, FaTrash, FaEnvelope, FaPhone, FaLinkedin, FaGithub } from "react-icons/fa";
  
  // // const App = () => {
  // //   const [education, setEducation] = useState([]);
  // //   const [internships, setInternships] = useState([]);
  // //   const [experience, setExperience] = useState([]);
  // //   const [technicalSkills, setTechnicalSkills] = useState([]);
  // //   const [languages, setLanguages] = useState([]);
  // //   const [contact, setContact] = useState({
  // //     phone: "",
  // //     email: "",
  // //     linkedin: "",
  // //     github: "",
  // //   });
  
  // //   const addSection = (section, setSection, newData) => {
  // //     setSection([...section, newData]);
  // //   };
  
  // //   const removeSection = (section, setSection, index) => {
  // //     setSection(section.filter((_, i) => i !== index));
  // //   };
  
  // //   return (
  // //     <div className="flex bg-gray-100 min-h-screen">
  // //       {/* Sidebar */}
  // //       <Sidebar />
  
  // //       {/* Resume Template */}
  // //       <div className="ml-64 p-8 w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
  // //         {/* Header */}
  // //         <header className="bg-gray-800 text-white p-6 rounded-t-lg">
  // //           <h1 className="text-3xl font-bold">William Ware</h1>
  // //           <p className="text-lg text-teal-300">Business and Marketing Graduate</p>
            
  // //           {/* Contact Information */}
  // //           <div className="mt-4 space-y-2 text-sm">
  // //             <div className="flex items-center space-x-2">
  // //               <FaPhone />
  // //               <input 
  // //                 type="text" 
  // //                 placeholder="Phone Number" 
  // //                 value={contact.phone}
  // //                 onChange={(e) => setContact({ ...contact, phone: e.target.value })}
  // //                 className="bg-transparent border-b outline-none w-full"
  // //               />
  // //             </div>
  // //             <div className="flex items-center space-x-2">
  // //               <FaEnvelope />
  // //               <input 
  // //                 type="text" 
  // //                 placeholder="Email" 
  // //                 value={contact.email}
  // //                 onChange={(e) => setContact({ ...contact, email: e.target.value })}
  // //                 className="bg-transparent border-b outline-none w-full"
  // //               />
  // //             </div>
  // //             <div className="flex items-center space-x-2">
  // //               <FaLinkedin />
  // //               <input 
  // //                 type="text" 
  // //                 placeholder="LinkedIn Profile URL" 
  // //                 value={contact.linkedin}
  // //                 onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
  // //                 className="bg-transparent border-b outline-none w-full"
  // //               />
  // //             </div>
  // //             <div className="flex items-center space-x-2">
  // //               <FaGithub />
  // //               <input 
  // //                 type="text" 
  // //                 placeholder="GitHub Profile URL" 
  // //                 value={contact.github}
  // //                 onChange={(e) => setContact({ ...contact, github: e.target.value })}
  // //                 className="bg-transparent border-b outline-none w-full"
  // //               />
  // //             </div>
  // //           </div>
  // //         </header>
  
  // //         {/* Education Section */}
  // //         <ResumeSection title="EDUCATION" data={education} setData={setEducation} fields={{ degree: "New Degree", university: "New University", year: "YYYY", details: "Details" }} />
          
  // //         {/* Internships Section */}
  // //         <ResumeSection title="INTERNSHIPS" data={internships} setData={setInternships} fields={{ position: "New Position", company: "New Company", year: "YYYY", details: "Details" }} />
          
  // //         {/* Experience Section */}
  // //         <ResumeSection title="EXPERIENCE" data={experience} setData={setExperience} fields={{ position: "New Position", company: "New Company", year: "YYYY", details: "Details" }} />
          
  // //         {/* Technical Skills Section */}
  // //         <ResumeSection title="TECHNICAL SKILLS" data={technicalSkills} setData={setTechnicalSkills} fields={{ category: "New Skill", details: "Skill Details" }} />
          
  // //         {/* Languages Section */}
  // //         <ResumeSection title="LANGUAGES" data={languages} setData={setLanguages} fields={{ name: "New Language" }} />
  // //       </div>
  // //     </div>
  // //   );
  // // };
  
  // // // Dynamic Resume Section Component
  // // const ResumeSection = ({ title, data, setData, fields }) => {
  // //   const addSection = () => {
  // //     setData([...data, fields]);
  // //   };
  
  // //   const removeSection = (index) => {
  // //     setData(data.filter((_, i) => i !== index));
  // //   };
  
  // //   return (
  // //     <section className="mt-6">
  // //       <h2 className="text-xl font-bold text-green-600 border-b pb-2">{title}</h2>
  // //       {data.map((item, index) => (
  // //         <div key={index} className="mt-4 p-4 bg-gray-50 rounded-lg relative">
  // //           <h3 className="text-lg font-semibold">{Object.values(item)[0]}</h3>
  // //           <p className="text-gray-700">{Object.values(item)[1]} ({Object.values(item)[2]})</p>
  // //           <p className="text-gray-600">{Object.values(item)[3]}</p>
  // //           <button className="absolute top-2 right-2 text-red-500" onClick={() => removeSection(index)}>
  // //             <FaTrash />
  // //           </button>
  // //         </div>
  // //       ))}
  // //       <button className="mt-3 flex items-center text-blue-600" onClick={addSection}>
  // //         <FaPlus className="mr-2" /> Add {title}
  // //       </button>
  // //     </section>
  // //   );
  // // };
  
  // // export default App;
  


  
  // import React, { useState } from "react";
  // import Sidebar from "./components/Sidebar";
  // import { FaPlus, FaTrash, FaPhone, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
  
  // const App = () => {
  //   const [sections, setSections] = useState([
  //     {
  //       id: "education",
  //       title: "EDUCATION",
  //       data: [
  //         {
  //           degree: "MS in Business and Marketing Management",
  //           university: "The University of Chicago",
  //           year: "09/2021 - 06/2023",
  //           details: "GPA: 3.95",
  //         },
  //       ],
  //       fields: ["degree", "university", "year", "details"],
  //     },
  //     {
  //       id: "internships",
  //       title: "INTERNSHIPS",
  //       data: [
  //         {
  //           position: "Sales & Marketing Intern",
  //           company: "Pear Inc.",
  //           year: "06/2022 - 12/2022",
  //           details: "Increased social media engagement by 25% through weekly content plans.",
  //         },
  //       ],
  //       fields: ["position", "company", "year", "details"],
  //     },
  //     {
  //       id: "experience",
  //       title: "EXPERIENCE",
  //       data: [
  //         {
  //           position: "Volunteer - Marketing Organization",
  //           company: "The University of Chicago",
  //           year: "03/2018 - 10/2021",
  //           details: "Managed events for 300+ international students.",
  //         },
  //       ],
  //       fields: ["position", "company", "year", "details"],
  //     },
  //     {
  //       id: "technicalSkills",
  //       title: "TECHNICAL SKILLS",
  //       data: [{ category: "Digital Marketing", details: "Google Ads, Analytics, A/B Testing." }],
  //       fields: ["category", "details"],
  //     },
  //     {
  //       id: "languages",
  //       title: "LANGUAGES",
  //       data: [{ name: "English" }, { name: "Spanish" }],
  //       fields: ["name"],
  //     },
  //   ]);
  
  //   // Function to add a new entry in a section
  //   const handleAddEntry = (sectionId) => {
  //     setSections(
  //       sections.map((section) =>
  //         section.id === sectionId
  //           ? {
  //               ...section,
  //               data: [...section.data, Object.fromEntries(section.fields.map((field) => [field, ""]))],
  //             }
  //           : section
  //       )
  //     );
  //   };
  
  //   // Function to delete an entry from a section
  //   const handleDeleteEntry = (sectionId, index) => {
  //     setSections(
  //       sections.map((section) =>
  //         section.id === sectionId
  //           ? { ...section, data: section.data.filter((_, i) => i !== index) }
  //           : section
  //       )
  //     );
  //   };
  
  //   // Function to delete an entire section
  //   const handleDeleteSection = (sectionId) => {
  //     setSections(sections.filter((section) => section.id !== sectionId));
  //   };
  
  //   return (
  //     <div className="flex min-h-screen bg-gray-100">
  //       {/* Sidebar (Always Visible on Desktop) */}
  //       <Sidebar />
  
  //       {/* Main Resume Content */}
  //       <div className="p-4 md:p-6 w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg resume-main-container">
  //         {/* Header */}
  //         <header className="bg-gray-800 text-white p-6 rounded-t-lg text-center md:text-left">
  //           <h1 className="text-2xl md:text-3xl font-bold">William Ware</h1>
  //           <p className="text-lg text-teal-300">Business and Marketing Graduate</p>
  //           <p className="text-sm mt-2">Looking to join a start-up as a marketing assistant or intern.</p>
  //           <div className="flex flex-col md:flex-row justify-between mt-4 text-sm">
  //             <p className="flex items-center">
  //               <FaEnvelope className="mr-2" /> william@novoresume.com
  //             </p>
  //             <p className="flex items-center">
  //               <FaPhone className="mr-2" /> (541) 231-2414
  //             </p>
  //             <p className="flex items-center">
  //               <FaLinkedin className="mr-2" /> linkedin.com/in/william-ware
  //             </p>
  //             <p className="flex items-center">
  //               <FaGithub className="mr-2" /> github.com/william-ware
  //             </p>
  //           </div>
  //         </header>
  
  //         {/* Sections */}
  //         {sections.map((section, idx) => (
  //           <section key={idx} className="mt-6">
  //             <div className="flex justify-between items-center border-b pb-2">
  //               <h2 className="text-lg md:text-xl font-bold text-green-600">{section.title}</h2>
  //               <button className="text-red-500 text-lg" onClick={() => handleDeleteSection(section.id)}>
  //                 <FaTrash />
  //               </button>
  //             </div>
  
  //             {section.data.map((item, index) => (
  //               <div key={index} className="mt-4 p-4 bg-gray-50 rounded-lg relative">
  //                 {Object.entries(item).map(([key, value]) => (
  //                   <p key={key} className="text-gray-700 text-sm md:text-base">
  //                     <strong>{key.replace(/_/g, " ")}:</strong> {value || "Enter details..."}
  //                   </p>
  //                 ))}
  //                 <button className="absolute top-2 right-2 text-red-500" onClick={() => handleDeleteEntry(section.id, index)}>
  //                   <FaTrash />
  //                 </button>
  //               </div>
  //             ))}
  
  //             {/* Add Entry Button */}
  //             <button className="mt-2 flex items-center text-blue-500" onClick={() => handleAddEntry(section.id)}>
  //               <FaPlus className="mr-2" /> Add Entry
  //             </button>
  //           </section>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };
  
  // export default App;
  

  // import React, { useState } from "react";
  // import Sidebar from "./components/Sidebar";
  // import { FaPlusCircle, FaTrashAlt, FaCamera, FaPhone, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
  
  // const App = () => {
  //   const [photo, setPhoto] = useState(null);
  //   const [sections, setSections] = useState([
  //     { id: "careerObjective", title: "CAREER OBJECTIVE", data: [{ description: "Seeking a Software Engineer role to build AI applications." }], fields: ["description"] },
  //     { id: "skills", title: "SKILLS", data: [{ skill: "Python, React, SQL, Machine Learning" }], fields: ["skill"] },
  //     { id: "education", title: "EDUCATION", data: [{ degree: "B.Tech in Computer Science", university: "XYZ University", year: "2020 - 2024", details: "CGPA: 9.0" }], fields: ["degree", "university", "year", "details"] },
  //     { id: "experience", title: "EXPERIENCE", data: [{ position: "Software Engineer Intern", company: "ABC Tech", year: "2023 - 2024", details: "Worked on AI applications." }], fields: ["position", "company", "year", "details"] },
  //     { id: "projects", title: "PROJECTS", data: [{ name: "AI Resume Builder", details: "Developed an AI-powered resume builder using React and Python." }], fields: ["name", "details"] },
  //     { id: "certificates", title: "CERTIFICATES", data: [{ name: "Machine Learning - Coursera", details: "Completed ML course from Coursera by Stanford University." }], fields: ["name", "details"] },
  //   ]);
  
  //   const handlePhotoChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) setPhoto(URL.createObjectURL(file));
  //   };
  //   const removePhoto = () => setPhoto(null);
  
  //   const handleAddEntry = (sectionId) => {
  //     setSections(sections.map((section) => section.id === sectionId ? { ...section, data: [...section.data, Object.fromEntries(section.fields.map((field) => [field, ""]))] } : section));
  //   };
  
  //   const handleDeleteEntry = (sectionId, index) => {
  //     setSections(sections.map((section) => section.id === sectionId ? { ...section, data: section.data.filter((_, i) => i !== index) } : section));
  //   };
  
  //   const handleDeleteSection = (sectionId) => {
  //     setSections(sections.filter((section) => section.id !== sectionId));
  //   };
  
  //   return (
  //     <div className="flex min-h-screen bg-gray-200">
  //       {/* Sidebar */}
  //       <Sidebar />
  
  //       {/* Resume Layout */}
  //       <div className="p-4 md:p-6 w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
  //         {/* Left Section (User Details) */}
  //         <div className="w-full md:w-1/3 bg-gray-500 text-white p-6 flex flex-col items-center rounded-lg">
  //           {/* Profile Photo */}
  //           <div className="relative mb-4">
  //             {photo ? (
  //               <div className="relative">
  //                 <img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
  //                 <button onClick={removePhoto} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2">
  //                   X
  //                 </button>
  //               </div>
  //             ) : (
  //               <label className="cursor-pointer bg-gray-500 text-white px-3 py-2 rounded flex items-center">
  //                 <FaCamera className="mr-2" /> Add Photo
  //                 <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
  //               </label>
  //             )}
  //           </div>
  
  //           {/* User Info */}
  //           <h1 className="text-2xl font-bold">John Doe</h1>
  //           <p className="text-gray-300 text-sm">Software Engineer</p>
  //           <p className="text-sm mt-2">Passionate about AI-driven applications.</p>
  
  //           {/* Contact Info */}
  //           <div className="mt-4 text-sm">
  //             <p className="flex items-center">
  //               <FaEnvelope className="mr-2" /> john.doe@example.com
  //             </p>
  //             <p className="flex items-center">
  //               <FaPhone className="mr-2" /> (123) 456-7890
  //             </p>
  //             <p className="flex items-center">
  //               <FaLinkedin className="mr-2" /> linkedin.com/in/john-doe
  //             </p>
  //             <p className="flex items-center">
  //               <FaGithub className="mr-2" /> github.com/john-doe
  //             </p>
  //           </div>
  //         </div>
  
  //         {/* Right Section (Resume Content) */}
  //         <div className="w-full md:w-2/3 p-6">
  //           {sections.map((section) => (
  //             <section key={section.id} className="mt-6">
  //               <div className="flex justify-between items-center border-b pb-2">
  //                 <h2 className="text-lg font-bold text-gray-600" style={{ fontSize: "14px" }}>{section.title}</h2>
  //                 <button className="text-red-500 hover:bg-red-100 p-2 rounded-full transition" onClick={() => handleDeleteSection(section.id)}>
  //                   <FaTrashAlt />
  //                 </button>
  //               </div>
  
  //               {section.data.map((item, index) => (
  //                 <div key={index} className="mt-4 p-4 bg-gray-100 rounded-lg relative">
  //                   {Object.entries(item).map(([key, value]) => (
  //                     <p key={key} className="text-gray-900" style={{ fontSize: "10px" }}>
  //                       <strong className="italic">{key.replace(/_/g, " ")}:</strong> {value || "Enter details..."}
  //                     </p>
  //                   ))}
  //                   <button className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-2 rounded-full transition" onClick={() => handleDeleteEntry(section.id, index)}>
  //                     <FaTrashAlt />
  //                   </button>
  //                 </div>
  //               ))}
  
  //               {/* Add Entry Button */}
  //               <button className="mt-2 flex items-center bg-gray-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-gray-700 transition" onClick={() => handleAddEntry(section.id)}>
  //                 <FaPlusCircle className="mr-2" /> Add Entry
  //               </button>
  //             </section>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  
  // export default App;
  
  import React, { useState } from "react";
  import Sidebar from "./components/Sidebar";
  import { FaPlusCircle, FaTrashAlt, FaCamera, FaPhone, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
  
  const App = () => {
    const [photo, setPhoto] = useState(null);
    const [sections, setSections] = useState([
      { id: "careerObjective", title: "CAREER OBJECTIVE", data: [{ description: "Seeking a Software Engineer role to build AI applications." }], fields: ["description"] },
      { id: "skills", title: "SKILLS", data: [{ skill: "Python, React, SQL, Machine Learning" }], fields: ["skill"] },
      { id: "education", title: "EDUCATION", data: [{ degree: "B.Tech in Computer Science", university: "XYZ University", year: "2020 - 2024", details: "CGPA: 9.0" }], fields: ["degree", "university", "year", "details"] },
      { id: "experience", title: "EXPERIENCE", data: [{ position: "Software Engineer Intern", company: "ABC Tech", year: "2023 - 2024", details: "Worked on AI applications." }], fields: ["position", "company", "year", "details"] },
      { id: "projects", title: "PROJECTS", data: [{ name: "AI Resume Builder", details: "Developed an AI-powered resume builder using React and Python." }], fields: ["name", "details"] },
      { id: "certificates", title: "CERTIFICATES", data: [{ name: "Machine Learning - Coursera", details: "Completed ML course from Coursera by Stanford University." }], fields: ["name", "details"] },
    ]);
    
    const [newSectionTitle, setNewSectionTitle] = useState("");
  
    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) setPhoto(URL.createObjectURL(file));
    };
    const removePhoto = () => setPhoto(null);
  
    const handleAddEntry = (sectionId) => {
      setSections(sections.map((section) => section.id === sectionId ? { ...section, data: [...section.data, Object.fromEntries(section.fields.map((field) => [field, ""]))] } : section));
    };
  
    const handleDeleteEntry = (sectionId, index) => {
      setSections(sections.map((section) => section.id === sectionId ? { ...section, data: section.data.filter((_, i) => i !== index) } : section));
    };
  
    const handleDeleteSection = (sectionId) => {
      setSections(sections.filter((section) => section.id !== sectionId));
    };
  
    const handleAddSection = () => {
      if (!newSectionTitle.trim()) return;
      const newSection = {
        id: `custom-${Date.now()}`,
        title: newSectionTitle.toUpperCase(),
        data: [{ detail: "Enter details here..." }],
        fields: ["detail"],
      };
      setSections([...sections, newSection]);
      setNewSectionTitle(""); // Clear input after adding
    };
  
    return (
      <div className="flex min-h-screen bg-gray-200">
        <Sidebar />
  
        <div className="p-4 md:p-6 w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-gray-700 text-white p-6 flex flex-col items-center rounded-lg">
            <div className="relative mb-4">
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  <button onClick={removePhoto} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2">
                    X
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer bg-gray-500 text-white px-3 py-2 rounded flex items-center">
                  <FaCamera className="mr-2" /> Add Photo
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
            </div>
  
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-gray-300 text-sm">Software Engineer</p>
            <p className="text-sm mt-2">Passionate about AI-driven applications.</p>
  
            <div className="mt-4 text-sm">
              <p className="flex items-center">
                <FaEnvelope className="mr-2" /> john.doe@example.com
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" /> (123) 456-7890
              </p>
              <p className="flex items-center">
                <FaLinkedin className="mr-2" /> linkedin.com/in/john-doe
              </p>
              <p className="flex items-center">
                <FaGithub className="mr-2" /> github.com/john-doe
              </p>
            </div>
          </div>
  
          <div className="w-full md:w-2/3 p-6">
            {sections.map((section) => (
              <section key={section.id} className="mt-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
                  <button className="text-red-500 hover:bg-red-100 p-2 rounded-full transition" onClick={() => handleDeleteSection(section.id)}>
                    <FaTrashAlt />
                  </button>
                </div>
  
                {section.data.map((item, index) => (
                  <div key={index} className="mt-4 p-4 bg-white border border-gray-300 rounded-lg relative">
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key} className="text-gray-800 text-sm">
                        <strong className="italic">{key.replace(/_/g, " ")}:</strong> {value || "Enter details..."}
                      </p>
                    ))}
                    <button className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-2 rounded-full transition" onClick={() => handleDeleteEntry(section.id, index)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
  
                <button className="mt-2 flex items-center bg-blue-400 text-white px-3 py-1 rounded-full shadow-md hover:bg-blue-500 transition" onClick={() => handleAddEntry(section.id)}>
                  <FaPlusCircle className="mr-2" /> Add Entry
                </button>
              </section>
            ))}
  
            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter section name..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition" onClick={handleAddSection}>
                + Add New Section
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default App;
  