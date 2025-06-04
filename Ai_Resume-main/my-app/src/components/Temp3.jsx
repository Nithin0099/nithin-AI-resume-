import React, { useState, useEffect, useRef } from "react";
import {
  enhanceResumeSection,
  downloadResumePDF,
  fetchResume,
  saveResume,
} from "../utils/api";

// Sidebar component (unchanged, already responsive)
const Sidebar = ({ onSave, onEnhance, onDownload }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex">
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md lg:hidden"
        onClick={toggleSidebar}
      >
        ≡
      </button>

      {showSidebar && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out z-50 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          className="absolute top-3 right-3 text-white lg:hidden"
          onClick={toggleSidebar}
        >
          ✕
        </button>

        <div className="flex flex-col h-full space-y-3">
          <h2 className="text-lg font-bold hidden lg:block">Resume Tools</h2>
          <NavItem label="Save Resume" onClick={onSave} />
          <NavItem label="Enhance Profile" onClick={() => onEnhance("profile")} />
          <NavItem label="Enhance Experience" onClick={() => onEnhance("experience")} />
          <NavItem label="Enhance Projects" onClick={() => onEnhance("projects")} />
          <NavItem label="Download PDF" onClick={onDownload} />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, onClick }) => (
  <div
    className="flex items-center p-3 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-700"
    onClick={onClick}
  >
    <span className="ml-2 whitespace-normal">{label}</span>
  </div>
);

