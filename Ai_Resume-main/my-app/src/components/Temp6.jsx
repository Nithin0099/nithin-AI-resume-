import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Temp6 = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: 'Aditya Tiwary',
      title: 'Senior Software Engineer',
      email: 'aditya.tiwary@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/adityatiwary',
      github: 'github.com/adityatiwary',
    },
    summary: 'Innovative Senior Software Engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading high-performance teams.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        duration: '2021 - Present',
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Reduced system latency by 40% through optimization',
          'Mentored junior developers and conducted code reviews',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'Digital Solutions Ltd.',
        location: 'New York, NY',
        duration: '2019 - 2021',
        achievements: [
          'Developed RESTful APIs for enterprise clients',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
          'Collaborated with UX team to improve user experience',
        ],
      },
    ],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        school: 'Stanford University',
        location: 'Stanford, CA',
        duration: '2017 - 2019',
      },
      {
        degree: 'Bachelor of Technology in Computer Science',
        school: 'Indian Institute of Technology',
        location: 'Delhi, India',
        duration: '2013 - 2017',
      },
    ],
    skills: [
      'React.js', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL',
    ],
    certifications: [
      'AWS Certified Solutions Architect', 'Google Cloud Professional Developer', 'MongoDB Certified Developer',
    ],
  });

  const [activeSection, setActiveSection] = useState('personalInfo');
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isValidEmail = (email) => {
    const trimmedEmail = email.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^@\s]+$/;
    return re.test(trimmedEmail);
  };

  const saveResume = async () => {
    if (!isValidEmail(formData.personalInfo.email)) {
      alert("Please enter a valid email address.");
      return null;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/resume6/save", { resumeData: formData });
      if (response.data?.data?._id) {
        setFormData(prev => ({ ...prev, _id: response.data.data._id }));
        alert("Resume saved successfully!");
        return response.data.data._id;
      }
      return null;
    } catch (error) {
      console.error("❌ Error saving resume:", error);
      alert("Failed to save resume.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const enhanceSingleField = async (field) => {
    if (!formData._id) {
      alert("Please save your resume before enhancing a field.");
      return;
    }
    try {
      setLoading(true);
      let payload = { resumeId: formData._id, field };
      console.log(payload)
      if (field === 'experience') {
        payload.data = formData.experience.map(exp => exp.achievements);
      } else {
        payload.data = formData[field];
      }
      const response = await axios.post('http://localhost:5000/api/resume6/enhanceField', payload);
      if (response.data?.data) {
        if (field === 'experience') {
          setFormData(prev => ({
            ...prev,
            experience: response.data.data.experience,
            _id: response.data.data._id
          }));
          
        } else {
          setFormData(prev => ({
            ...prev,
            [field]: response.data.data[field],
            _id: response.data.data._id
          }));
        }
        alert(`${field} enhanced successfully!`);
      }
    } catch (error) {
      console.error(`❌ Error enhancing ${field}:`, error);
      alert(`Failed to enhance ${field}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const resumeId = await saveResume();
      if (!resumeId && !formData._id) {
        alert("Failed to save resume before generating PDF.");
        return;
      }
      const payload = { resumeId: formData._id || resumeId };
      const response = await axios.post(
        "http://localhost:5000/api/resume6/generate-pdf",
        payload,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof field === 'string'
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const renderEditingForm = () => {
    switch (activeSection) {
      case 'personalInfo':
        return (
          <div className="space-y-4">
            {formData.personalInfo && Object.entries(formData.personalInfo).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange('personalInfo', key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        );
      case 'summary':


        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', null, e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => enhanceSingleField('summary')}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enhance Summary
            </button>
          </div>
        );
      case 'experience':

        return (
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index] = { ...exp, title: e.target.value };
                      handleInputChange('experience', null, newExp);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index] = { ...exp, company: e.target.value };
                      handleInputChange('experience', null, newExp);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index] = { ...exp, location: e.target.value };
                      handleInputChange('experience', null, newExp);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index] = { ...exp, duration: e.target.value };
                      handleInputChange('experience', null, newExp);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].achievements[achievementIndex] = e.target.value;
                          handleInputChange('experience', null, newExp);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => {
                          const newExp = [...formData.experience];
                          newExp[index].achievements = exp.achievements.filter((_, i) => i !== achievementIndex);
                          handleInputChange('experience', null, newExp);
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newExp = [...formData.experience];
                      newExp[index].achievements.push('');
                      handleInputChange('experience', null, newExp);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Achievement
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newExp = [...formData.experience, {
                  title: '', company: '', location: '', duration: '', achievements: [''],
                }];
                handleInputChange('experience', null, newExp);
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Add Experience
            </button>
            <button
              onClick={() => enhanceSingleField('experience')}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enhance Experience Only
            </button>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index] = { ...edu, degree: e.target.value };
                      handleInputChange('education', null, newEdu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index] = { ...edu, school: e.target.value };
                      handleInputChange('education', null, newEdu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index] = { ...edu, location: e.target.value };
                      handleInputChange('education', null, newEdu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index] = { ...edu, duration: e.target.value };
                      handleInputChange('education', null, newEdu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newEdu = [...formData.education, { degree: '', school: '', location: '', duration: '' }];
                handleInputChange('education', null, newEdu);
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Add Education
            </button>
          </div>
        );
      case 'skills':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...formData.skills];
                      newSkills[index] = e.target.value;
                      handleInputChange('skills', null, newSkills);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      const newSkills = formData.skills.filter((_, i) => i !== index);
                      handleInputChange('skills', null, newSkills);
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newSkills = [...formData.skills, ''];
                handleInputChange('skills', null, newSkills);
              }}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Skill
            </button>
          </div>
        );
      case 'certifications':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
            <div className="space-y-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[index] = e.target.value;
                      handleInputChange('certifications', null, newCerts);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      const newCerts = formData.certifications.filter((_, i) => i !== index);
                      handleInputChange('certifications', null, newCerts);
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newCerts = [...formData.certifications, ''];
                handleInputChange('certifications', null, newCerts);
              }}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Certification
            </button>
            <button
              onClick={() => enhanceSingleField('certifications')}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enhance Certifications
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white text-gray-800 p-4 h-screen sticky top-0 overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Resume Sections</h3>
        <nav className="space-y-2">
          {[
            { id: 'personalInfo', label: 'Personal Info' },
            { id: 'summary', label: 'Summary' },
            { id: 'experience', label: 'Experience' },
            { id: 'education', label: 'Education' },
            { id: 'skills', label: 'Skills' },
            { id: 'certifications', label: 'Certifications' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeSection === section.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => setShowEnhancementOptions(!showEnhancementOptions)}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            🤖 AI Enhancement
          </button>
          {showEnhancementOptions && (
            <div className="space-y-2">
              <button
                onClick={() => enhanceSingleField('summary')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Enhance Summary
              </button>
              <button
                onClick={() => enhanceSingleField('experience')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Enhance Experience Only
              </button>
              <button
                onClick={() => enhanceSingleField('certifications')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Enhance Certifications
              </button>
            </div>
          )}
          <button
            onClick={saveResume}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Resume
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
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
                <h3 className="text-xl font-bold text-white mb-4">Resume Sections</h3>
                {[
                  { id: 'personalInfo', label: 'Personal Info' },
                  { id: 'summary', label: 'Summary' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'education', label: 'Education' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'certifications', label: 'Certifications' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowEnhancementOptions(!showEnhancementOptions)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800"
                >
                  🤖 AI Enhancement
                </button>
                {showEnhancementOptions && (
                  <div className="space-y-2">
                    <button
                      onClick={() => enhanceSingleField('summary')}
                      className="w-full text-left px-4 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                      Enhance Summary
                    </button>
                    <button
                      onClick={() => enhanceSingleField('experience')}
                      className="w-full text-left px-4 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                      Enhance Experience Only
                    </button>
                    <button
                      onClick={() => enhanceSingleField('certifications')}
                      className="w-full text-left px-4 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                      Enhance Certifications
                    </button>
                  </div>
                )}
                <button
                  onClick={saveResume}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Resume
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">Modern Resume Editor</h2>
            <p className="mt-2 text-gray-600">Your professional story, beautifully presented</p>
          </motion.div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            {renderEditingForm()}
          </div>
          <div
            id="modern-resume"
            className="bg-white shadow-xl rounded-lg overflow-hidden mx-auto"
            style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', padding: '5mm' }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-12">
              <h1 className="text-2xl md:text-4xl font-bold">{formData.personalInfo.name}</h1>
              <p className="text-lg md:text-xl mt-2">{formData.personalInfo.title}</p>
              <div className="mt-4 flex flex-col md:flex-row flex-wrap gap-4 text-sm md:text-base">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {formData.personalInfo.email}
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {formData.personalInfo.phone}
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {formData.personalInfo.location}
                </div>
              </div>
            </div>
            <div className="px-4 md:px-8 py-6">
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Professional Summary</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{formData.summary}</p>
              </div>
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Experience</h2>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-700">{exp.title}</h3>
                        <p className="text-gray-600 text-sm md:text-base">{exp.company}</p>
                      </div>
                      <div className="text-gray-500 text-sm md:text-base">{exp.duration}</div>
                    </div>
                    <ul className="mt-2 list-disc list-inside text-gray-600 text-sm md:text-base">
                      {Array.isArray(exp.achievements) ? (
                        exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))
                      ) : (
                        <li>No achievements listed</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Education</h2>
                {formData.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-700">{edu.degree}</h3>
                        <p className="text-gray-600 text-sm md:text-base">{edu.school}</p>
                      </div>
                      <div className="text-gray-500 text-sm md:text-base">{edu.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="px-2 md:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs md:text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
                <ul className="list-disc list-inside text-gray-600 text-sm md:text-base">
                  {Array.isArray(formData.certifications) && formData.certifications.length > 0 ? (
                    formData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))
                  ) : (
                    <li>No certifications listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp6;