// PrintableResume.jsx
import React from "react";
import { useEffect, useState } from "react";
import { fetchResume } from "../utils/api";

export default function PrintableResume() {
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
  const [skills, setSkills] = useState(["JavaScript", "React.js", "Tailwind CSS", "Node.js"]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getResumeData = async () => {
      console.log("Fetching resume data for PrintableResume...");
      const data = await fetchResume();
      if (data) {
        console.log("Resume data fetched:", data);
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
      } else {
        console.error("Failed to fetch resume data");
      }
      setIsLoaded(true);
    };
    getResumeData();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div id="resume-container" className="min-h-screen flex bg-white no-print">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg border border-gray-200 flex-1">
        <header className="text-center mb-8">
          <div className="text-4xl font-bold text-center w-full outline-none">
            ISABELLE TODD
          </div>
          <div className="text-xl text-gray-600 text-center w-full outline-none">
            I solve problems and help people overcome obstacles.
          </div>
          <div className="text-lg text-gray-500 text-center w-full outline-none">
            91+ 6369411212 | ✉ isabelle@gmail.com | 📍 New York City, NY | 🔗 LinkedIn
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-extrabold border-b-4 border-black pb-2">
            PROFILE
          </h2>
          <div className="text-gray-700 mt-2 outline-none">{profileSectionText}</div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            EXPERIENCE
          </h2>
          {experiences.map((exp, index) => (
            <div key={exp.id || `exp-${index}`} className="mt-4">
              <div className="flex justify-between items-center">
                <div className="outline-none">
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-gray-500">{exp.company} | {exp.duration}</p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 ml-4">
                    {exp.bullets.map((point, i) => (
                      <li key={`bullet-${exp.id || index}-${i}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={edu.id || `edu-${index}`} className="mt-4">
              <div className="flex justify-between items-center">
                <div className="outline-none">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-gray-500">{edu.institution} | {edu.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            PROJECTS
          </h2>
          {projects.map((proj, index) => (
            <div key={proj.id || `proj-${index}`} className="mt-4">
              <div className="flex justify-between items-center">
                <div className="outline-none">
                  <p className="font-semibold">{proj.title}</p>
                  <p className="text-gray-500">{proj.description}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-4 border-black pb-2">
            CERTIFICATIONS
          </h2>
          {certifications.map((cert, index) => (
            <div key={cert.id || `cert-${index}`} className="mt-4">
              <div className="flex justify-between items-center">
                <div className="outline-none">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-gray-500">{cert.organization} | {cert.issuedDate}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

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
                <span className="">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}