export default function Temp3() {
  const resumeRef = useRef(null);

  const handleEnhance = async (section) => {
    console.log(`handleEnhance called for: ${section}`);
    setLoadingSection(section);

    let requestData;

    if (section === "profile") {
      const experienceTitle =
        experiences.length > 0 ? experiences[0].title : "Professional";
      const experienceYears =
        new Date().getFullYear() -
        parseInt(experiences[0]?.duration.split(" - ")[0] || "2020");
      const formattedSkills = skills.join(", ");
      const educationDetails = education
        .map((edu) => `${edu.degree} from ${edu.institution}`)
        .join("; ");

      requestData = {
        section: "profile",
        content: profileSectionText,
        experienceTitle,
        experienceYears,
        skills: formattedSkills,
        education: educationDetails,
      };
    } else if (section === "experience") {
      requestData = {
        section: "experience",
        content: experiences.map((exp) => ({
          id: exp.id,
          bullets: exp.bullets.join("\n").replace(/\n\s*\n/g, "\n"),
        })),
      };
    } else if (section === "projects") {
      requestData = {
        section: "projects",
        content: projects.map((proj) => ({
          id: proj.id,
          name: proj.title,
          description: proj.description,
        })),
      };
    } else {
      console.log("No section selected");
    }

    console.log("Sending request to AI:", requestData);

    try {
      const enhancedData = await enhanceResumeSection(
        requestData.section,
        requestData
      );

      console.log("AI Response:", enhancedData);

      if (section === "profile") {
        setProfileSectionText(enhancedData);
      } else if (section === "experience" && Array.isArray(enhancedData)) {
        const updatedExperiences = experiences.map((exp) => {
          const enhancedExp = enhancedData.find((e) => e.id === exp.id);
          return enhancedExp && enhancedExp.bullets
            ? {
                ...exp,
                bullets: Array.isArray(enhancedExp.bullets)
                  ? enhancedExp.bullets
                  : enhancedExp.bullets.split("\n"),
              }
            : exp;
        });
        setExperiences(updatedExperiences);
      } else if (section === "projects") {
        const updatedProjects = projects.map((proj) => {
          const enhancedProj = enhancedData.find((e) => e.id === proj.id);
          return enhancedProj
            ? { ...proj, description: enhancedProj.description.trim() }
            : proj;
        });
        setProjects(updatedProjects);
      } else {
        console.error("Unexpected AI response:", enhancedData);
      }
    } catch (error) {
      console.error("Error enhancing:", error);
    }

    setLoadingSection(null);
  };

  const handleSaveResume = async () => {
    const resumeData = {
      profileSectionText,
      experiences: experiences.map((exp) => ({ ...exp, id: String(exp.id) })),
      projects: projects.map((proj) => ({ ...proj, id: String(proj.id) })),
      education: education.map((edu) => ({ ...edu, id: String(edu.id) })),
      certifications: certifications.map((cert) => ({
        ...cert,
        id: String(cert.id),
      })),
      skills,
    };
    await saveResume(resumeData);
    alert("Resume saved successfully!");
  };

  const handleDownloadPDF = async () => {
    console.log("📤 Updating content before PDF download...");
    const clientURL = "http://localhost:5173/printable-resume";
    console.log("📤 Sending request to generate PDF for:", clientURL);

    const pdfUrl = await downloadResumePDF(clientURL);

    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Failed to generate PDF.");
    }
  };

  const [hideUI] = useState(false);
  const [loadingSection, setLoadingSection] = useState(null);
  const [hideButtons, setHideButtons] = useState(false);

  const [name, setName] = useState("ISABELLE TODD");
  const [contact, setContact] = useState(
    "91+ 6369411212 | ✉ isabelle@gmail.com | 📍 New York City, NY | 🔗 LinkedIn"
  );
  const [headerProfile, setHeaderProfile] = useState(
    "I solve problems and help people overcome obstacles."
  );
  const [profileSectionText, setProfileSectionText] = useState(
    "Result-oriented project team leader with 5 years of experience in project and product management, developing and managing fast-growing startups."
  );

  const [experiences, setExperiences] = useState([
    {
      id: "1",
      title: "Software Engineer",
      company: "Google",
      duration: "2020 - Present",
      bullets: ["Developed scalable web applications", "Optimized backend performance"],
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "Facebook",
      duration: "2018 - 2020",
      bullets: ["Built reusable UI components", "Improved website performance by 40%"],
    },
  ]);

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    duration: "",
    bullets: "",
  });

  const addOrUpdateExperience = (e) => {
    e.preventDefault();
    if (!newExperience.title || !newExperience.company || !newExperience.duration) return;
    if (editingExperience) {
      setExperiences(
        experiences.map((exp) =>
          exp.id === editingExperience.id
            ? {
                ...newExperience,
                id: String(exp.id),
                bullets: newExperience.bullets.split("\n"),
              }
            : exp
        )
      );
      setEditingExperience(null);
    } else {
      setExperiences([
        ...experiences,
        {
          id: String(Date.now()),
          ...newExperience,
          bullets: newExperience.bullets.split("\n"),
        },
      ]);
    }
    setShowExperienceForm(false);
    setNewExperience({ title: "", company: "", duration: "", bullets: "" });
  };

  const removeExperience = (id) =>
    setExperiences(experiences.filter((exp) => exp.id !== id));

  const [education, setEducation] = useState([
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "Harvard University",
      duration: "2016 - 2020",
    },
    {
      id: "2",
      degree: "Master of Science in AI",
      institution: "MIT",
      duration: "2020 - 2022",
    },
  ]);

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    duration: "",
  });

  const addOrUpdateEducation = (e) => {
    e.preventDefault();
    if (!newEducation.degree || !newEducation.institution || !newEducation.duration) return;
    if (editingEducation) {
      setEducation(
        education.map((edu) =>
          edu.id === editingEducation.id ? { ...newEducation, id: String(edu.id) } : edu
        )
      );
      setEditingEducation(null);
    } else {
      setEducation([...education, { id: String(Date.now()), ...newEducation }]);
    }
    setShowEducationForm(false);
    setNewEducation({ degree: "", institution: "", duration: "" });
  };

  const removeEducation = (id) =>
    setEducation(education.filter((edu) => edu.id !== id));
  const editEducation = (edu) => {
    setEditingEducation(edu);
    setNewEducation(edu);
    setShowEducationForm(true);
  };

  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-commerce Website",
      description: "Developed a full-stack e-commerce platform with React and Node.js.",
    },
    {
      id: "2",
      title: "AI Chatbot",
      description: "Built an AI-powered chatbot for customer service automation.",
    },
  ]);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  const addOrUpdateProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;

    if (editingProject) {
      setProjects(
        projects.map((proj) =>
          proj.id === editingProject.id ? { ...newProject, id: String(proj.id) } : proj
        )
      );
      setEditingProject(null);
    } else {
      setProjects([...projects, { id: String(Date.now()), ...newProject }]);
    }

    setShowProjectForm(false);
    setNewProject({ title: "", description: "" });
  };

  const removeProject = (id) =>
    setProjects(projects.filter((proj) => proj.id !== id));
  const editProject = (proj) => {
    setEditingProject(proj);
    setNewProject(proj);
    setShowProjectForm(true);
  };

  const [certifications, setCertifications] = useState([
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      issuedDate: "2023",
    },
    {
      id: "2",
      name: "Google Cloud Professional Architect",
      organization: "Google",
      issuedDate: "2022",
    },
  ]);

  const removeCertification = async (id) => {
    const updatedCertifications = certifications.filter(
      (cert) => String(cert.id) !== String(id)
    );
    setCertifications(updatedCertifications);

    const resumeData = {
      profileSectionText,
      experiences,
      projects,
      education,
      certifications: updatedCertifications,
      skills,
    };
    try {
      await saveResume(resumeData);
      console.log("Certification removed and saved to backend!");
    } catch (error) {
      console.error("Error saving resume after removal:", error);
      setCertifications(certifications);
    }
  };

  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [newCertification, setNewCertification] = useState({
    title: "",
    issuer: "",
    year: "",
  });

  const addOrUpdateCertification = (e) => {
    e.preventDefault();
    if (!newCertification.title || !newCertification.issuer || !newCertification.year) return;

    const formattedCert = {
      id: String(editingCertification ? editingCertification.id : Date.now()),
      name: newCertification.title,
      organization: newCertification.issuer,
      issuedDate: newCertification.year,
    };

    if (editingCertification) {
      setCertifications(
        certifications.map((cert) =>
          cert.id === editingCertification.id ? formattedCert : cert
        )
      );
      setEditingCertification(null);
    } else {
      setCertifications([...certifications, formattedCert]);
    }

    setShowCertificationForm(false);
    setNewCertification({ title: "", issuer: "", year: "" });
  };

  const [skills, setSkills] = useState([
    "JavaScript",
    "React.js",
    "Tailwind CSS",
    "Node.js",
  ]);

  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
    setShowSkillForm(false);
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  useEffect(() => {
    const getResumeData = async () => {
      const data = await fetchResume();
      if (data) {
        setProfileSectionText(data.profile || profileSectionText);
        setExperiences(data.experiences || experiences);
        setProjects(data.projects || projects);
        setEducation(data.education || education);
        setCertifications(
          data.certifications && data.certifications.length > 0
            ? data.certifications
            : certifications
        );
        setSkills(data.skills || skills);
      }
    };
    getResumeData();
  }, []);

  return (
    <div id="resume-container" className="min-h-screen flex bg-white no-print">
      <Sidebar
        onSave={handleSaveResume}
        onEnhance={handleEnhance}
        onDownload={handleDownloadPDF}
      />

      <div
        ref={resumeRef}
        className="main-content flex-1 transition-all duration-300 ease-in-out p-4 lg:p-8 bg-white shadow-lg border border-gray-200 max-w-4xl mx-auto lg:ml-64"
      >
        <header className="text-center mb-8">
          <div
            contentEditable
            suppressContentEditableWarning
            className="text-4xl font-bold w-full outline-none text-left lg:text-center"
            onBlur={(e) => setName(e.target.innerText)}
          >
            {name}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="text-xl text-gray-600 w-full outline-none text-left lg:text-center"
            onBlur={(e) => setHeaderProfile(e.target.innerText)}
          >
            {headerProfile}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="text-lg text-gray-500 w-full outline-none text-left lg:text-center"
            onBlur={(e) => setContact(e.target.innerText)}
          >
            {contact}
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-extrabold border-b-4 border-black pb-2">
            PROFILE
          </h2>
          {loadingSection === "profile" ? (
            <p>Enhancing...</p>
          ) : (
            <div
              contentEditable
              suppressContentEditableWarning
              className="text-gray-700 mt-2 outline-none"
              onBlur={(e) => setProfileSectionText(e.target.innerText)}
            >
              {profileSectionText}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            EXPERIENCE
          </h2>
          {experiences.map((exp, index) => (
            <div key={exp.id || `exp-${index}`} className="mt-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div contentEditable suppressContentEditableWarning className="outline-none w-full">
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-gray-500">{exp.company} | {exp.duration}</p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 ml-4">
                    {loadingSection === "experience" ? (
                      <p>Enhancing...</p>
                    ) : (
                      exp.bullets.map((point, i) => (
                        <li key={`bullet-${exp.id || index}-${i}`}>{point}</li>
                      ))
                    )}
                  </ul>
                </div>
                {!hideButtons && (
                  <div className="flex space-x-2 mt-2 lg:mt-0">
                    <button
                      onClick={() => {
                        setEditingExperience(exp);
                        setNewExperience({
                          title: exp.title,
                          company: exp.company,
                          duration: exp.duration,
                          bullets: exp.bullets.join("\n"),
                        });
                        setShowExperienceForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!hideButtons && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowExperienceForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded mt-4"
              >
                Add Experience
              </button>
            </div>
          )}
        </section>

        {showExperienceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-11/12 max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </h2>
              <form onSubmit={addOrUpdateExperience} className="grid gap-4">
                <input
                  type="text"
                  name="title"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, title: e.target.value })
                  }
                  placeholder="Title"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="company"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, company: e.target.value })
                  }
                  placeholder="Company"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="duration"
                  value={newExperience.duration}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, duration: e.target.value })
                  }
                  placeholder="Duration"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <textarea
                  name="bullets"
                  value={newExperience.bullets}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, bullets: e.target.value })
                  }
                  placeholder="Bullet points (separate by new line)"
                  className="border px-3 py-2 rounded w-full mb-2"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowExperienceForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {editingExperience ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={edu.id || `edu-${index}`} className="mt-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div contentEditable suppressContentEditableWarning className="outline-none w-full">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-gray-500">{edu.institution} | {edu.duration}</p>
                </div>
                {!hideButtons && (
                  <div className="flex space-x-2 mt-2 lg:mt-0">
                    <button
                      onClick={() => editEducation(edu)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!hideButtons && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowEducationForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded mt-4"
              >
                Add Education
              </button>
            </div>
          )}
        </section>

        {showEducationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-11/12 max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingEducation ? "Edit Education" : "Add New Education"}
              </h2>
              <form onSubmit={addOrUpdateEducation} className="grid gap-4">
                <input
                  type="text"
                  name="degree"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                  placeholder="Degree"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="institution"
                  value={newEducation.institution}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, institution: e.target.value })
                  }
                  placeholder="Institution"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="duration"
                  value={newEducation.duration}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, duration: e.target.value })
                  }
                  placeholder="Duration"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEducationForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {editingEducation ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            PROJECTS
          </h2>
          {projects.map((proj, index) => (
            <div key={proj.id || `proj-${index}`} className="mt-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div contentEditable suppressContentEditableWarning className="outline-none w-full">
                  <p className="font-semibold">{proj.title}</p>
                  <p className="text-gray-500">{proj.description}</p>
                </div>
                {!hideButtons && (
                  <div className="flex space-x-2 mt-2 lg:mt-0">
                    <button
                      onClick={() => editProject(proj)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!hideButtons && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowProjectForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded mt-4"
              >
                Add Project
              </button>
            </div>
          )}
        </section>

        {showProjectForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-11/12 max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <form onSubmit={addOrUpdateProject} className="grid gap-4">
                <input
                  type="text"
                  name="title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="Project Title"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  placeholder="Project Description"
                  className="border px-3 py-2 rounded w-full mb-2"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {editingProject ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            CERTIFICATIONS
          </h2>
          {certifications.map((cert, index) => (
            <div key={cert.id || `cert-${index}`} className="mt-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div contentEditable suppressContentEditableWarning className="outline-none w-full">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-gray-500">
                    {cert.organization} | {cert.issuedDate}
                  </p>
                </div>
                {!hideButtons && (
                  <div className="flex space-x-2 mt-2 lg:mt-0">
                    <button
                      onClick={() => {
                        setEditingCertification(cert);
                        setNewCertification({
                          title: cert.name,
                          issuer: cert.organization,
                          year: cert.issuedDate,
                        });
                        setShowCertificationForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeCertification(cert.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!hideButtons && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowCertificationForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
              >
                Add New Certification
              </button>
            </div>
          )}
        </section>

        {showCertificationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-11/12 max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCertification ? "Edit Certification" : "Add New Certification"}
              </h2>
              <form onSubmit={addOrUpdateCertification} className="grid gap-4">
                <input
                  type="text"
                  name="title"
                  value={newCertification.title}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, title: e.target.value })
                  }
                  placeholder="Certification Title"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="issuer"
                  value={newCertification.issuer}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, issuer: e.target.value })
                  }
                  placeholder="Issuing Organization"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="year"
                  value={newCertification.year}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, year: e.target.value })
                  }
                  placeholder="Year of Certification"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCertificationForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {editingCertification ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center bg-skyblue-500 text-black px-3 py-1 rounded-lg"
              >
                <span contentEditable suppressContentEditableWarning className="">
                  {skill}
                </span>
                {!hideButtons && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-black bg-600 w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {!hideButtons && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowSkillForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
              >
                Add Skill
              </button>
            </div>
          )}
        </section>

        {showSkillForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-11/12 max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
              <form onSubmit={addSkill} className="grid gap-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Skill Name"
                  className="border px-3 py-2 rounded w-full mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSkillForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
  .main-content {
    width: 100%;
    transition: margin-left 0.3s ease-in-out;
    padding: 1rem; /* Base padding for mobile */
    font-size: 12pt; /* Standard ATS-friendly font size */
  }

  h1, h2, h3 {
    font-size: 14pt; /* Standard ATS-friendly heading size */
    font-weight: bold;
  }

  @media (max-width: 1023px) {
    .main-content {
      margin-left: 0 !important; /* No offset on mobile when sidebar is hidden */
      padding: 1rem;
    }
    .max-w-4xl {
      max-width: 100%;
    }
    .text-center {
      text-align: left !important; /* Left-align text on mobile */
    }
    .flex {
      flex-direction: column !important; /* Stack items vertically on mobile */
    }
  }

  @media (min-width: 1024px) {
    .main-content {
      margin-left: 16rem !important; /* Matches sidebar width (w-64 = 16rem) */
      padding: 2rem; /* Larger padding on desktop */
    }
  }

  @media print {
    .no-print {
      display: none;
    }
  }
`}</style>
</div>
);
}

