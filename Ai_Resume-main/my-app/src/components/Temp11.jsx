import React, { useState,useRef } from 'react';
import { X,Menu,Download, Upload, Share, Settings, Bot, ArrowUp, ArrowDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Temp5 = () => {
const resumeRef = useRef(null);
const [menuOpen, setMenuOpen] = useState(false);
const [isLoadingAI, setIsLoadingAI] = useState(false);
const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: 'YOUR NAME',
      email: '',
      portfolio: '',
      location: '',
    },
    summary: 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.',
    keyAchievements: [
      {
        id: 1,
        title: 'Your Achievement',
        description: 'Describe what you did and the impact it had.'
      }
    ],
    experience: [
      {
        id: 1,
        title: 'Title',
        company: 'Company Name',
        location: 'Location',
        period: 'Date period',
        description: 'Company Description',
        accomplishments: ['Highlight your accomplishments, using numbers if possible.']
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Degree and Field of Study',
        school: 'School or University',
        period: 'Date period'
      }
    ],
    skills: [
      {
        id: 1,
        name: 'Your Skill'
      }
    ],
    certifications: [
      {
        id: 1,
        title: 'Course Title'
      }
    ],
    interests: [
      {
        id: 1,
        interest: 'Career Interest / Passion'
      }
    ],
    languages: [
      {
        id: 1,
        language: 'Language',
        level: 'Beginner',
        rating: 2
      }
    ],
    favoriteQuote: {
      quote: 'Your favorite quote',
      author: 'Author'
    }
  });

  // Function to handle text input changes
  const handleTextChange = (section, field, value, id = null) => {
    if (id !== null) {
      // For array items
      setResumeData(prev => ({
        ...prev,
        [section]: prev[section].map(item => 
          item.id === id ? { ...item, [field]: value } : item
        )
      }));
    } else if (section === 'personalInfo' || section === 'favoriteQuote') {
      // For nested objects
      setResumeData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      // For direct properties
      setResumeData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  // Function to add new item to an array section
  const addItem = (section) => {
    const newId = resumeData[section].length > 0 
      ? Math.max(...resumeData[section].map(item => item.id)) + 1 
      : 1;
    
    let newItem = { id: newId };
    
    // Set default values based on section
    switch(section) {
      case 'keyAchievements':
        newItem = { ...newItem, title: 'New Achievement', description: 'Description' };
        break;
      case 'experience':
        newItem = { 
          ...newItem, 
          title: 'Job Title', 
          company: 'Company', 
          location: 'Location',
          period: 'Date period',
          description: 'Description',
          accomplishments: ['Accomplishment']
        };
        break;
      case 'education':
        newItem = { 
          ...newItem, 
          degree: 'Degree', 
          school: 'School', 
          period: 'Date period' 
        };
        break;
      case 'skills':
        newItem = { ...newItem, name: 'New Skill' };
        break;
      case 'certifications':
        newItem = { ...newItem, title: 'New Certification' };
        break;
      case 'interests':
        newItem = { ...newItem, interest: 'New Interest' };
        break;
      case 'languages':
        newItem = { 
          ...newItem, 
          language: 'New Language', 
          level: 'Beginner',
          rating: 1
        };
        break;
      default:
        break;
    }
    
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  // Function to delete an item from an array section
  const deleteItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  // Function to add an accomplishment to an experience
  const addAccomplishment = (experienceId) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === experienceId 
          ? { ...exp, accomplishments: [...exp.accomplishments, 'New accomplishment'] } 
          : exp
      )
    }));
  };

  // Function to update an accomplishment
  const updateAccomplishment = (experienceId, index, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === experienceId 
          ? { 
              ...exp, 
              accomplishments: exp.accomplishments.map((acc, i) => 
                i === index ? value : acc
              ) 
            } 
          : exp
      )
    }));
  };

  // Function to delete an accomplishment
  const deleteAccomplishment = (experienceId, index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === experienceId 
          ? { 
              ...exp, 
              accomplishments: exp.accomplishments.filter((_, i) => i !== index) 
            } 
          : exp
      )
    }));
  };

  // Function to handle language rating change
  const handleRatingChange = (id, rating) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, rating } : lang
      )
    }));
  };

  const handleShare = () => {
    const shareText = "Check out my resume!";
    const resumeUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + resumeUrl)}`;
    const emailUrl = `mailto:?subject=My Resume&body=${encodeURIComponent(shareText + " " + resumeUrl)}`;
    window.open(whatsappUrl, "_blank");
    window.open(emailUrl, "_blank");
  };
  
const handleDownload = () => {
  if (!resumeRef.current) {
    alert("Resume not found. Please try again.");
    return;
  }

  // Create a temporary clone of the resume
  const resumeClone = resumeRef.current.cloneNode(true);

  // Style the clone properly for PDF export
  resumeClone.style.position = "absolute";
  resumeClone.style.left = "-9999px";
  resumeClone.style.top = "-9999px";
  document.body.appendChild(resumeClone);

  
  // Just hide any edit controls or buttons that shouldn't appear in the PDF
  resumeClone.querySelectorAll("button:not([type='text']), .edit-controls, .add-section-btn").forEach(el => {
    if (!el.classList.contains('form-control')) {
      el.style.display = "none";
    }
  });

  // Ensure section headings are properly styled
  resumeClone.querySelectorAll("div").forEach(div => {
    if (div.textContent && 
        div.textContent.trim().length > 0 && 
        div.textContent.trim().toUpperCase() === div.textContent.trim() &&
        ["KEY ACHIEVEMENTS", "CERTIFICATION", "INTERESTS", "FAVORITE QUOTE", "LANGUAGES"].includes(div.textContent.trim())) {
      div.style.fontWeight = "bold";
      // div.style.borderBottom = "1px solid #000";
      div.style.paddingBottom = "5px";
      div.style.marginTop = "15px";
      div.style.marginBottom = "10px";
    }
  });

  // Ensure proper spacing between sections
  resumeClone.querySelectorAll("input, select").forEach(field => {
    // field.style.marginBottom = "5px";
    // field.style.border = "1px solid #ccc";
    field.style.padding = "5px";
    field.style.width = field.style.width || field.width || "auto";
  });

  // Generate PDF using html2canvas
  html2canvas(resumeClone, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  }).then(canvas => {
    document.body.removeChild(resumeClone); // Cleanup

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    // Calculate height proportionally to maintain aspect ratio
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Handle multipage resumes if needed
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  }).catch(err => {
    console.error("Error generating PDF:", err);
    document.body.removeChild(resumeClone);

    // Provide a fallback print option that preserves the form layout
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: black;
              margin: 0;
              padding: 20px;
            }
            .resume-container {
              max-width: 800px;
              margin: 0 auto;
            }
            div {
              margin-bottom: 5px;
            }
            input, select {
              border: 1px solid #ccc;
              padding: 5px;
              margin-bottom: 5px;
            }
            [placeholder="YOUR NAME"] {
              font-size: larger;
              font-weight: bold;
            }
            div:empty {
              display: none;
            }
            button:not([type='text']), .edit-controls, .add-section-btn {
              display: none;
            }
            div:has(+ input[placeholder="Your Achievement"]),
            div:has(+ input[placeholder="Course Title"]),
            div:has(+ input[placeholder="Career Interest / Passion"]),
            div:has(+ input[placeholder="Your favorite quote"]),
            div:has(+ input[placeholder="Language"]) {
              font-weight: bold;
        
              padding-bottom: 5px;
              margin-top: 15px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeRef.current.outerHTML}
          </div>
          <script>
            document.querySelectorAll('button:not([type="text"]), .edit-controls, .add-section-btn').forEach(el => {
              if (!el.classList.contains('form-control')) {
                el.style.display = 'none';
              }
            });
            
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Please allow popups to download your resume.");
    }
  });
};

  
 
  const handleAIButtonClick = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
      alert("AI enhancement completed!");
    }, 2000);
  };
 

  return (
    // <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex w-full">
       {isLoadingAI && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 text-black text-2xl font-bold z-50">
          Enhancing AI...
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2  rounded "
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar (Hidden on Mobile, Shows as a Menu) */}
      <div
        className={`w-64 bg-gray-900 text-white p-4 min-h-screen fixed top-0 left-0 transition-transform duration-300 ${
          menuOpen ? "translate-x-0 " : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:flex-col gap-4  overflow-y-auto z-40 `}
      >
       
        <button className="bg-green-500 p-2 rounded flex items-center gap-2 w-full" onClick={handleAIButtonClick}>
          <Bot size={18} /> AI
        </button>
        <button className="bg-orange-500 p-2 rounded flex items-center gap-2 w-full" onClick={handleDownload}>
          <Download size={18} /> Download
        </button>
        <button className="bg-gray-700 p-2 rounded flex items-center gap-2 w-full" onClick={handleShare}>
          <Share size={18} /> Share
        </button>

        <label htmlFor="uploadResume" className="bg-blue-700 p-2 rounded flex items-center gap-2 cursor-pointer">
          <Upload size={18} /> Upload Resume
        </label>
        <input id="uploadResume" type="file" className="hidden" />
      </div>
    <div/> 
 
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="container">
    {/* Resume Section */}
    <div ref={resumeRef} className="resume-container">
        {/* Resume Content */}
        <div className="flex flex-col md:flex-row ">
          {/* Left Content*/}
          <div className="w-full md:w-1/3 bg-blue-500 text-white p-6">
            {/* Name */}
            <div className="mb-8">
              <input
                type="text"
                value={resumeData.personalInfo.name}
                onChange={(e) => handleTextChange('personalInfo', 'name', e.target.value)}
                className="  w-full text-base font-bold bg-transparent border-b border-white-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Key Achievements Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold border-b border-white-900 pb-1 mb-2">KEY ACHIEVEMENTS</h2>
                <button 
                  onClick={() => addItem('keyAchievements')}
                  className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {resumeData.keyAchievements.map(achievement => (
                <div key={achievement.id} className="mb-4 relative">
                  <button 
                    onClick={() => deleteItem('keyAchievements', achievement.id)}
                    className="absolute right-0 top-0 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">◆</span>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => handleTextChange('keyAchievements', 'title', e.target.value, achievement.id)}
                      className=" text-xs flex-grow bg-transparent border-b border-blue-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="ml-5">
                    <input
                      type="text"
                      value={achievement.description}
                      onChange={(e) => handleTextChange('keyAchievements', 'description', e.target.value, achievement.id)}
                      className=" w-full bg-transparent text-xs text-gray-300 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Certification Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold border-b border-white pb-1 mb-2">CERTIFICATION</h2>
                <button 
                  onClick={() => addItem('certifications')}
                  className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {resumeData.certifications.map(cert => (
                <div key={cert.id} className="mb-2 relative">
                  <button 
                    onClick={() => deleteItem('certifications', cert.id)}
                    className=" absolute right-0 top-0 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => handleTextChange('certifications', 'title', e.target.value, cert.id)}
                    className="text-xs w-full bg-transparent focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Interests Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold border-b border-white pb-1 mb-2">INTERESTS</h2>
                <button 
                  onClick={() => addItem('interests')}
                  className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {resumeData.interests.map(item => (
                <div key={item.id} className="mb-2 relative">
                  <button 
                    onClick={() => deleteItem('interests', item.id)}
                    className="absolute right-0 top-0 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                  <div className="flex items-center">
                    <span className="mr-2">◆</span>
                    <input
                      type="text"
                      value={item.interest}
                      onChange={(e) => handleTextChange('interests', 'interest', e.target.value, item.id)}
                      className=" text-xs flex-grow bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Favorite Quote Section */}
            <div className="mb-6">
              <h2 className="text-base font-bold border-b border-white pb-1 mb-2">FAVORITE QUOTE</h2>
              <div >
                <input
                  type="text"
                  value={resumeData.favoriteQuote.quote}
                  onChange={(e) => handleTextChange('favoriteQuote', 'quote', e.target.value)}
                  className=" text-xs w-full bg-transparent focus:outline-none mb-1"
                />
                <input
                  type="text"
                  value={resumeData.favoriteQuote.author}
                  onChange={(e) => handleTextChange('favoriteQuote', 'author', e.target.value)}
                  className=" text-xs w-full bg-transparent  focus:outline-none"
                />
              </div>
            </div>

            {/* Languages Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold border-b border-white pb-1 mb-2">LANGUAGES</h2>
                <button 
                  onClick={() => addItem('languages')}
                  className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {resumeData.languages.map(lang => (
                <div key={lang.id} className="mb-3 relative">
                  <button 
                    onClick={() => deleteItem('languages', lang.id)}
                    className="absolute right-0 top-0 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={lang.language}
                      onChange={(e) => handleTextChange('languages', 'language', e.target.value, lang.id)}
                      className=" text-xs bg-transparent focus:outline-none w-1/3"
                    />
                    <select
                      value={lang.level}
                      onChange={(e) => handleTextChange('languages', 'level', e.target.value, lang.id)}
                      className="bg-blue-800 text-white text-xs rounded p-1 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(lang.id, star)}
                        className={`h-4 w-4 mr-1 rounded-full ${star <= lang.rating ? 'bg-white' : 'bg-blue-700 border border-white'}`}
                      ></button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-2/3 p-6">
            {/* Contact Info */}
            <div className="flex flex-wrap mb-4 text-gray-500">
              <div className="flex items-center mr-4 mb-2">
                <span className="mr-1 text-xs">Email:</span>
                <input
                  type="text"
                  placeholder="Email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => handleTextChange('personalInfo', 'email', e.target.value)}
                  className=" text-xs bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center mr-4 mb-2">
                <span className="mr-1">🔗</span>
                <input
                  type="text"
                  placeholder="LinkedIn/Portfolio"
                  value={resumeData.personalInfo.portfolio}
                  onChange={(e) => handleTextChange('personalInfo', 'portfolio', e.target.value)}
                  className=" text-xs bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center mb-2">
             
                <input
                  type="text"
                  placeholder="Location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => handleTextChange('personalInfo', 'location', e.target.value)}
                  className=" text-xs bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

           {/* Summary Section */}
<div className="mb-6">
  <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
  <div
    contentEditable
    suppressContentEditableWarning
    onBlur={(e) => handleTextChange('summary', null, e.target.innerText)}
    className="text-xs w-full h-auto bg-transparent focus:outline-none text-gray-700"
  >
    {resumeData.summary}
  </div>
</div>

            {/* Experience Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h2>
                <button 
                  onClick={() => addItem('experience')}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  + Add Experience
                </button>
              </div>
              
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="mb-6 relative">
                  <button 
                    onClick={() => deleteItem('experience', exp.id)}
                    className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  <div className="flex justify-between mb-1">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleTextChange('experience', 'title', e.target.value, exp.id)}
                      className="text-xs text-gray-800 bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleTextChange('experience', 'period', e.target.value, exp.id)}
                      className=" text-xs text-gray-500 bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500 text-right"
                      placeholder="Date period"
                    />
                  </div>
                  <div className="flex justify-between mb-2">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleTextChange('experience', 'company', e.target.value, exp.id)}
                      className="text-blue-500 text-xs bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500"
                      placeholder="Company Name"
                    />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleTextChange('experience', 'location', e.target.value, exp.id)}
                      className="text-gray-500 text-xs bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500 text-right"
                      placeholder="Location"
                    />
                  </div>
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => handleTextChange('experience', 'description', e.target.value, exp.id)}
                    className="w-full mb-2 text-xs text-gray-600 bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500"
                    placeholder="Company Description"
                  />
                  <div className="mb-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Accomplishments:</span>
                      <button 
                        onClick={() => addAccomplishment(exp.id)}
                        className="text-xs bg-blue-600 px-2 py-1 rounded text-white"
                      >
                        + Add
                      </button>
                    </div>
                    <ul>
                      {exp.accomplishments.map((acc, index) => (
                        <li key={index} className="ml-5 relative">
                          <button 
                            onClick={() => deleteAccomplishment(exp.id, index)}
                            className="absolute left-0 top-1 text-red-500 hover:text-red-700 text-xs"
                          >
                            ×
                          </button>
                          <input
                            type="text"
                            value={acc}
                            onChange={(e) => updateAccomplishment(exp.id, index, e.target.value)}
                            className="w-full pl-4 text-xs text-gray-700 bg-transparent focus:outline-none border-b border-gray-200 focus:border-blue-500"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-2">SKILLS</h2>
                <button 
                  onClick={() => addItem('skills')}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  + Add Skill
                </button>
              </div>
              <div className="flex flex-wrap">
                {resumeData.skills.map(skill => (
                  <div key={skill.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2 mb-2 flex items-center">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleTextChange('skills', 'name', e.target.value, skill.id)}
                      className="bg-transparent text-xs focus:outline-none"
                    />
                    <button 
                      onClick={() => deleteItem('skills', skill.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold border-b border-gray-300 pb-1 mb-2">EDUCATION</h2>
                <button 
                  onClick={() => addItem('education')}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  + Add Education
                </button>
              </div>
              
              {resumeData.education.map(edu => (
                <div key={edu.id} className="mb-4 relative">
                  <button 
                    onClick={() => deleteItem('education', edu.id)}
                    className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  <div className="flex justify-between mb-1">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleTextChange('education', 'degree', e.target.value, edu.id)}
                      className="text-xs text-gray-800 bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500"
                      placeholder="Degree and Field of Study"
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleTextChange('education', 'period', e.target.value, edu.id)}
                      className="text-gray-500 text-xs bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500 text-right"
                      placeholder="Date period"
                    />
                  </div>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleTextChange('education', 'school', e.target.value, edu.id)}
                    className="text-blue-500 text-xs bg-transparent focus:outline-none border-b border-gray-300 focus:border-blue-500"
                    placeholder="School or University"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Temp5;