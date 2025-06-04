import React, { useState, useRef } from "react";
import { Download, Upload, Share, Settings, Edit, Plus, Save, Trash2, Bot, ArrowUp, ArrowDown ,Mail} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Resumes() {
  const resumeRef = useRef(null);

  const [sections, setSections] = useState(["header", "experience","achievements","projects","education", "skills"]);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [editingSections, setEditingSections] = useState({});
  const [editingHeader, setEditingHeader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  // State for managing editable content
  const [editableContent, setEditableContent] = useState({
    header: {
      name: "YOUR NAME",
      title: "Full Stack Developer",
      contact: {
        phone: "+1-555-555-5555",
        email: "xyz@gmail.com",
        location: "San Francisco, CA"
      }
    },
   
    experience: [
      {
        id: 1,
        title: "Senior Full Stack Developer",
        company: "Boyle",
        period: "2018 - Present",
        description: "Boyle is an international Technology and Management Consulting Group with a rapid-pace development and innovative solutions for demanding projects.",
        achievements: [
          "Spearheaded and built Agile team of 7 full-stack developers",
          "Developed channel database architecture using SQL procedures and triggers for 10 different applications"
        ]
      }
    ],

    achievements: [
      {
        id: 1,
        title: "AWS Certification",
        description: "Achieved AWS Certified Solutions Architect certification",
        year: "2023"
      },
    
    ],
    projects: [
      {
        id: 1,
        title: "Data Lake Implementation",
        description: "Led the design and implementation of a comprehensive data lake solution on AWS S3, enhancing data accessibility and analytics capabilities",
        technologies: "AWS S3, Glue, Athena, Python",
        year: "2023"
      }
     
    ],
    education: [
      {
        id: 1,
        school: "Stanford University",
        degree: "M.S. in Computer Science",
        period: "2008 - 2009"
      }
    ],
    skills: {
      clientSide: "HTML • CSS • JS • Angular • React • Vue • Redux • RecurrsJS",
      serverSide: "Python • Node.JS • SQL ",
      devOps: "Shell • Mysql "
    }
  });

  const handleDownload = () => {
    if (resumeRef.current) {
      // Create a clone of the resume element to avoid affecting the original
      const resumeClone = resumeRef.current.cloneNode(true);
      
      // Add to document but make it invisible
      resumeClone.style.position = 'absolute';
      resumeClone.style.left = '-9999px';
      resumeClone.style.top = '-9999px';
      document.body.appendChild(resumeClone);
      
      // Hide all edit buttons and controls in the clone
      resumeClone.querySelectorAll('button, .absolute').forEach(el => {
        el.style.display = 'none';
      });
      
      // Ensure horizontal lines and section headers are properly styled
      resumeClone.querySelectorAll('h2').forEach(heading => {
        heading.style.textAlign = 'left';
        heading.style.fontSize = '20px';
        heading.style.fontWeight = 'extrabold';
        heading.style.marginBottom = '6px';
      });
      
      resumeClone.querySelectorAll('.border-b').forEach(line => {
        line.style.borderBottom = '1px solid #ddd';
        line.style.width = '100%';
        line.style.marginBottom = '2rem';
      });
      
      // Ensure the header layout is correct with name/title on left and contact info on right
      const headerElement = resumeClone.querySelector('header');
      if (headerElement) {
        const headerDiv = headerElement.querySelector('div');
        if (headerDiv) {
          headerDiv.style.display = 'flex';
          headerDiv.style.justifyContent = 'space-between';
          headerDiv.style.alignItems = 'flex-start';
          headerDiv.style.width = '100%';
          
          // Make sure name and title are prominent
          const nameElement = headerDiv.querySelector('h1');
          if (nameElement) {
            nameElement.style.fontSize = '28px';
            nameElement.style.marginBottom = '5px';
            nameElement.style.marginTop = '0';
          }
          
          // Ensure contact info is properly formatted
          const contactDiv = headerDiv.querySelector('div.text-gray-600');
          if (contactDiv) {
            contactDiv.style.textAlign = 'right';
            contactDiv.style.fontSize = '14px';
          }
        }
      }
      
      // Use html2canvas with the clone
      html2canvas(resumeClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        // Handle color and layout issues
        onclone: (clonedDoc) => {
          // Find all elements with potentially problematic color values
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            // Use getComputedStyle to get resolved colors
            const style = window.getComputedStyle(el);
            
            // Override with standard colors if needed
            if (style.color.includes('rgb(')) {
              el.style.color = style.color;
            } else {
              el.style.color = '#000000';
            }
            
            if (style.backgroundColor && style.backgroundColor.includes('rgb(')) {
              el.style.backgroundColor = style.backgroundColor;
            } else if (style.backgroundColor) {
              el.style.backgroundColor = '#ffffff';
            }
          });
          
          // Additional header styling for PDF
          const headerElement = clonedDoc.querySelector('header');
          if (headerElement) {
            headerElement.style.marginBottom = '20px';
            
            const headerContent = headerElement.querySelector('div');
            if (headerContent) {
              headerContent.style.display = 'flex';
              headerContent.style.justifyContent = 'space-between';
              headerContent.style.alignItems = 'flex-start';
              headerContent.style.width = '100%';
              
              // Make sure name has proper spacing
              const nameContainer = headerContent.querySelector('div:first-child');
              if (nameContainer) {
                nameContainer.style.maxWidth = '60%';
              }
              
              // Make sure contact info has proper spacing
              const contactContainer = headerContent.querySelector('div.text-gray-600');
              if (contactContainer) {
                contactContainer.style.maxWidth = '35%';
                contactContainer.style.textAlign = 'right';
              }
            }
          }
          
          // Ensure proper section spacing
          clonedDoc.querySelectorAll('section').forEach(section => {
            section.style.marginBottom = '20px';
            section.style.pageBreakInside = 'avoid';
          });
        }
      })
      .then(canvas => {
        // Clean up - remove the clone
        document.body.removeChild(resumeClone);
        
        // Generate PDF from canvas
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        
        // Handle multi-page if needed
        let heightLeft = imgHeight;
        let position = 0;
        
        while (heightLeft >= pageHeight) {
          position = heightLeft - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save("resume.pdf");
      })
      .catch(err => {
        console.error("Error generating PDF:", err);
        document.body.removeChild(resumeClone);
        
        // Fallback to print method if canvas fails
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Resume</title>
              <style>
                body {
                  font-family: sans-serif;
                  color: black;
                  background: white;
                  margin: 0;
                  padding: 20px;
                }
                .resume-container {
                  max-width: 800px;
                  margin: 0 auto;
                }
                h2, header {
                  text-align: left !important;
                }
                header > div {
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: flex-start !important;
                }
                header h1 {
                  font-size: 28px !important;
                  margin-bottom: 5px !important;
                }
                header .text-gray-600 {
                  text-align: right !important;
                }
                .border-b {
                  border-bottom: 1px solid #ddd !important;
                  width: 100% !important;
                  margin-bottom: 2rem !important;
                }
                button, .absolute {
                  display: none !important;
                }
              </style>
            </head>
            <body>
              <div class="resume-container">
                ${resumeRef.current.outerHTML}
              </div>
              <script>
                // Remove all edit buttons
                document.querySelectorAll('button, .absolute').forEach(el => {
                  el.style.display = 'none';
                });
                
                // Print automatically
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
          alert("Please allow popups to download your resume");
        }
      });
    }
  };
  const handleAIButtonClick = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
      alert("AI enhancement completed!");
    }, 2000);
  };
  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === "up" && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === "down" && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const handleShare = () => {
    const shareText = "Check out my resume!";
    const resumeUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + resumeUrl)}`;
    const emailUrl = `mailto:?subject=My Resume&body=${encodeURIComponent(shareText + " " + resumeUrl)}`;
    window.open(whatsappUrl, "_blank");
    window.open(emailUrl, "_blank");
  };
 // Content editing handlers
const handleEdit = (section) => {
  setEditingSections({ ...editingSections, [section]: true });
};

const handleSave = (section) => {
  setEditingSections({ ...editingSections, [section]: false });
  setShowSuccessMessage(true);
  setTimeout(() => setShowSuccessMessage(false), 3000);
};

// Unified delete handler that works for both section items and entire sections
const handleDelete = (section, id = null) => {
  if (window.confirm('Are you sure you want to delete this item?')) {
    if (id !== null) {
      // Delete a specific item (experience, education, achievements, projects)
      const updatedContent = editableContent[section].filter(item => item.id !== id);
      setEditableContent({ ...editableContent, [section]: updatedContent });
    } else {
      // Delete entire section's content
      if (section === "header") {
        setEditableContent({ ...editableContent, header: null });
      
      } else if (section === "skills") {
        setEditableContent({ ...editableContent, skills: null });
      } else {
        // For array-based sections, clear the array
        setEditableContent({ ...editableContent, [section]: [] });
      }
    }
  }
};

const handleAdd = (section) => {
  if (section === 'experience') {
    const newExperience = {
      id: Date.now(),
      title: "New Position",
      company: "Company Name",
      period: "Start - End",
      description: "Description here",
      achievements: ["New achievement"]
    };
    setEditableContent({
      ...editableContent,
      experience: [...editableContent.experience, newExperience]
    });
  } else if (section === 'education') {
    const newEducation = {
      id: Date.now(),
      school: "New School",
      degree: "Degree",
      period: "Year - Year"
    };
    setEditableContent({
      ...editableContent,
      education: [...editableContent.education, newEducation]
    });
  }
};

// Handler for content updates
const handleContentChange = (section, value, field = null, id = null) => {
  if (section === 'header') {
    if (!editableContent.header) return;
    if (field in editableContent.header) {
      setEditableContent({
        ...editableContent,
        header: { ...editableContent.header, [field]: value }
      });
    } else {
      setEditableContent({
        ...editableContent,
        header: {
          ...editableContent.header,
          contact: { ...editableContent.header.contact, [field]: value }
        }
      });
    }
  } else if (id !== null) {
    const updatedContent = editableContent[section].map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setEditableContent({ ...editableContent, [section]: updatedContent });
  } else {
    if (section === 'skills') {
      setEditableContent({
        ...editableContent,
        skills: { ...editableContent.skills, [field]: value }
      });
    } else {
      setEditableContent({ ...editableContent, [section]: { content: value } });
    }
  }
};

// Success message component
const SuccessMessage = () => (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
    Changes saved successfully!
  </div>
);

// Section buttons
const SectionButtons = ({ section }) => (
  <div className="absolute right-0 top-0 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md">
    {editingSections[section] ? (
      <button
        onClick={() => handleSave(section)}
        className="text-green-600 hover:text-green-800"
        title="Save changes"
      >
        <Save size={18} />
      </button>
    ) : (
      <>
        <button
          onClick={() => handleEdit(section)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit section"
        >
          <Edit size={18} />
        </button>
        {(section === 'experience' || section === 'education') && (
          <button
            onClick={() => handleAdd(section)}
            className="text-green-600 hover:text-green-800"
            title="Add new item"
          >
            <Plus size={18} />
          </button>
        )}
        <button
          onClick={() => handleDelete(section)}
          className="text-red-600 hover:text-red-800"
          title="Delete section"
        >
          <Trash2 size={18} />
        </button>
      </>
    )}
  </div>
);

// Header buttons
const HeaderButtons = () => (
  <div className="absolute right-0 top-0 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
    {editingHeader ? (
      <button
        onClick={() => {
          setEditingHeader(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }}
        className="text-green-600 hover:text-green-800"
        title="Save header"
      >
        <Save size={18} />
      </button>
    ) : (
      <>
        <button
          onClick={() => setEditingHeader(true)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit header"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => handleDelete('header')}
          className="text-red-600 hover:text-red-800"
          title="Delete header"
        >
          <Trash2 size={18} />
        </button>
      </>
    )}
  </div>
);

// Add these handler functions to your component
const handleAddAchievement = () => {
  const newAchievement = {
    id: Date.now(),
    title: "New Achievement",
    description: "Description here",
    year: "Year"
  };
  setEditableContent({
    ...editableContent,
    achievements: [...editableContent.achievements, newAchievement]
  });
  // Automatically go into edit mode for the section if not already
  if (!editingSections.achievements) {
    setEditingSections({ ...editingSections, achievements: true });
  }
};

const handleAddProject = () => {
  const newProject = {
    id: Date.now(),
    title: "New Project",
    description: "Description here",
    technologies: "Technologies used",
    year: "Year"
  };
  setEditableContent({
    ...editableContent,
    projects: [...editableContent.projects, newProject]
  });
  // Automatically go into edit mode for the section if not already
  if (!editingSections.projects) {
    setEditingSections({ ...editingSections, projects: true });
  }
};

// Function to delete a specific item within a section - this is no longer needed
// as the main handleDelete function now handles both items and sections
// The code in the rendering part should use handleDelete instead
const handleItemDelete = (section, id) => {
  handleDelete(section, id);
};

// Function to delete an entire section
const handleSectionDelete = (section) => {
  if (window.confirm(`Are you sure you want to delete the entire ${section} section?`)) {
    // Create a new array of sections without the deleted one
    const newSections = sections.filter(s => s !== section);
    setSections(newSections);
    
    // You might also want to clear the section data
    const updatedContent = { ...editableContent };
    updatedContent[section] = [];
    setEditableContent(updatedContent);
  }
};
  
  return (
    <div className="flex w-full">
       {isLoadingAI && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 text-black text-2xl font-bold z-50">
          Enhancing AI...
        </div>
      )}
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 h-screen sticky top-0 overflow-y-auto flex flex-col gap-4">
        <button className="bg-blue-500 p-2 rounded flex items-center justify-center gap-2" onClick={() => setIsRearrangeMode(!isRearrangeMode)}>
          <Settings size={18} /> {isRearrangeMode ? "Done Rearranging" : "Rearrange Sections"}
        </button>
        {isRearrangeMode && (
          <div className="bg-gray-800 p-3 rounded mt-2">
            <h3 className="text-sm font-semibold mb-2 text-center">Rearrange resume sections</h3>
            {sections.map((section, index) => (
              <div key={section} className="flex items-center justify-between p-2 my-1 border border-gray-700 rounded bg-gray-850 hover:bg-gray-750">
                <span className="capitalize">{section}</span>
                <div className="flex gap-1">
                  <button className="p-1 rounded hover:bg-gray-700 disabled:opacity-50" onClick={() => moveSection(index, "up")} disabled={index === 0}>
                    <ArrowUp size={16} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-700 disabled:opacity-50" onClick={() => moveSection(index, "down")} disabled={index === sections.length - 1}>
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="bg-green-500 p-2 rounded flex items-center gap-2" onClick={handleAIButtonClick}>
          <Bot size={18} / > AI
        </button>
        <button className="bg-orange-500 p-2 rounded flex items-center gap-2" onClick={handleDownload}>
          <Download size={18} /> Download
        </button>
        <button className="bg-gray-700 p-2 rounded flex items-center gap-2" onClick={handleShare}>
          <Share size={18} /> Share
        </button>
        
        <label htmlFor="uploadResume" className="bg-blue-600 p-2 rounded flex items-center gap-2 cursor-pointer">
          <Upload size={18} /> Upload Resume
        </label>
        <input id="uploadResume" type="file" className="hidden" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white" ref={resumeRef}>
          {showSuccessMessage && <SuccessMessage />}

          {/* Render sections in the order specified by sections array */}
          {sections.map((sectionName) => {
            switch (sectionName) {
              case 'header':
                return editableContent.header && (
                  <header key={sectionName} className="mb-8 relative group">
                  <HeaderButtons />
                  {editingHeader ? (
                    <div className="space-y-2">
                      <input
                        className="text-5xl font-bold border rounded px-2 "
                        value={editableContent.header.name}
                        onChange={(e) => handleContentChange('header', e.target.value, 'name')}
                      />
                      <input
                        className="text-black-600 text-xl border rounded px-2"
                        value={editableContent.header.title}
                        onChange={(e) => handleContentChange('header', e.target.value, 'title')}
                      />
                      <div className="flex justify-between gap-4">
                        <input
                          className="border rounded px-2"
                          value={editableContent.header.contact.phone}
                          onChange={(e) => handleContentChange('header', e.target.value, 'phone')}
                          placeholder="Phone"
                        />
                        <input
                          className="border rounded px-2"
                          value={editableContent.header.contact.email}
                          onChange={(e) => handleContentChange('header', e.target.value, 'email')}
                          placeholder="Email"
                        />
                        <input
                          className="border rounded px-2"
                          value={editableContent.header.contact.location}
                          onChange={(e) => handleContentChange('header', e.target.value, 'location')}
                          placeholder="Location"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <h1 className="text-5xl font-bold">{editableContent.header.name}</h1>
                        <p className="text-black-600 text-xl">{editableContent.header.title}</p>
                      </div>
                      <div className="text-black-600 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                           {editableContent.header.contact.phone}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mail size={16} /> {editableContent.header.contact.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {editableContent.header.contact.location}
                        </div>
                      </div>
                    </div>
                  )}
                </header>
                               
              
                );

              
               // Experience Section
case 'experience':
  return (
    <section
      key={sectionName}
      className="mb-8 relative group"
      onMouseEnter={() => setHoveredSection('experience')}
      onMouseLeave={() => setHoveredSection(null)}
    >
      <h2 className="text-2xl font-bold mb-6 ">Experience</h2>
      <div className="border-b border-gray-300 mb-8"></div>
      {hoveredSection === 'experience' && (
        <div className="absolute right-0 top-0 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md">
          {editingSections.experience ? (
            <button
              onClick={() => handleSave('experience')}
              className="text-green-600 hover:text-green-800"
              title="Save changes"
            >
              <Save size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit('experience')}
                className="text-blue-600 hover:text-blue-800"
                title="Edit section"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleAdd('experience')}
                className="text-green-600 hover:text-green-800"
                title="Add new experience"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => handleSectionDelete('experience')}
                className="text-red-600 hover:text-red-800"
                title="Delete entire experience section"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      )}
      {editableContent.experience.map((exp) => (
        <div key={exp.id} className="mb-6 relative group">
          <div className="flex justify-between items-center mb-2">
            {editingSections.experience ? (
              <>
                <input
                  className="text-xl font-semibold border rounded px-2"
                  value={exp.title}
                  onChange={(e) => handleContentChange('experience', e.target.value, 'title', exp.id)}
                />
                <input
                  className="text-gray-600 border rounded px-2"
                  value={exp.period}
                  onChange={(e) => handleContentChange('experience', e.target.value, 'period', exp.id)}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <span className="text-gray-600">{exp.period}</span>
              </>
            )}
          </div>
          {editingSections.experience ? (
            <textarea
              className="w-full p-2 border rounded mt-2"
              value={exp.description}
              onChange={(e) => handleContentChange('experience', e.target.value, 'description', exp.id)}
              rows={3}
            />
          ) : (
            <p className="text-gray-700">{exp.description}</p>
          )}
          <button
            onClick={() => handleItemDelete('experience', exp.id)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete this experience"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {editingSections.experience && (
        <button
          onClick={() => handleAdd('experience')}
          className="mt-2 p-2 bg-green-100 rounded flex items-center gap-2"
        >
          <Plus size={18} /> 
        </button>
      )}
    </section>
  );

                
  // Achievements Section
case 'achievements':
  return (
    <section
      key={sectionName}
      className="mb-8 relative group"
      onMouseEnter={() => setHoveredSection('achievements')}
      onMouseLeave={() => setHoveredSection(null)}
    >
      <h2 className="text-2xl font-bold mb-4 ">Achievements</h2>
      <div className="border-b border-gray-300 mb-8"></div>
      {hoveredSection === 'achievements' && (
        <div className="absolute right-0 top-0 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md">
          {editingSections.achievements ? (
            <button
              onClick={() => handleSave('achievements')}
              className="text-green-600 hover:text-green-800"
              title="Save changes"
            >
              <Save size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit('achievements')}
                className="text-blue-600 hover:text-blue-800"
                title="Edit section"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleAddAchievement()}
                className="text-green-600 hover:text-green-800"
                title="Add new achievement"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => handleSectionDelete('achievements')}
                className="text-red-600 hover:text-red-800"
                title="Delete section"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      )}
      {editableContent.achievements.map((achievement) => (
        <div key={achievement.id} className="mb-4 relative group">
          <div className="flex justify-between items-center mb-2">
            {editingSections.achievements ? (
              <>
                <input
                  className="text-xl font-semibold border rounded px-2"
                  value={achievement.title}
                  onChange={(e) => handleContentChange('achievements', e.target.value, 'title', achievement.id)}
                />
                <input
                  className="text-gray-600 border rounded px-2"
                  value={achievement.year}
                  onChange={(e) => handleContentChange('achievements', e.target.value, 'year', achievement.id)}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{achievement.title}</h3>
                <span className="text-gray-600">{achievement.year}</span>
              </>
            )}
          </div>
          {editingSections.achievements ? (
            <textarea
              className="w-full p-2 border rounded mt-2"
              value={achievement.description}
              onChange={(e) => handleContentChange('achievements', e.target.value, 'description', achievement.id)}
              rows={2}
            />
          ) : (
            <p className="text-gray-700">{achievement.description}</p>
          )}
          {editingSections.achievements && (
            <button
              onClick={() => handleItemDelete('achievements', achievement.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete this achievement"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}
     
    </section>
  );

// Projects Section
case 'projects':
  return (
    <section
      key={sectionName}
      className="mb-8 relative group"
      onMouseEnter={() => setHoveredSection('projects')}
      onMouseLeave={() => setHoveredSection(null)}
    >
      <h2 className="text-2xl font-bold mb-4  ">Projects</h2>
      <div className="border-b border-gray-300 mb-8"></div>
      {hoveredSection === 'projects' && (
        <div className="absolute right-0 top-0 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md">
          {editingSections.projects ? (
            <button
              onClick={() => handleSave('projects')}
              className="text-green-600 hover:text-green-800"
              title="Save changes"
            >
              <Save size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit('projects')}
                className="text-blue-600 hover:text-blue-800"
                title="Edit section"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleAddProject()}
                className="text-green-600 hover:text-green-800"
                title="Add new project"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => handleSectionDelete('projects')}
                className="text-red-600 hover:text-red-800"
                title="Delete section"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      )}
      {editableContent.projects.map((project) => (
        <div key={project.id} className="mb-6 relative group">
          <div className="flex justify-between items-center mb-2">
            {editingSections.projects ? (
              <>
                <input
                  className="text-xl font-semibold border rounded px-2"
                  value={project.title}
                  onChange={(e) => handleContentChange('projects', e.target.value, 'title', project.id)}
                />
                <input
                  className="text-gray-600 border rounded px-2"
                  value={project.year}
                  onChange={(e) => handleContentChange('projects', e.target.value, 'year', project.id)}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <span className="text-gray-600">{project.year}</span>
              </>
            )}
          </div>
          {editingSections.projects ? (
            <>
              <textarea
                className="w-full p-2 border rounded mt-2 mb-2"
                value={project.description}
                onChange={(e) => handleContentChange('projects', e.target.value, 'description', project.id)}
                rows={3}
              />
              <input
                className="w-full p-2 border rounded"
                value={project.technologies}
                onChange={(e) => handleContentChange('projects', e.target.value, 'technologies', project.id)}
                placeholder="Technologies used"
              />
            </>
          ) : (
            <>
              <p className="text-gray-700">{project.description}</p>
              <p className="text-gray-600 mt-2"><span className="font-medium">Technologies:</span> {project.technologies}</p>
            </>
          )}
          {editingSections.projects && (
            <button
              onClick={() => handleItemDelete('projects', project.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete this project"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}
     
    </section>
  );

  case 'education':
    return (
      <section
        key={sectionName}
        className="mb-8 relative group"
        onMouseEnter={() => setHoveredSection('education')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <h2 className="text-2xl font-bold mb-4 ">Education</h2>
        <div className="border-b border-gray-300 mb-8"></div>
        {hoveredSection === 'education' && (
          <div className="absolute right-0 top-0 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md">
            {editingSections.education ? (
              <button
                onClick={() => handleSave('education')}
                className="text-green-600 hover:text-green-800"
                title="Save changes"
              >
                <Save size={18} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleEdit('education')}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit section"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleAdd('education')}
                  className="text-green-600 hover:text-green-800"
                  title="Add new education"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleSectionDelete('education')}
                  className="text-red-600 hover:text-red-800"
                  title="Delete entire education section"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        )}
        {editableContent.education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-center mb-4 relative group">
            <div>
              {editingSections.education ? (
                <>
                  <input
                    className="text-xl font-semibold border rounded px-2 mb-2"
                    value={edu.school}
                    onChange={(e) => handleContentChange('education', e.target.value, 'school', edu.id)}
                  />
                  <input
                    className="text-gray-700 border rounded px-2 block"
                    value={edu.degree}
                    onChange={(e) => handleContentChange('education', e.target.value, 'degree', edu.id)}
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{edu.school}</h3>
                  <p className="text-gray-700">{edu.degree}</p>
                </>
              )}
            </div>
            {editingSections.education ? (
              <input
                className="text-gray-600 border rounded px-2"
                value={edu.period}
                onChange={(e) => handleContentChange('education', e.target.value, 'period', edu.id)}
              />
            ) : (
              <span className="text-gray-600">{edu.period}</span>
            )}
            <button
              onClick={() => handleItemDelete('education', edu.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete this education item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {editingSections.education && (
          <button
            onClick={() => handleAdd('education')}
            className="mt-2 p-2 bg-green-100 text-green-700 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Add Education
          </button>
        )}
      </section>
    );

              case 'skills':
                return editableContent.skills && (
                  <section
                    key={sectionName}
                    className="mb-8 relative group"
                    onMouseEnter={() => setHoveredSection('skills')}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <h2 className="text-2xl font-bold mb-4 ">Skills</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    {hoveredSection === 'skills' && <SectionButtons section="skills" />}
                    {editingSections.skills ? (
                      <>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Client-Side:</h3>
                          <input
                            className="w-full p-2 border rounded"
                            value={editableContent.skills.clientSide}
                            onChange={(e) => handleContentChange('skills', e.target.value, 'clientSide')}
                          />
                        </div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Server-side:</h3>
                          <input
                            className="w-full p-2 border rounded"
                            value={editableContent.skills.serverSide}
                            onChange={(e) => handleContentChange('skills', e.target.value, 'serverSide')}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Development & Operations:</h3>
                          <input
                            className="w-full p-2 border rounded"
                            value={editableContent.skills.devOps}
                            onChange={(e) => handleContentChange('skills', e.target.value, 'devOps')}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Client-Side:</h3>
                          <p className="text-gray-700">{editableContent.skills.clientSide}</p>
                        </div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Server-side:</h3>
                          <p className="text-gray-700">{editableContent.skills.serverSide}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Development & Operations:</h3>
                          <p className="text-gray-700">{editableContent.skills.devOps}</p>
                        </div>
                      </>
                    )}
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* CSS for printing */}
      <style jsx>{`
        @media print {
          .absolute {
            display: none !important;
          }
        }
      `}</style>
    </div>
 );
 }