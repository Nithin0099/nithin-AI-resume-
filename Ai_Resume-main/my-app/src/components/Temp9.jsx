import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCog, FaPlus, FaTrash, FaCalendarAlt, FaMagic } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
// import api from "../services/api";
import html2pdf from 'html2pdf.js';

export const Temp9 = () => {
  const defaultResume = {
    name: "",
    designation: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    courses: [],
    achievements: [],
    projects: [],
    certifications: []
  };

  // Initialize state with localStorage data or default
  const [resume, setResume] = useState(() => {
    try {
      // First try to get data from localStorage
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          ...defaultResume,
          ...parsed
        };
      }
      
      // If no localStorage data, try to get from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        fetch(`http://localhost:5000/api/resume/load?email=${emailParam}`)
          .then(res => res.json())
          .then(data => {
            if (data) {
              setResume(data);
              localStorage.setItem('resumeData', JSON.stringify(data));
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error('Error initializing resume data:', e);
    }
    
    return defaultResume;
  });

  // Autosave whenever resume changes
  useEffect(() => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resume));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [resume]);

  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [resumeSections, setResumeSections] = useState([
    { id: 'profile', title: 'PROFILE', content: '' },
    { id: 'skills', title: 'SKILLS', content: '' },
    { id: 'experience', title: 'EXPERIENCE', content: '' },
    { id: 'education', title: 'EDUCATION', content: '' },
    { id: 'courses', title: 'COURSES', content: '' },
    { id: 'projects', title: 'PROJECTS', content: '' },
    { id: 'achievements', title: 'ACHIEVEMENTS', content: '' },
    { id: 'certifications', title: 'CERTIFICATIONS', content: '' }
  ]);
  
  // Update sections content when resume changes
  useEffect(() => {
    const sections = resumeSections.map(section => {
      const content = resume[section.id];
      return {
        ...section,
        content: Array.isArray(content) ? content.join(', ') : content || ''
      };
    });
    setResumeSections(sections);
    
    // Save to localStorage whenever resume changes
    localStorage.setItem('resumeData', JSON.stringify(resume));
  }, [resume]);

  const handleAddSection = (sectionId) => {
    // Check if section already exists
    if (resumeSections.some(section => section.id === sectionId)) {
      showNotification("This section already exists!", "warning");
      return;
    }

    const newSection = {
      id: sectionId,
      title: sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
      content: ''
    };
    setResumeSections((prevSections) => [...prevSections, newSection]);
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
  const [dateType, setDateType] = useState(null);
  const [activeDatePicker, setActiveDatePicker] = useState({
    section: null,
    index: null,
    type: null
  });

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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Load data from server and merge with local data
  const loadResumeData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/resume/load?email=email@example.com', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to load resume: ${response.status}`);
      }

      const serverData = await response.json();
      
      if (serverData) {
        // Directly set the server data
        setResume(serverData);
        // Also save to localStorage
        localStorage.setItem('resumeData', JSON.stringify(serverData));
        showNotification("Resume loaded successfully!", "success");
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      showNotification("Failed to load resume from server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Save resume data
  const saveResume = async () => {
    try {
      setIsLoading(true);
      
      // Save to localStorage first
      localStorage.setItem('resumeData', JSON.stringify(resume));
      
      const response = await fetch('http://localhost:5000/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: resume })
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      const data = await response.json();
      
      if (data?.data?._id) {
        setResume(prev => ({
          ...prev,
          _id: data.data._id
        }));
        showNotification("Resume saved successfully!", "success");
      }
    } catch (error) {
      console.error("Save error:", error);
      showNotification("Failed to save resume", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceSection = async (field, index = null) => {
    try {
      if (!resume._id) {
        showNotification("Please save your resume first before using AI enhancement", "warning");
        return;
      }

      setIsLoading(true);
      const endpoint = 'http://localhost:5000/api/resume/enhanceField';
      
      let contentToEnhance;
      if (field === 'experience' && index !== null) {
        const exp = resume.experience[index];
        contentToEnhance = {
          title: exp.title,
          companyName: exp.companyName,
          description: exp.description,
          accomplishment: exp.accomplishment
        };
      } else if (field === 'skills') {
        contentToEnhance = resume.skills;
      } else if (field === 'summary') {
        contentToEnhance = resume.summary;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeId: resume._id,
          field,
          index,
          content: contentToEnhance
        })
      });

      if (!response.ok) {
        throw new Error('Enhancement failed');
      }

      const data = await response.json();
      
      if (field === 'experience' && index !== null) {
        const updatedExperience = [...resume.experience];
        updatedExperience[index] = {
          ...updatedExperience[index],
          title: data.data.title,
          description: data.data.description,
          accomplishment: data.data.accomplishment
        };
        setResume(prev => ({
          ...prev,
          experience: updatedExperience
        }));
      } else if (field === 'skills') {
        setResume(prev => ({
          ...prev,
          skills: data.data
        }));
      } else if (field === 'summary') {
        setResume(prev => ({
          ...prev,
          summary: data.data.summary
        }));
      }

      showNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} enhanced successfully!`, "success");
    } catch (error) {
      console.error("Enhancement error:", error);
      showNotification(`Failed to enhance ${field}. Please try again.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      setIsLoading(true);
      const element = document.getElementById('resume-content');
      if (!element) {
        throw new Error('Resume content not found');
      }

      // Create a clean copy of the resume content
      const printContainer = document.createElement('div');
      printContainer.style.width = '210mm'; // A4 width
      printContainer.style.minHeight = '297mm'; // A4 height
      printContainer.style.padding = '20px';
      printContainer.style.backgroundColor = '#ffffff';
      printContainer.style.color = '#000000';
      printContainer.style.fontFamily = 'Arial, sans-serif';
      printContainer.style.position = 'relative';

      // Add styles for consistent formatting
      const style = document.createElement('style');
      style.textContent = `
        .resume-section {
          margin-bottom: 15px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 8px;
          border-bottom: 1px solid #000000;
          padding-bottom: 4px;
        }
        .profile-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .profile-info div {
          flex: 1;
        }
        .profile-info div:first-child {
          margin-right: 20px;
        }
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-item {
          background-color: #f0f0f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .experience-item, .education-item, .course-item, .project-item, .achievement-item, .certification-item {
          margin-bottom: 12px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .item-title {
          font-weight: bold;
          font-size: 14px;
        }
        .item-subtitle {
          font-size: 12px;
          color: #666;
        }
        .item-dates {
          font-size: 12px;
          color: #666;
        }
        .item-description {
          font-size: 12px;
          margin-top: 4px;
        }
        .item-location {
          font-size: 12px;
          color: #666;
        }
      `;
      printContainer.appendChild(style);

      // Add header
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '20px';
      header.innerHTML = `
        <h1 style="font-size: 24px; margin: 0; color: #000000;">${resume.name}</h1>
        <p style="font-size: 16px; margin: 5px 0; color: #000000;">${resume.designation}</p>
        <div style="display: flex; justify-content: center; gap: 15px; font-size: 12px;">
          <span>${resume.email}</span>
          <span>${resume.phone}</span>
          <span>${resume.location}</span>
          ${resume.linkedin ? `<span>${resume.linkedin}</span>` : ''}
        </div>
      `;
      printContainer.appendChild(header);

      // Add profile section
      if (resume.summary) {
        const profileSection = document.createElement('div');
        profileSection.className = 'resume-section';
        profileSection.innerHTML = `
          <div class="section-title">PROFILE</div>
          <div class="profile-info">
            <div>${resume.summary}</div>
          </div>
        `;
        printContainer.appendChild(profileSection);
      }

      // Add skills section
      if (resume.skills && resume.skills.length > 0) {
        const skillsSection = document.createElement('div');
        skillsSection.className = 'resume-section';
        skillsSection.innerHTML = `
          <div class="section-title">SKILLS</div>
          <div class="skills-list">
            ${resume.skills.map(skill => `
              <div class="skill-item">${skill}</div>
            `).join('')}
          </div>
        `;
        printContainer.appendChild(skillsSection);
      }

      // Add experience section
      if (resume.experience && resume.experience.length > 0) {
        const experienceSection = document.createElement('div');
        experienceSection.className = 'resume-section';
        experienceSection.innerHTML = `
          <div class="section-title">EXPERIENCE</div>
          ${resume.experience.map(exp => `
            <div class="experience-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.title}</div>
                  <div class="item-subtitle">${exp.company}</div>
                </div>
                <div class="item-dates">${exp.dates?.from} - ${exp.dates?.to}</div>
              </div>
              <div class="item-location">${exp.location}</div>
              <div class="item-description">${exp.description}</div>
            </div>
          `).join('')}
        `;
        printContainer.appendChild(experienceSection);
      }

      // Add education section
      if (resume.education && resume.education.length > 0) {
        const educationSection = document.createElement('div');
        educationSection.className = 'resume-section';
        educationSection.innerHTML = `
          <div class="section-title">EDUCATION</div>
          ${resume.education.map(edu => `
            <div class="education-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.school}</div>
                </div>
                <div class="item-dates">${edu.dates?.from} - ${edu.dates?.to}</div>
              </div>
              <div class="item-location">${edu.location}</div>
              <div class="item-description">${edu.description}</div>
            </div>
          `).join('')}
        `;
        printContainer.appendChild(educationSection);
      }

      // Add courses section
      if (resume.courses && resume.courses.length > 0) {
        const coursesSection = document.createElement('div');
        coursesSection.className = 'resume-section';
        coursesSection.innerHTML = `
          <div class="section-title">COURSES</div>
          ${resume.courses.map(course => `
            <div class="course-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${course.title}</div>
                  <div class="item-subtitle">${course.issuedby}</div>
                </div>
                <div class="item-dates">${course.dates?.from} - ${course.dates?.to}</div>
              </div>
              <div class="item-description">${course.description}</div>
            </div>
          `).join('')}
        `;
        printContainer.appendChild(coursesSection);
      }

      // Add projects section
      if (resume.projects && resume.projects.length > 0) {
        const projectsSection = document.createElement('div');
        projectsSection.className = 'resume-section';
        projectsSection.innerHTML = `
          <div class="section-title">PROJECTS</div>
          ${resume.projects.map(project => `
            <div class="project-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${project.title}</div>
                  <div class="item-subtitle">${project.role}</div>
                </div>
                <div class="item-dates">${project.dates?.from} - ${project.dates?.to}</div>
              </div>
              <div class="item-description">${project.description}</div>
            </div>
          `).join('')}
        `;
        printContainer.appendChild(projectsSection);
      }

      // Add achievements section
      if (resume.achievements && resume.achievements.length > 0) {
        const achievementsSection = document.createElement('div');
        achievementsSection.className = 'resume-section';
        achievementsSection.innerHTML = `
          <div class="section-title">ACHIEVEMENTS</div>
          ${resume.achievements.map(achievement => `
            <div class="achievement-item">
              <div class="item-header">
                <div class="item-title">${achievement.title}</div>
                <div class="item-dates">${achievement.date}</div>
              </div>
              <div class="item-description">${achievement.description}</div>
            </div>
          `).join('')}
        `;
        printContainer.appendChild(achievementsSection);
      }

      // Add certifications section
      if (resume.certifications && resume.certifications.length > 0) {
        const certificationsSection = document.createElement('div');
        certificationsSection.className = 'resume-section';
        certificationsSection.innerHTML = `
          <div class="section-title">CERTIFICATIONS</div>
          ${resume.certifications.map(cert => `
            <div class="certification-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${cert.certificates}</div>
                  <div class="item-subtitle">${cert.issuer}</div>
                </div>
                <div class="item-dates">${cert.dates?.from} - ${cert.dates?.to ? cert.dates.to : 'Present'}</div>
              </div>
              <div class="item-description">${cert.description}</div>
            </div>
          `).join('')}
        `;
        printContainer.appendChild(certificationsSection);
      }

      // Configure PDF options
      const options = {
        margin: [10, 10, 10, 10],
        filename: `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all'] }
      };

      // Generate PDF
      await html2pdf().set(options).from(printContainer).save();
      setIsLoading(false);
      showNotification("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
      showNotification("Failed to generate PDF. Please try again.", "error");
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

  const handleDatePickerClick = (e, section, index, type) => {
    e.stopPropagation();
    if (activeDatePicker.section === section && 
        activeDatePicker.index === index && 
        activeDatePicker.type === type) {
      // If clicking the same date picker, close it
      setActiveDatePicker({ section: null, index: null, type: null });
    } else {
      // If clicking a different date picker, open it and close others
      setActiveDatePicker({ section, index, type });
    }
  };

  // Add click outside handler to close date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.date-picker-container')) {
        setActiveDatePicker({ section: null, index: null, type: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Replace all date picker buttons with this new structure
  const DatePickerButton = ({ section, index, type, date, onDateChange }) => (
    <div className="flex items-center gap-2 relative date-picker-container">
      <span className="text-sm text-gray-500">{type === 'from' ? 'From:' : 'To:'}</span>
      <button
        className="px-2 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
        onClick={(e) => handleDatePickerClick(e, section, index, type)}
      >
        <FaCalendarAlt className="text-gray-400" />
        {date || `${type === 'from' ? 'Start' : 'End'} Date`}
      </button>
      {activeDatePicker.section === section && 
       activeDatePicker.index === index && 
       activeDatePicker.type === type && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white shadow-lg rounded-lg p-4">
          <DatePicker
            selected={date ? new Date(date) : new Date()}
            onChange={(date) => {
              onDateChange(date);
              setActiveDatePicker({ section: null, index: null, type: null });
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            inline
          />
        </div>
      )}
    </div>
  );

  // Update the experience section date pickers
  const handleDateChange = (date, index, type, section) => {
    const formattedDate = date.toLocaleDateString("en-US", { 
      month: "2-digit",
      year: "numeric"
    }).replace(",", "");

    let updatedResume = { ...resume };
    
    switch(section) {
      case 'experience':
        if (!updatedResume.experience[index].dates) {
          updatedResume.experience[index].dates = {};
        }
        updatedResume.experience[index].dates[type] = type === 'to' && presentChecked ? 'Present' : formattedDate;
        break;
      case 'education':
        if (!updatedResume.education[index].dates) {
          updatedResume.education[index].dates = {};
        }
        updatedResume.education[index].dates[type] = formattedDate;
        break;
      case 'courses':
        if (!updatedResume.courses[index].dates) {
          updatedResume.courses[index].dates = {};
        }
        updatedResume.courses[index].dates[type] = formattedDate;
        break;
      case 'certifications':
        if (!updatedResume.certifications[index].dates) {
          updatedResume.certifications[index].dates = {};
        }
        updatedResume.certifications[index].dates[type] = formattedDate;
        break;
    }
    
    setResume(updatedResume);
    setShowDatePicker(null);
    
    // Save after date change
    saveResume();
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

  const handleNameChange = (e) => {
    setResume(prev => ({ ...prev, name: e.target.textContent }));
  };

  const handleDesignationChange = (e) => {
    setResume(prev => ({ ...prev, designation: e.target.textContent }));
  };

  const handleContactChange = (e) => {
    setResume(prev => ({ ...prev, contact: e.target.textContent }));
  };

  const handleSummaryChange = (index, e) => {
    const newSummary = [...(resume.summary || [])];
    newSummary[index] = e.target.textContent;
    setResume(prev => ({ ...prev, summary: newSummary }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setResume(prev => ({ ...prev, experience: updatedExperience }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...resume.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setResume(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleCoursesChange = (index, field, value) => {
    const updatedCourses = [...resume.courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value
    };
    setResume(prev => ({ ...prev, courses: updatedCourses }));
  };

  const handleAchievementChange = (index, field, value) => {
    const updatedAchievements = [...resume.achievements];
    if (field === 'achievements') {
      // Handle array of achievements
      const achievementIndex = parseInt(value.index);
      const achievementText = value.text;
      updatedAchievements[index].achievements[achievementIndex] = achievementText;
    } else {
      // Handle title or other fields
      updatedAchievements[index] = {
        ...updatedAchievements[index],
        [field]: value
      };
    }
    setResume(prev => ({ ...prev, achievements: updatedAchievements }));
  };

  const handleContactFieldChange = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  const addProject = () => {
    setResume({
      ...resume,
      projects: [
        ...resume.projects,
        { 
          title: "New Project",
          description: "Project description",
          duration: "MM/YYYY - MM/YYYY"
        }
      ]
    });
  };

  const removeProject = (index) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index)
    });
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    const updatedResume = { ...resume, projects: updatedProjects };
    setResume(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));
  };

  const addCertification = () => {
    setResume({
      ...resume,
      certifications: [
        ...(resume.certifications || []),
        { certificates: "New Certification", link: "" }
      ]
    });
  };

  const removeCertification = (index) => {
    setResume({
      ...resume,
      certifications: resume.certifications.filter((_, i) => i !== index)
    });
  };

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...(resume.certifications || [])];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    const updatedResume = { ...resume, certifications: updatedCertifications };
    setResume(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));
  };

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

    // Load resume data when component mounts
    loadResumeData();

    // Add click outside listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="resume-main-container flex justify-center py-10" onClick={() => {
      setActiveSection(null);
      setShowSettings(false);
    }}>
      <Sidebar 
        onAddSection={handleAddSection} 
        onSelectSection={handleSelectSection}
        downloadPdf={downloadPdf}
        saveResume={saveResume}
        sections={resumeSections}
      />
  
      {/* Main Content Area */}
      <div className="resume-wrapper flex bg-white shadow-lg rounded-lg w-[1000px] ml-[250px] p-8 relative" id="resume-content">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="resume-content-container flex-1">
          {/* Name Section */}
          <div className="name-section text-left pb-6" onClick={(e) => {
            e.stopPropagation();
            setActiveSection("name");
          }}>
            {visibleFields.name && (
              <h1 
                className="resume-name-input font-bold text-3xl mb-2" 
                contentEditable 
                suppressContentEditableWarning={true}
                onBlur={handleNameChange}
              >
                {resume?.name || "Your Name"}
              </h1>
            )}
            {visibleFields.designation && (
              <div 
                className="resume-designation-input text-lg text-blue-700 mb-2" 
                contentEditable 
                suppressContentEditableWarning={true}
                onBlur={handleDesignationChange}
              >
                {resume?.designation || "Your Designation"}
              </div>
            )}
            <div className="contact-info grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="contact-entry flex items-center gap-2">
                <span>LinkedIn:</span>
                <div
                  className="flex-1"
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContactFieldChange('linkedin', e.target.textContent)}
                >
                  {resume?.linkedin || "Your LinkedIn URL"}
                </div>
              </div>
              <div className="contact-entry flex items-center gap-2">
                <span>Email:</span>
                <div
                  className="flex-1"
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContactFieldChange('email', e.target.textContent)}
                >
                  {resume?.email || "your.email@example.com"}
                </div>
              </div>
              <div className="contact-entry flex items-center gap-2">
                <span>Phone:</span>
                <div
                  className="flex-1"
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContactFieldChange('phone', e.target.textContent)}
                >
                  {resume?.phone || "Your phone number"}
                </div>
              </div>
              <div className="contact-entry flex items-center gap-2">
                <span>Location:</span>
                <div
                  className="flex-1"
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContactFieldChange('location', e.target.textContent)}
                >
                  {resume?.location || "Your location"}
                </div>
              </div>
            </div>
          </div>

          {/* Main Sections */}
          <div className="resume-sections-container space-y-6">
            {resumeSections.map((section) => (
              <div key={section.id} className="resume-section">
                <h2 className="text-xl font-bold uppercase border-b pb-2 mb-4">{section.title}</h2>
                {section.id === 'profile' && (
                  <div className="text-gray-700 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div
                        className="profile-summary flex-1"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          const newSummary = e.target.textContent;
                          setResume(prev => ({ ...prev, summary: newSummary }));
                        }}
                      >
                        {typeof resume?.summary === 'string' ? resume.summary : "Add your profile summary"}
                      </div>
                      <button
                        className="ml-2 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('summary');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                  </div>
                )}
                {section.id === 'skills' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResume(prev => ({
                            ...prev,
                            skills: [...(prev.skills || []), "New Skill"]
                          }));
                        }}
                      >
                        <FaPlus /> Add Skill
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('skills');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(resume?.skills || []).map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="skill-item flex-1 p-2 border rounded hover:bg-gray-50"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                              const updatedSkills = [...(resume.skills || [])];
                              updatedSkills[i] = e.target.textContent;
                              setResume(prev => ({ ...prev, skills: updatedSkills }));
                            }}
                          >
                            {skill}
                          </div>
                          <button
                            className="p-1 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedSkills = [...(resume.skills || [])];
                              updatedSkills.splice(i, 1);
                              setResume(prev => ({ ...prev, skills: updatedSkills }));
                            }}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {section.id === 'experience' && (
                  <div className="experience-entries">
                    <button
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        addExperience();
                      }}
                    >
                      <FaPlus /> Add Experience
                    </button>
                    {(resume?.experience || []).map((exp, index) => (
                      <div key={index} className="experience-entry p-4 mb-4 bg-white shadow-md rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div 
                              className="text-lg font-semibold"
                              contentEditable
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handleExperienceChange(index, 'title', e.target.textContent)}
                            >
                              {exp.title || "Job Title"}
                            </div>
                            <div 
                              className="text-gray-600"
                              contentEditable
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handleExperienceChange(index, 'company', e.target.textContent)}
                            >
                              {exp.company || exp.companyName || "Company Name"}
                            </div>
                            <div className="flex items-center gap-4 my-2">
                              <DatePickerButton
                                section="experience"
                                index={index}
                                type="from"
                                date={exp.dates?.from}
                                onDateChange={(date) => handleDateChange(date, index, 'from', 'experience')}
                              />
                              <DatePickerButton
                                section="experience"
                                index={index}
                                type="to"
                                date={exp.dates?.to}
                                onDateChange={(date) => handleDateChange(date, index, 'to', 'experience')}
                              />
                            </div>
                            <div 
                              className="text-gray-700 mt-2"
                              contentEditable
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handleExperienceChange(index, 'description', e.target.textContent)}
                            >
                              {exp.description || "Job description and responsibilities"}
                            </div>
                            <div 
                              className="text-gray-700 mt-2"
                              contentEditable
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handleExperienceChange(index, 'accomplishment', e.target.textContent)}
                            >
                              {exp.accomplishment || "Key accomplishments"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                enhanceSection('experience', index);
                              }}
                              title="Enhance this experience with AI"
                            >
                              <FaMagic />
                            </button>
                            <button
                              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExperience(index);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.id === 'education' && (
                  <div className="education-entries">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addEducation();
                        }}
                      >
                        <FaPlus /> Add Education
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('education');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                    {(resume?.education || []).map((edu, index) => (
                      <div key={index} className="education-entry p-4 mb-4 bg-white shadow-md rounded-lg">
                        <div 
                          className="text-lg font-semibold"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleEducationChange(index, 'degree', e.target.textContent)}
                        >
                          {edu.degree || "Degree Name"}
                        </div>
                        <div 
                          className="text-gray-600"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleEducationChange(index, 'school', e.target.textContent)}
                        >
                          {edu.school || "Institution Name"}
                        </div>
                        <div className="flex items-center gap-4 my-2">
                          <DatePickerButton
                            section="education"
                            index={index}
                            type="from"
                            date={edu.dates?.from}
                            onDateChange={(date) => handleDateChange(date, index, 'from', 'education')}
                          />
                          <DatePickerButton
                            section="education"
                            index={index}
                            type="to"
                            date={edu.dates?.to}
                            onDateChange={(date) => handleDateChange(date, index, 'to', 'education')}
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeEducation(index);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.id === 'courses' && (
                  <div className="courses-entries">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCourses();
                        }}
                      >
                        <FaPlus /> Add Course
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('courses');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                    {(resume?.courses || []).map((course, index) => (
                      <div key={index} className="course-entry p-4 mb-4 bg-white shadow-md rounded-lg">
                        <div 
                          className="text-lg font-semibold"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleCoursesChange(index, 'title', e.target.textContent)}
                        >
                          {course.title || "Course Title"}
                        </div>
                        <div 
                          className="text-gray-600"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleCoursesChange(index, 'issuedby', e.target.textContent)}
                        >
                          {course.issuedby || "Institution Name"}
                        </div>
                        <div className="flex items-center gap-4 my-2">
                          <DatePickerButton
                            section="courses"
                            index={index}
                            type="from"
                            date={course.dates?.from}
                            onDateChange={(date) => handleDateChange(date, index, 'from', 'courses')}
                          />
                          <DatePickerButton
                            section="courses"
                            index={index}
                            type="to"
                            date={course.dates?.to}
                            onDateChange={(date) => handleDateChange(date, index, 'to', 'courses')}
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCourses(index);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.id === 'projects' && (
                  <div className="projects-entries">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addProject();
                        }}
                      >
                        <FaPlus /> Add Project
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('projects');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                    {(resume?.projects || []).map((project, index) => (
                      <div key={index} className="project-entry p-4 mb-4 bg-white shadow-md rounded-lg">
                        <div 
                          className="text-lg font-semibold"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleProjectChange(index, 'title', e.target.textContent)}
                        >
                          {project.title || "Project Title"}
                        </div>
                        <div 
                          className="text-gray-600 mt-2"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleProjectChange(index, 'duration', e.target.textContent)}
                        >
                          {project.duration || "Project Duration"}
                        </div>
                        <div 
                          className="text-gray-700 mt-2"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleProjectChange(index, 'description', e.target.textContent)}
                        >
                          {project.description || "Project description and key achievements"}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProject(index);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.id === 'achievements' && (
                  <div className="achievements-entries">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addAchievement();
                        }}
                      >
                        <FaPlus /> Add Achievement
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('achievements');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                    {(resume?.achievements || []).map((achievement, index) => (
                      <div key={index} className="achievement-entry p-4 mb-4 bg-white shadow-md rounded-lg">
                        <div 
                          className="text-lg font-semibold"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleAchievementChange(index, 'title', e.target.textContent)}
                        >
                          {achievement.title || "Achievement Title"}
                        </div>
                        <ul className="list-disc list-inside mt-2">
                          {(achievement.achievements || []).map((item, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                              <li 
                                className="flex-1"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) => handleAchievementChange(index, 'achievements', { index: i, text: e.target.textContent })}
                              >
                                {item || "Achievement description"}
                              </li>
                              <button
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedAchievements = [...resume.achievements];
                                  updatedAchievements[index].achievements.splice(i, 1);
                                  setResume(prev => ({ ...prev, achievements: updatedAchievements }));
                                }}
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))}
                        </ul>
                        <div className="mt-4 flex gap-2">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedAchievements = [...resume.achievements];
                              if (!updatedAchievements[index].achievements) {
                                updatedAchievements[index].achievements = [];
                              }
                              updatedAchievements[index].achievements.push("New achievement item");
                              setResume(prev => ({ ...prev, achievements: updatedAchievements }));
                            }}
                          >
                            <FaPlus size={14} /> Add Item
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAchievement(index);
                            }}
                          >
                            <FaTrash size={14} /> Remove Achievement
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.id === 'certifications' && (
                  <div className="certifications-entries">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCertification();
                        }}
                      >
                        <FaPlus /> Add Certification
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          enhanceSection('certifications');
                        }}
                      >
                        <FaMagic /> Enhance with AI
                      </button>
                    </div>
                    {(resume?.certifications || []).map((cert, index) => (
                      <div key={index} className="certification-entry p-4 mb-4 bg-white shadow-md rounded-lg">
                        <div 
                          className="text-lg font-semibold"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleCertificationChange(index, 'certificates', e.target.textContent)}
                        >
                          {cert.certificates || "Certification Name"}
                        </div>
                        <div 
                          className="text-gray-600"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleCertificationChange(index, 'link', e.target.textContent)}
                        >
                          {cert.link || "Certification Link"}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCertification(index);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp9;