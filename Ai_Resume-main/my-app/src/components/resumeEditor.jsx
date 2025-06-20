import React, { useState, useRef } from 'react';
import axios from 'axios';

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState({
    name: 'Aditya Tiwary',
    role: 'Experienced Business Analyst | Supply Chain Optimization | Data Analytics',
    phone: '+44 20 7123 4567',
    email: 'aditya@40gmail.com',
    linkedin: 'linkedin.com',
    location: 'Birmingham',
    summary:
      'With over 9 years of experience in business analysis, supply chain management, and logistics, I have a proven record of reducing costs while enhancing efficiency and customer satisfaction. My expertise includes running advanced business models, financial reporting, and streamlining processes to refine supply chain operations. I am eager to contribute to your commitment to sustainability and the journey to net zero.',
    experience: [
      {
        title: 'Supply Chain Analyst',
        companyName: 'Unilever',
        date: '01/2019 - 12/2022',
        companyLocation: 'London, UK',
        description:
          'Led a cross-functional team to streamline logistics processes, reducing overall supply chain costs by 15% within 12 months.',
        accomplishment: 'Optimized inventory levels and supplier performance.',
      },
    ],
    education: [
      {
        degree: 'MSc Supply Chain and Logistics Management',
        institution: 'University of Warwick',
        duration: '01/2011 - 01/2012',
        grade: 'First Class',
      },
    ],
    achievements: [
      {
        keyAchievements: 'Team Lead for Sustainability Project',
        describe:
          'Spearheaded an initiative to reduce carbon footprint by 15%.',
      },
      {
        keyAchievements: 'Award for Logistics Excellence',
        describe: 'Recognized for outstanding logistics coordination.',
      },
    ],
    courses: [
      {
        title: 'Advanced Excel for Productivity',
        description: 'Certification by Corporate Finance Institute.',
      },
    ],
    skills: [
      'Supply Chain Management',
      'Logistics Planning',
      'Microsoft Office',
    ],
    projects: [
      {
        title: 'Supply Chain Optimization Project',
        description:
          'Developed a model to optimize supply chain operations, reducing costs by 15%.',
        duration: '01/2021 - 12/2021',
      },
      {
        title: 'Sustainability Initiative',
        description:
          'Led a project to reduce carbon footprint by 20% across the supply chain.',
        duration: '06/2020 - 12/2020',
      },
    ],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionSettings, setSectionSettings] = useState({
    header: {
      showTitle: true,
      showPhone: true,
      showEmail: true,
      showLink: true,
      showLocation: true,
      uppercaseName: false,
    },
    summary: { showSummary: true },
    experience: { showExperience: true },
    education: { showEducation: true },
    achievements: { showAchievements: true },
    skills: { showSkills: true },
    courses: { showCourses: true },
    projects: { showProjects: true },
  });
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [sectionsOrder, setSectionsOrder] = useState([
    'summary',
    'experience',
    'education',
    'achievements',
    'skills',
    'courses',
    'projects',
  ]);

  const resumeRef = useRef(null);

  const handleRemoveSection = (section, index) => {
    if (index !== undefined) {
      setResumeData((prevData) => {
        const updatedSection = [...prevData[section]];
        updatedSection.splice(index, 1);
        return { ...prevData, [section]: updatedSection };
      });
    } else {
      setSectionSettings((prevSettings) => ({
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          [`show${section.charAt(0).toUpperCase() + section.slice(1)}`]: false,
        },
      }));
    }
  };

  const handleAIEnhancement = async () => {
    if (!resumeData._id) {
      await createResume();
      alert('Resume created. Click AI Assistant again.');
      return;
    }
    setLoading(true);
    setShowEnhancementOptions(true);
    setLoading(false);
  };

  const handleInputChange = (section, field, value, index) => {
    setResumeData((prevData) => {
      if (section && index !== undefined) {
        const updatedSection = [...prevData[section]];
        updatedSection[index][field] = value;
        return { ...prevData, [section]: updatedSection };
      } else if (section) {
        return { ...prevData, [section]: value };
      } else {
        return { ...prevData, [field]: value };
      }
    });
  };

  const handleAddSection = (section, itemToDuplicate) => {
    let newItem = itemToDuplicate
      ? JSON.parse(JSON.stringify(itemToDuplicate))
      : {
          experience: {
            title: 'New Title',
            companyName: 'New Company',
            date: 'MM/YYYY - MM/YYYY',
            companyLocation: 'City, Country',
            description: 'Describe your responsibilities and achievements.',
            accomplishment: 'Highlight a key accomplishment.',
          },
          education: {
            degree: 'Degree Name',
            institution: 'Institution Name',
            duration: 'YYYY - YYYY',
            grade: 'Grade',
          },
          achievements: {
            keyAchievements: 'Achievement Title',
            describe: 'Describe the achievement.',
          },
          courses: {
            title: 'Course Title',
            description: 'Course description.',
          },
          skills: 'New Skill',
          projects: {
            title: 'Project Title',
            description: 'Project description.',
            duration: 'YYYY - YYYY',
          },
        }[section] || {};

    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/resume/generate-pdf',
        { resumeData },
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!(response.data instanceof Blob))
        throw new Error('Invalid PDF response');
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert('PDF generation failed.');
      setLoading(false);
    }
  };

  const handleSectionHover = (section) => setHoveredSection(section);
  const handleSectionLeave = () => setHoveredSection(null);
  const handleSectionClick = (section) =>
    setActiveSection(section === activeSection ? null : section);
  const handleSettingChange = (section, key) => {
    setSectionSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  };

  const createResume = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/resume/create',
        { resumeData }
      );
      if (response.data?.data?._id) {
        setResumeData((prev) => ({ ...prev, _id: response.data.data._id }));
        alert('✅ Resume created successfully!');
      }
    } catch (error) {
      console.error(
        '❌ Resume Creation Error:',
        error.response?.data || error.message
      );
    }
  };

  const saveResume = async () => {
    if (!resumeData) return alert('No resume data to save!');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/resume/save',
        { resumeData }
      );
      if (response.data) alert('Resume saved successfully!');
    } catch (error) {
      console.error('❌ Error saving resume:', error);
      alert('Failed to save resume.');
    }
  };

  const enhanceSingleField = async (field) => {
    if (!resumeData._id)
      return alert('Please save your resume before enhancing.');
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/resume/enhanceField',
        {
          resumeId: resumeData._id,
          field,
        }
      );
      if (response.data?.data) {
        setResumeData(response.data.data);
        alert(`${field} enhanced successfully!`);
      }
    } catch (error) {
      console.error(`Error enhancing ${field}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-400">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-yellow-300 via-pink-400 to-purple-600 text-white p-6 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-2xl rounded-r-lg`}
      >
        <button
          className="md:hidden absolute top-4 right-4 text-white text-xl"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-center text-white drop-shadow-md">
          Resume Magic
        </h2>
        <button
          className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white p-3 mb-4 rounded-lg hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={handleAIEnhancement}
          aria-label="AI Assistant"
        >
          🤖 AI Assistant
        </button>
        {showEnhancementOptions && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white drop-shadow-sm">
              Enhance Specific Field
            </h4>
            {[
              'summary',
              'skills',
              'experience',
              'achievements',
              'courses',
              'projects',
            ].map((field) => (
              <button
                key={field}
                className="w-full bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-800 transition-all duration-300 shadow-md"
                onClick={() => enhanceSingleField(field)}
                aria-label={`Enhance ${field}`}
              >
                Enhance {field.charAt(0).toUpperCase() + field.slice(1)}
              </button>
            ))}
          </div>
        )}
        <button
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 mb-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={saveResume}
          aria-label="Save Resume"
        >
          Save Resume
        </button>
        <button
          className="w-full bg-gradient-to-r from-yellow-500 to-pink-400 text-white p-3 rounded-lg hover:from-yellow-600 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={downloadPDF}
          aria-label="Download Resume"
        >
          ⬇️ Download
        </button>
      </div>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-gradient-to-r from-yellow-400 to-pink-500 p-2 rounded-full shadow-md"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      <div className="flex-1 p-4 md:ml-72 mt-16 md:mt-0">
        <div
          ref={resumeRef}
          className="max-w-full mx-auto my-5 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-xl sm:w-full md:w-4/5 lg:w-3/5"
        >
          <div className="text-center mb-6 py-4">
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleInputChange(null, 'name', e.target.innerText)
              }
              className={`font-bold break-words ${
                sectionSettings.header.uppercaseName ? 'uppercase' : ''
              } text-2xl sm:text-3xl md:text-4xl`}
              onClick={() => handleSectionClick('header')}
              onMouseEnter={() => handleSectionHover('header')}
              onMouseLeave={handleSectionLeave}
            >
              {resumeData.name}
            </h1>
            {sectionSettings.header.showTitle && (
              <p
                contentEditable
                onBlur={(e) =>
                  handleInputChange(null, 'role', e.target.textContent)
                }
                className="text-sm sm:text-base md:text-lg text-gray-600 mt-2"
              >
                {resumeData.role}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm md:text-base text-gray-700">
              {sectionSettings.header.showPhone && (
                <span
                  contentEditable
                  onBlur={(e) =>
                    handleInputChange(null, 'phone', e.target.textContent)
                  }
                >
                  {resumeData.phone}
                </span>
              )}
              {sectionSettings.header.showEmail && (
                <span
                  contentEditable
                  onBlur={(e) =>
                    handleInputChange(null, 'email', e.target.textContent)
                  }
                >
                  {resumeData.email}
                </span>
              )}
              {sectionSettings.header.showLink && (
                <span
                  contentEditable
                  onBlur={(e) =>
                    handleInputChange(null, 'linkedin', e.target.textContent)
                  }
                >
                  {resumeData.linkedin}
                </span>
              )}
              {sectionSettings.header.showLocation && (
                <span
                  contentEditable
                  onBlur={(e) =>
                    handleInputChange(null, 'location', e.target.textContent)
                  }
                >
                  {resumeData.location}
                </span>
              )}
            </div>
          </div>

          {sectionsOrder.map((section) => (
            <div key={section} className="relative mb-6">
              {section === 'summary' && sectionSettings.summary.showSummary && (
                <div>
                  <h2
                    onClick={() => handleSectionClick('summary')}
                    onMouseEnter={() => handleSectionHover('summary')}
                    onMouseLeave={handleSectionLeave}
                    className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Summary
                  </h2>
                  <p
                    contentEditable
                    onBlur={(e) =>
                      handleInputChange(null, 'summary', e.target.textContent)
                    }
                    className="text-xs sm:text-sm md:text-base text-gray-700"
                  >
                    {resumeData.summary}
                  </p>
                  {showButtons && (
                    <button
                      onClick={() => handleRemoveSection('summary')}
                      className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      X
                    </button>
                  )}
                </div>
              )}

              {section === 'experience' &&
                sectionSettings.experience.showExperience && (
                  <div>
                    <h2
                      onClick={() => handleSectionClick('experience')}
                      onMouseEnter={() => handleSectionHover('experience')}
                      onMouseLeave={handleSectionLeave}
                      className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                    >
                      Experience
                    </h2>
                    {(resumeData.experience || []).map((exp, idx) => (
                      <div key={idx} className="mb-4">
                        <h3
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'experience',
                              'companyName',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-base sm:text-lg font-semibold"
                        >
                          {exp.companyName}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'experience',
                              'title',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {exp.title}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'experience',
                              'date',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {exp.date}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'experience',
                              'companyLocation',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {exp.companyLocation}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'experience',
                              'description',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-700"
                        >
                          {exp.description}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'experience',
                              'accomplishment',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-700"
                        >
                          {exp.accomplishment}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection('experience', idx)
                            }
                            className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            Remove Experience
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection('experience')}
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        Add Experience
                      </button>
                    )}
                    {showButtons && (
                      <button
                        onClick={() => handleRemoveSection('experience')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        X
                      </button>
                    )}
                  </div>
                )}

              {section === 'education' &&
                sectionSettings.education.showEducation && (
                  <div>
                    <h2
                      onClick={() => handleSectionClick('education')}
                      onMouseEnter={() => handleSectionHover('education')}
                      onMouseLeave={handleSectionLeave}
                      className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                    >
                      Education
                    </h2>
                    {(resumeData.education || []).map((edu, idx) => (
                      <div key={idx} className="mb-4">
                        <h3
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'education',
                              'institution',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-base sm:text-lg font-semibold"
                        >
                          {edu.institution}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'education',
                              'degree',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {edu.degree}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'education',
                              'duration',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {edu.duration}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'education',
                              'grade',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {edu.grade}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection('education', idx)
                            }
                            className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            Remove Education
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection('education')}
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        Add Education
                      </button>
                    )}
                    {showButtons && (
                      <button
                        onClick={() => handleRemoveSection('education')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        X
                      </button>
                    )}
                  </div>
                )}

              {section === 'achievements' &&
                sectionSettings.achievements.showAchievements && (
                  <div>
                    <h2
                      onClick={() => handleSectionClick('achievements')}
                      onMouseEnter={() => handleSectionHover('achievements')}
                      onMouseLeave={handleSectionLeave}
                      className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                    >
                      Key Achievements
                    </h2>
                    {(resumeData.achievements || []).map((achievement, idx) => (
                      <div key={idx} className="mb-4">
                        <h3
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'achievements',
                              'keyAchievements',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-base sm:text-lg font-semibold"
                        >
                          {achievement.keyAchievements}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'achievements',
                              'describe',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-700"
                        >
                          {achievement.describe}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() =>
                              handleRemoveSection('achievements', idx)
                            }
                            className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            Remove Achievement
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection('achievements')}
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        Add Achievement
                      </button>
                    )}
                    {showButtons && (
                      <button
                        onClick={() => handleRemoveSection('achievements')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        X
                      </button>
                    )}
                  </div>
                )}

              {section === 'skills' && sectionSettings.skills.showSkills && (
                <div>
                  <h2
                    onClick={() => handleSectionClick('skills')}
                    onMouseEnter={() => handleSectionHover('skills')}
                    onMouseLeave={handleSectionLeave}
                    className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Skills
                  </h2>
                  <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(resumeData.skills || []).map((skill, idx) => (
                      <li key={`${skill}-${idx}`} className="flex items-center">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const updatedSkills = [...resumeData.skills];
                            updatedSkills[idx] = e.target.textContent;
                            setResumeData({
                              ...resumeData,
                              skills: updatedSkills,
                            });
                          }}
                          className="text-xs sm:text-sm text-gray-700 flex-1"
                        >
                          {skill}
                        </span>
                        {showButtons && (
                          <button
                            onClick={() => handleRemoveSection('skills', idx)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors duration-300 ml-2"
                          >
                            X
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {showButtons && (
                    <button
                      onClick={() => handleAddSection('skills')}
                      className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300 mt-2"
                    >
                      Add Skill
                    </button>
                  )}
                  {showButtons && (
                    <button
                      onClick={() => handleRemoveSection('skills')}
                      className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      X
                    </button>
                  )}
                </div>
              )}

              {section === 'courses' && sectionSettings.courses.showCourses && (
                <div>
                  <h2
                    onClick={() => handleSectionClick('courses')}
                    onMouseEnter={() => handleSectionHover('courses')}
                    onMouseLeave={handleSectionLeave}
                    className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Courses
                  </h2>
                  {(resumeData.courses || []).map((course, idx) => (
                    <div key={idx} className="mb-4">
                      <h3
                        contentEditable
                        onBlur={(e) =>
                          handleInputChange(
                            'courses',
                            'title',
                            e.target.textContent,
                            idx
                          )
                        }
                        className="text-base sm:text-lg font-semibold"
                      >
                        {course.title}
                      </h3>
                      <p
                        contentEditable
                        onBlur={(e) =>
                          handleInputChange(
                            'courses',
                            'description',
                            e.target.textContent,
                            idx
                          )
                        }
                        className="text-xs sm:text-sm text-gray-700"
                      >
                        {course.description}
                      </p>
                      {showButtons && (
                        <button
                          onClick={() => handleRemoveSection('courses', idx)}
                          className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          Remove Course
                        </button>
                      )}
                    </div>
                  ))}
                  {showButtons && (
                    <button
                      onClick={() => handleAddSection('courses')}
                      className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      Add Course
                    </button>
                  )}
                  {showButtons && (
                    <button
                      onClick={() => handleRemoveSection('courses')}
                      className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      X
                    </button>
                  )}
                </div>
              )}

              {section === 'projects' &&
                sectionSettings.projects.showProjects && (
                  <div>
                    <h2
                      onClick={() => handleSectionClick('projects')}
                      onMouseEnter={() => handleSectionHover('projects')}
                      onMouseLeave={handleSectionLeave}
                      className="text-lg sm:text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                    >
                      Projects
                    </h2>
                    {(resumeData.projects || []).map((project, idx) => (
                      <div key={idx} className="mb-4">
                        <h3
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'projects',
                              'title',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-base sm:text-lg font-semibold"
                        >
                          {project.title}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'projects',
                              'description',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-700"
                        >
                          {project.description}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) =>
                            handleInputChange(
                              'projects',
                              'duration',
                              e.target.textContent,
                              idx
                            )
                          }
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          {project.duration}
                        </p>
                        {showButtons && (
                          <button
                            onClick={() => handleRemoveSection('projects', idx)}
                            className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            Remove Project
                          </button>
                        )}
                      </div>
                    ))}
                    {showButtons && (
                      <button
                        onClick={() => handleAddSection('projects')}
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        Add Project
                      </button>
                    )}
                    {showButtons && (
                      <button
                        onClick={() => handleRemoveSection('projects')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        X
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;