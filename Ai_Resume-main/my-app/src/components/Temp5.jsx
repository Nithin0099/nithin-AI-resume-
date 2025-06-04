import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Add axios for HTTP requests
import { Download, Upload, Share, Settings, Edit, Plus, Save, Trash2, Bot, ArrowUp, ArrowDown, Mail } from "lucide-react";

export default function Temp5() {
  const resumeRef = useRef(null);
  const [sections, setSections] = useState(["header", "summary", "experience", "achievements", "projects", "education", "skills"]);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingSections, setEditingSections] = useState({});
  const [editingHeader, setEditingHeader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Unified loading state for AI and download
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);

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
    summary: "Experienced Full Stack Developer with over 5 years of experience in designing and implementing web applications. Skilled in both front-end and back-end technologies with a proven track record of delivering scalable solutions.",
    experience: [{
      id: 1,
      title: "Senior Full Stack Developer",
      company: "Boyle",
      period: "2018 - Present",
      description: "Boyle is an international Technology and Management Consulting Group with a rapid-pace development and innovative solutions for demanding projects.",
      achievements: [
        "Spearheaded and built Agile team of 7 full-stack developers",
        "Developed channel database architecture using SQL procedures and triggers for 10 different applications"
      ]
    }],
    achievements: [{
      id: 1,
      title: "AWS Certification",
      description: "Achieved AWS Certified Solutions Architect certification",
      year: "2023"
    }],
    projects: [{
      id: 1,
      title: "Data Lake Implementation",
      description: "Led the design and implementation of a comprehensive data lake solution on AWS S3, enhancing data accessibility and analytics capabilities",
      technologies: "AWS S3, Glue, Athena, Python",
      year: "2023"
    }],
    education: [{
      id: 1,
      school: "Stanford University",
      degree: "M.S. in Computer Science",
      period: "2008 - 2009"
    }],
    skills: {
      clientSide: "HTML • CSS • JS • Angular • React • Vue • Redux • RecurrsJS",
      serverSide: "Python • Node.JS • SQL ",
      devOps: "Shell • Mysql "
    }
  });

  // Load resume data on mount (optional, based on email)
  useEffect(() => {
    const loadSavedResume = async () => {
      if (editableContent.header.contact.email === "xyz@gmail.com") return; // Skip if placeholder
      try {
        const response = await axios.get('http://localhost:5000/api/temp5/load', {
          params: { email: editableContent.header.contact.email },
        });
        if (response.data?.data) {
          setEditableContent(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load saved resume:", error);
      }
    };
    loadSavedResume();
  }, []);

  const downloadPdf = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/temp5/generate-pdf",
        { resumeData: editableContent },
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
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      alert("PDF generation failed. Please check your resume data.");
      setIsLoading(false);
    }
  };

  const handleAIEnhancement = async () => {
    if (!editableContent._id) {
      await saveResume();
      alert("Resume saved. Click AI Assistant again to enhance.");
      return;
    }
    setIsLoading(true);
    setShowEnhancementOptions(true);
    setIsLoading(false);
  };

  const enhanceSingleField = async (field) => {
    if (!editableContent._id) {
      alert("Please save your resume before enhancing a field.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/temp5/enhanceField', {
        resumeId: editableContent._id,
        field,
      });
      if (response.data?.data) {
        setEditableContent(response.data.data);
        alert(`${field} enhanced successfully!`);
      }
    } catch (error) {
      console.error(`Error enhancing ${field}:`, error);
      alert(`Failed to enhance ${field}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/temp5/save", { resumeData: editableContent });
      if (response.data?.data?._id) {
        setEditableContent(prev => ({ ...prev, _id: response.data.data._id }));
        alert("Resume saved successfully!");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume.");
    }
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

  const handleEdit = (section) => {
    setEditingSections({ ...editingSections, [section]: true });
  };

  const handleSave = (section) => {
    setEditingSections({ ...editingSections, [section]: false });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDelete = (section, id = null, field = null) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (id !== null) {
        const updatedContent = editableContent[section].filter(item => item.id !== id);
        setEditableContent({ ...editableContent, [section]: updatedContent });
      } else if (field !== null && section === "skills") {
        const updatedSkills = { ...editableContent.skills };
        delete updatedSkills[field];
        setEditableContent({ ...editableContent, skills: updatedSkills });
      } else {
        if (section === "header") {
          setEditableContent({ ...editableContent, header: null });
        } else if (section === "skills") {
          setEditableContent({ ...editableContent, skills: null });
        } else if (section === "summary") {
          setEditableContent({ ...editableContent, summary: "" });
        } else {
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
    handleEdit(section);
  };

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
    handleEdit('achievements');
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
    handleEdit('projects');
  };

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
    } else if (section === 'summary') {
      setEditableContent({
        ...editableContent,
        summary: value
      });
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
      }
    }
  };

  const SuccessMessage = () => (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      Changes saved successfully!
    </div>
  );

  const SectionButtons = ({ section }) => (
    <div className="control-buttons flex gap-2 absolute right-0 top-0 bg-white/90 p-2 rounded-lg shadow-md">
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
          {(section === 'experience' || section === 'education' || section === 'achievements' || section === 'projects') && (
            <button
              onClick={() => section === 'experience' ? handleAdd(section) : 
                            section === 'education' ? handleAdd(section) : 
                            section === 'achievements' ? handleAddAchievement() : 
                            handleAddProject()}
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

  const HeaderButtons = () => (
    <div className="control-buttons flex gap-2 absolute right-0 top-0 bg-white/90 p-2 rounded-lg shadow-md">
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

  return (
    <div className="flex w-full min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 h-screen sticky top-0 overflow-y-auto md:flex md:flex-col gap-4 hidden">
        <button className="bg-blue-500 p-2 rounded flex items-center justify-center gap-2" onClick={() => setIsRearrangeMode(!isRearrangeMode)}>
          <Settings size={18} /> {isRearrangeMode ? "Done Rearranging" : "Rearrange Sections"}
        </button>
        {isRearrangeMode && (
          <div className="bg-gray-800 p-3 rounded mt-2">
            <h3 className="text-sm font-semibold mb-2 text-left">Rearrange resume sections</h3>
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
        <button className="bg-green-500 p-2 rounded flex items-center gap-2" onClick={handleAIEnhancement}>
          <Bot size={18} /> AI Assistant
        </button>
        {showEnhancementOptions && (
          <div className="bg-gray-800 p-3 rounded mt-2">
            <h4 className="text-sm font-semibold mb-2 text-left">Enhance Specific Field</h4>
            <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("summary")}>
              Enhance Summary
            </button>
            <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("experience")}>
              Enhance Experience
            </button>
            <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("achievements")}>
              Enhance Achievements
            </button>
            <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("projects")}>
              Enhance Projects
            </button>
          </div>
        )}
        <button className="bg-orange-500 p-2 rounded flex items-center gap-2" onClick={downloadPdf}>
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

      {/* Mobile Menu (Moved to Left Sidebar) */}
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '≡'}
        </button>

        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div
              className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out z-50 transform"
              style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
            >
              <button
                className="absolute top-3 right-3 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
              <div className="flex flex-col gap-4 mt-12">
                <button className="bg-blue-500 p-2 rounded flex items-center justify-start gap-2" onClick={() => setIsRearrangeMode(!isRearrangeMode)}>
                  <Settings size={18} /> {isRearrangeMode ? "Done Rearranging" : "Rearrange Sections"}
                </button>
                {isRearrangeMode && (
                  <div className="bg-gray-800 p-3 rounded">
                    <h3 className="text-sm font-semibold mb-2 text-left">Rearrange Sections</h3>
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
                <button className="bg-green-500 p-2 rounded flex items-center justify-start gap-2" onClick={handleAIEnhancement}>
                  <Bot size={18} /> AI Assistant
                </button>
                {showEnhancementOptions && (
                  <div className="bg-gray-800 p-3 rounded">
                    <h4 className="text-sm font-semibold mb-2 text-left">Enhance Specific Field</h4>
                    <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("summary")}>
                      Enhance Summary
                    </button>
                    <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("experience")}>
                      Enhance Experience
                    </button>
                    <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("achievements")}>
                      Enhance Achievements
                    </button>
                    <button className="w-full bg-gray-700 p-2 mb-2 rounded hover:bg-gray-600 text-left" onClick={() => enhanceSingleField("projects")}>
                      Enhance Projects
                    </button>
                  </div>
                )}
                <button className="bg-orange-500 p-2 rounded flex items-center justify-start gap-2" onClick={downloadPdf}>
                  <Download size={18} /> Download
                </button>
                <button className="bg-gray-700 p-2 rounded flex items-center justify-start gap-2" onClick={handleShare}>
                  <Share size={18} /> Share
                </button>
                <label htmlFor="uploadResumeMobile" className="bg-blue-600 p-2 rounded flex items-center justify-start gap-2 cursor-pointer">
                  <Upload size={18} /> Upload Resume
                </label>
                <input id="uploadResumeMobile" type="file" className="hidden" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white" ref={resumeRef}>
          {showSuccessMessage && <SuccessMessage />}
          
          {sections.map((sectionName) => {
            switch (sectionName) {
              case 'header':
                return editableContent.header && (
                  <header key={sectionName} className="mb-8 relative">
                    <HeaderButtons />
                    <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                      <div className="flex-1">
                        {editingHeader ? (
                          <>
                            <input
                              className="text-3xl font-bold w-full mb-2 p-1 border rounded"
                              value={editableContent.header.name}
                              onChange={(e) => handleContentChange('header', e.target.value, 'name')}
                            />
                            <input
                              className="text-lg text-gray-600 w-full p-1 border rounded"
                              value={editableContent.header.title}
                              onChange={(e) => handleContentChange('header', e.target.value, 'title')}
                            />
                          </>
                        ) : (
                          <>
                            <h1 className="text-3xl font-bold">{editableContent.header.name}</h1>
                            <p className="text-lg text-gray-600">{editableContent.header.title}</p>
                          </>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {editingHeader ? (
                          <>
                            <input
                              className="block w-full mb-1 p-1 border rounded"
                              value={editableContent.header.contact.phone}
                              onChange={(e) => handleContentChange('header', e.target.value, 'phone')}
                            />
                            <input
                              className="block w-full mb-1 p-1 border rounded"
                              value={editableContent.header.contact.email}
                              onChange={(e) => handleContentChange('header', e.target.value, 'email')}
                            />
                            <input
                              className="block w-full p-1 border rounded"
                              value={editableContent.header.contact.location}
                              onChange={(e) => handleContentChange('header', e.target.value, 'location')}
                            />
                          </>
                        ) : (
                          <>
                            <div>{editableContent.header.contact.phone}</div>
                            <div className="flex items-center gap-2">
                              <Mail size={16} /> {editableContent.header.contact.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {editableContent.header.contact.location}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </header>
                );

              case 'summary':
                return editableContent.summary && (
                  <section key={sectionName} className="mb-8 relative">
                    <h2 className="text-2xl font-bold mb-4">Summary</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    <SectionButtons section="summary" />
                    {editingSections.summary ? (
                      <textarea
                        className="w-full p-2 border rounded"
                        value={editableContent.summary}
                        onChange={(e) => handleContentChange('summary', e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700">{editableContent.summary}</p>
                    )}
                  </section>
                );

              case 'experience':
                return (
                  <section key={sectionName} className="mb-8 relative">
                    <h2 className="text-2xl font-bold mb-6">Experience</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    <SectionButtons section="experience" />
                    {editableContent.experience.map((exp) => (
                      <div key={exp.id} className="mb-6 relative border p-4 rounded">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                          {editingSections.experience ? (
                            <>
                              <input
                                className="text-xl font-semibold border rounded px-2 mb-2 w-full"
                                value={exp.title}
                                onChange={(e) => handleContentChange('experience', e.target.value, 'title', exp.id)}
                              />
                              <input
                                className="text-gray-600 border rounded px-2 w-full md:w-auto"
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
                          onClick={() => handleDelete('experience', exp.id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          title="Delete this experience"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </section>
                );

              case 'achievements':
                return (
                  <section key={sectionName} className="mb-8 relative">
                    <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    <SectionButtons section="achievements" />
                    {editableContent.achievements.map((achievement) => (
                      <div key={achievement.id} className="mb-4 relative border p-4 rounded">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                          {editingSections.achievements ? (
                            <>
                              <input
                                className="text-xl font-semibold border rounded px-2 mb-2 w-full"
                                value={achievement.title}
                                onChange={(e) => handleContentChange('achievements', e.target.value, 'title', achievement.id)}
                              />
                              <input
                                className="text-gray-600 border rounded px-2 w-full md:w-auto"
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
                        <button
                          onClick={() => handleDelete('achievements', achievement.id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          title="Delete this achievement"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </section>
                );

              case 'projects':
                return (
                  <section key={sectionName} className="mb-8 relative">
                    <h2 className="text-2xl font-bold mb-4">Projects</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    <SectionButtons section="projects" />
                    {editableContent.projects.map((project) => (
                      <div key={project.id} className="mb-6 relative border p-4 rounded">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                          {editingSections.projects ? (
                            <>
                              <input
                                className="text-xl font-semibold border rounded px-2 mb-2 w-full"
                                value={project.title}
                                onChange={(e) => handleContentChange('projects', e.target.value, 'title', project.id)}
                              />
                              <input
                                className="text-gray-600 border rounded px-2 w-full md:w-auto"
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
                        <button
                          onClick={() => handleDelete('projects', project.id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          title="Delete this project"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </section>
                );

              case 'education':
                return (
                  <section key={sectionName} className="mb-8 relative">
                    <h2 className="text-2xl font-bold mb-4">Education</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    <SectionButtons section="education" />
                    {editableContent.education.map((edu) => (
                      <div key={edu.id} className="mb-4 relative border p-4 rounded">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div className="flex-1">
                            {editingSections.education ? (
                              <>
                                <input
                                  className="text-xl font-semibold border rounded px-2 mb-2 w-full"
                                  value={edu.school}
                                  onChange={(e) => handleContentChange('education', e.target.value, 'school', edu.id)}
                                />
                                <input
                                  className="text-gray-700 border rounded px-2 w-full"
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
                              className="text-gray-600 border rounded px-2 w-full md:w-auto mt-2 md:mt-0"
                              value={edu.period}
                              onChange={(e) => handleContentChange('education', e.target.value, 'period', edu.id)}
                            />
                          ) : (
                            <span className="text-gray-600">{edu.period}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete('education', edu.id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          title="Delete this education"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </section>
                );

              case 'skills':
                return editableContent.skills && (
                  <section key={sectionName} className="mb-8 relative">
                    <h2 className="text-2xl font-bold mb-4">Skills</h2>
                    <div className="border-b border-gray-300 mb-8"></div>
                    <SectionButtons section="skills" />
                    {editingSections.skills ? (
                      <>
                        {editableContent.skills.clientSide && (
                          <div className="mb-4 flex items-center gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">Client-Side:</h3>
                              <input
                                className="w-full p-2 border rounded"
                                value={editableContent.skills.clientSide}
                                onChange={(e) => handleContentChange('skills', e.target.value, 'clientSide')}
                              />
                            </div>
                            <button
                              onClick={() => handleDelete('skills', null, 'clientSide')}
                              className="text-red-600 hover:text-red-800 mt-6"
                              title="Delete Client-Side Skills"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        {editableContent.skills.serverSide && (
                          <div className="mb-4 flex items-center gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">Server-Side:</h3>
                              <input
                                className="w-full p-2 border rounded"
                                value={editableContent.skills.serverSide}
                                onChange={(e) => handleContentChange('skills', e.target.value, 'serverSide')}
                              />
                            </div>
                            <button
                              onClick={() => handleDelete('skills', null, 'serverSide')}
                              className="text-red-600 hover:text-red-800 mt-6"
                              title="Delete Server-Side Skills"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        {editableContent.skills.devOps && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">Development & Operations:</h3>
                              <input
                                className="w-full p-2 border rounded"
                                value={editableContent.skills.devOps}
                                onChange={(e) => handleContentChange('skills', e.target.value, 'devOps')}
                              />
                            </div>
                            <button
                              onClick={() => handleDelete('skills', null, 'devOps')}
                              className="text-red-600 hover:text-red-800 mt-6"
                              title="Delete DevOps Skills"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {editableContent.skills.clientSide && (
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Client-Side:</h3>
                            <p className="text-gray-700">{editableContent.skills.clientSide}</p>
                          </div>
                        )}
                        {editableContent.skills.serverSide && (
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Server-Side:</h3>
                            <p className="text-gray-700">{editableContent.skills.serverSide}</p>
                          </div>
                        )}
                        {editableContent.skills.devOps && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Development & Operations:</h3>
                            <p className="text-gray-700">{editableContent.skills.devOps}</p>
                          </div>
                        )}
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

      <style jsx>{`
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .max-w-4xl {
            max-width: 100%;
            padding: 1rem;
          }
          header .flex {
            flex-direction: column;
            align-items: flex-start;
          }
          .text-right {
            text-align: left !important;
          }
          .control-buttons {
            right: 1rem;
            top: 0.5rem;
          }
        }
        @media print {
          .control-buttons {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}