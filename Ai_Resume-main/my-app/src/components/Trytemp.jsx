import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const Sidebar = React.memo(
  ({
    setActiveSection,
    handleAIEnhancement,
    handleDownload,
    handleShare,
    branding,
    handleBrandingToggle,
    handleUploadResume,
    handleColorPicker,
    showAIMenu,
    setShowAIMenu,
    isLoading,
    setIsLoading,
  }) => {
    return (
      <div className="w-16 md:w-72 bg-white text-gray-800 p-4 md:p-6 rounded-r-3xl shadow-2xl border-r border-gray-200 flex flex-col items-center md:items-start">
        <div className="w-full flex flex-col items-center md:items-start space-y-4 md:space-y-6 z-10">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 hidden md:block">
            Resume Tools
          </h3>
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-blue-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={() => setActiveSection("rearrange")}
          >
            <span className="text-2xl md:text-lg">↕️</span>
            <span className="hidden md:inline">Rearrange</span>
          </button>
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-red-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={() => setShowAIMenu(!showAIMenu)}
          >
            <span className="text-2xl md:text-lg">🤖</span>
            <span className="hidden md:inline">AI Assistant</span>
          </button>
          
          {showAIMenu && (
            <div className="ml-4 md:ml-6 w-11/12">
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Enhance Specific Field</p>
              <div className="flex flex-col space-y-2">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 md:px-4 md:py-3 rounded-md text-center text-xs md:text-sm font-medium ai-assistant-button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                >
                  Enhance Summary
                </button>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 md:px-4 md:py-3 rounded-md text-center text-xs md:text-sm font-medium ai-assistant-button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                >
                  Enhance Achievements
                </button>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 md:px-4 md:py-3 rounded-md text-center text-xs md:text-sm font-medium ai-assistant-button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                >
                  Enhance Experience
                </button>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 md:px-4 md:py-3 rounded-md text-center text-xs md:text-sm font-medium ai-assistant-button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                >
                  Enhance Education
                </button>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 md:px-4 md:py-3 rounded-md text-center text-xs md:text-sm font-medium ai-assistant-button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                >
                  Enhance Projects
                </button>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 md:px-4 md:py-3 rounded-md text-center text-xs md:text-sm font-medium ai-assistant-button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                >
                  Enhance Courses
                </button>
              </div>
            </div>
          )}
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-purple-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={handleColorPicker}
          >
            <span className="text-2xl md:text-lg">🎨</span>
            <span className="hidden md:inline">Color</span>
          </button>
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-indigo-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={() => alert("Resume saved successfully!")}
          >
            <span className="text-2xl md:text-lg">💾</span>
            <span className="hidden md:inline">Save Resume</span>
          </button>
          <hr className="border-gray-300 my-2 w-full hidden md:block" />
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-yellow-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={handleDownload}
          >
            <span className="text-2xl md:text-lg">⬇️</span>
            <span className="hidden md:inline">Download</span>
          </button>
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-green-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={handleShare}
          >
            <span className="text-2xl md:text-lg">🔗</span>
            <span className="hidden md:inline">Share</span>
          </button>
          <div className="flex items-center justify-between mt-2 w-full">
            <span className="text-gray-800 font-medium hidden md:block">
              Branding
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={branding}
                onChange={handleBrandingToggle}
                className="sr-only"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-all duration-300">
                <div
                  className="absolute w-5 h-5 bg-gray-600 rounded-full left-0.5 top-0.5 transition-transform duration-300"
                  style={{
                    transform: branding ? "translateX(24px)" : "translateX(0)",
                  }}
                />
              </div>
            </label>
          </div>
          <button
            className="w-12 h-12 md:w-full md:h-auto bg-purple-500 text-white rounded-full md:rounded-full p-2 md:p-3 shadow-lg flex items-center justify-center md:flex-row md:justify-start md:space-x-2"
            onClick={handleUploadResume}
          >
            <span className="text-2xl md:text-lg">⬆️</span>
            <span className="hidden md:inline">Upload Resume</span>
          </button>
        </div>
      </div>
    );
  },
);

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState({
    name: "Aditya Tiwary",
    role: "Information Technology Specialist | Cybersecurity | Data Analysis",
    phone: "+1-(234)-555-1234",
    email: "Email",
    linkedin: "linkedin.com",
    location: "New York City, New York",
    summary:
      "With over a decade of IT experience, I bring a proven track record in implementing robust IT solutions, enhancing network security, and driving data analysis projects. My goal is to leverage my expertise to advance organizational technology objectives and contribute to mission success.",
    experience: [
      {
        title: "Senior IT Systems Engineer",
        companyName: "Techwave Consulting Inc.",
        date: "08/2019 - Present",
        companyLocation: "New York City, New York",
        accomplishment:
          "• Developed and implemented a network security protocol for a corporate network of over 5000 users, reducing security breaches by 45%.\n" +
          "• Led a team of 10 in managing IT infrastructure, successfully achieving 99.9% system uptime and reducing system outages by 60%.\n" +
          "• Optimized data storage and processing procedures, saving the company over $200,000 annually in operational costs.\n" +
          "• Designed and conducted employee training sessions on cybersecurity practices, improving staff compliance by 70%.\n" +
          "• Managed the development of a multi-cloud environment, integrating services from AWS, Azure, and GCP, leading to a 30% increase in deployment efficiency.",
      },
      {
        title: "IT Project Manager",
        companyName: "Innovatech Solutions",
        date: "03/2016 - 05/2019",
        companyLocation: "New York City, New York",
        accomplishment:
          "• Oversaw the migration of enterprise applications to a hybrid cloud infrastructure, resulting in a 20% improvement in agility.\n" +
          "• Managed budgets of up to $3M for complex IT projects, consistently delivering within 10% of projected costs.\n" +
          "• Enhanced cross-functional communication through the development of a project management portal, increasing project completion rates by 25%.\n" +
          "• Negotiated with vendors to secure cost-effective solutions for IT hardware and software updates, saving the company 15% in expenses.\n" +
          "• Introduced Agile and Scrum methodologies, improving project delivery time by approximately 30%.",
      },
      {
        title: "Network Administrator",
        companyName: "Digital Horizons",
        date: "09/2013 - 02/2016",
        companyLocation: "Jersey City, New Jersey",
        accomplishment:
          "• Maintained and upgraded a network of 200 servers with 99.8% uptime, supporting business continuity effectively.\n" +
          "• Implemented a new company-wide VPN system, enhancing remote work capabilities for 500 employees.\n" +
          "• Reduced network latency by 20% through strategic network reconfiguration and hardware updates.\n" +
          "• Collaborated with the cybersecurity team to robustly tackle emerging threats and vulnerabilities.",
      },
    ],
    education: [
      {
        degree: "Master of Science in Information Technology",
        institution: "New York University",
        duration: "01/2011 - 01/2013",
        location: "New York City, New York",
      },
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "Rutgers University",
        duration: "01/2007 - 01/2011",
        location: "New Brunswick, New Jersey",
      },
    ],
    achievements: [
      {
        keyAchievements: "System Uptime Excellence Award",
        describe:
          "Received an excellence award for maintaining system uptime above 99.9% over a 12-month period, contributing to optimal company-wide operations.",
      },
      {
        keyAchievements: "Cost Reduction Leader",
        describe:
          "Implemented strategic IT cost-saving initiatives, reducing the department's expenses by 15% without impacting service quality.",
      },
      {
        keyAchievements: "Employee Training Initiative Success",
        describe:
          "Designed a comprehensive cybersecurity training program, resulting in a 70% improvement in employee compliance with IT security protocols.",
      },
      {
        keyAchievements: "Best Big Data Project Implementation",
        describe:
          "Led a project team that won recognition for the Best Big Data Project Implementation, effectively increasing company revenue by 15%.",
      },
    ],
    languages: [
      { name: "English", level: "Native", dots: 5 },
      { name: "Spanish", level: "Advanced", dots: 4 },
      { name: "French", level: "Beginner", dots: 1 },
    ],
    skills: [
      { category: "Network Security", items: ["Network Security"] },
      { category: "Cloud Computing", items: ["Cloud Computing"] },
      { category: "Data Analysis", items: ["Data Analysis"] },
      { category: "Project Management", items: ["Project Management"] },
      { category: "Cybersecurity", items: ["Cybersecurity"] },
      { category: "Big Data Analytics", items: ["Big Data Analytics"] },
    ],
    projects: [
      {
        title: "Data Integrity Security Tool",
        description:
          "Contributed to the development of an open-source security tool to maintain data integrity in cloud environments. See more at github.com/data-integrity-tool.",
      },
      {
        title: "Small Business Cloud Migration Plugin",
        description:
          "Co-developed a plugin to streamline cloud migration processes for small businesses, aiming to simplify the transition to the cloud. More details at github.com/smb-cloud-plugin.",
      },
    ],
    courses: [
      {
        title: "Certified Ethical Hacker (CEH)",
        description:
          "Completed intensive Certified Ethical Hacker course to enhance knowledge in proactive network security, facilitated by EC-Council.",
      },
      {
        title: "AWS Certified Solutions Architect",
        description:
          "Achieved AWS Certified Solutions Architect designation, demonstrating proficiency in designing scalable AWS cloud infrastructure.",
      },
    ],
  });

  const [showButtons, setShowButtons] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [branding, setBranding] = useState(true);
  const [sectionSettings, setSectionSettings] = useState({
    header: {
      showTitle: true,
      showPhone: true,
      showLink: true,
      showEmail: true,
      showLocation: true,
      uppercaseName: true,
      showPhoto: true,
    },
    summary: { showSummary: true },
    experience: { showExperience: true },
    education: { showEducation: true },
    achievements: { showAchievements: true },
    languages: { showLanguages: true },
    skills: { showSkills: true },
    projects: { showProjects: true },
    courses: { showCourses: true },
  });

  const [activeSection, setActiveSection] = useState(null);
  const [sectionsOrder, setSectionsOrder] = useState([
    "summary",
    "skills",
    "experience",
    "education",
    "achievements",
    "languages",
    "projects",
    "courses",
  ]);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAIErrorPopup, setShowAIErrorPopup] = useState(false);
  const [showUploadErrorPopup, setShowUploadErrorPopup] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColor, setActiveColor] = useState("#000000");
  const resumeRef = useRef(null);

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#666666" },
    { name: "Blue", value: "#2563EB" },
    { name: "Red", value: "#DC2626" },
    { name: "Green", value: "#16A34A" },
    { name: "Purple", value: "#9333EA" },
    { name: "Orange", value: "#F97316" },
  ];

  useEffect(() => {
    const savedResume = localStorage.getItem("resumeData");
    if (savedResume) setResumeData(JSON.parse(savedResume));

    const savedSettings = localStorage.getItem("sectionSettings");
    if (savedSettings) setSectionSettings(JSON.parse(savedSettings));

    const savedBranding = localStorage.getItem("branding");
    if (savedBranding) setBranding(JSON.parse(savedBranding));
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    localStorage.setItem("sectionSettings", JSON.stringify(sectionSettings));
    localStorage.setItem("branding", JSON.stringify(branding));
  }, [resumeData, sectionSettings, branding]);

  const handleInputChange = useCallback(
    (section, field, value, index = null) => {
      if (index !== null) {
        const updatedSection = [...(resumeData[section] || [])];
        updatedSection[index][field] = value;
        setResumeData((prev) => ({ ...prev, [section]: updatedSection }));
      } else {
        setResumeData((prev) => ({ ...prev, [field]: value }));
      }
    },
    [resumeData],
  );

  const handleAddSection = useCallback((section) => {
    const newItem =
      {
        experience: {
          title: "New Position",
          companyName: "Company Name",
          date: "2023 - Present",
          companyLocation: "City, State, Country",
          accomplishment:
            "• Add your accomplishments here\n• Second achievement",
        },
        education: {
          degree: "Degree Name",
          institution: "Institution Name",
          duration: "Year - Year",
          location: "City, State, Country",
        },
        achievements: {
          keyAchievements: "New Achievement",
          describe: "Describe your achievement here",
        },
        languages: {
          name: "New Language",
          level: "Beginner",
          dots: 1,
        },
        skills: {
          category: "New Category",
          items: ["Skill 1", "Skill 2"],
        },
        projects: {
          title: "New Project",
          description: "Project description",
        },
        courses: {
          title: "New Course",
          description: "Course description",
        },
      }[section] || {};

    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  }, []);

  const handleRemoveSection = useCallback(
    (section, index) => {
      const updatedSection = [...(resumeData[section] || [])];
      updatedSection.splice(index, 1);
      setResumeData((prev) => ({ ...prev, [section]: updatedSection }));
    },
    [resumeData],
  );

  const handleSkillItemChange = useCallback(
    (skillIndex, itemIndex, value) => {
      const updatedSkills = [...resumeData.skills];
      updatedSkills[skillIndex].items[itemIndex] = value;
      setResumeData((prev) => ({ ...prev, skills: updatedSkills }));
    },
    [resumeData],
  );

  const handleAddSkillItem = useCallback(
    (skillIndex) => {
      const updatedSkills = [...resumeData.skills];
      updatedSkills[skillIndex].items.push("New Skill");
      setResumeData((prev) => ({ ...prev, skills: updatedSkills }));
    },
    [resumeData],
  );

  const handleLanguageLevelChange = useCallback(
    (index, level) => {
      const dotsMap = { Native: 5, Advanced: 4, Beginner: 1 };
      const updatedLanguages = [...resumeData.languages];
      updatedLanguages[index].level = level;
      updatedLanguages[index].dots = dotsMap[level];
      setResumeData((prev) => ({ ...prev, languages: updatedLanguages }));
    },
    [resumeData],
  );

  const handleDownload = useCallback(async () => {
    setShowButtons(false);
    setActiveSection(null);
    setIsDownloading(true);

    try {
      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        console.error("Resume element not found");
        setShowButtons(true);
        setIsDownloading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
        height: resumeElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setShowButtons(true);
      setIsDownloading(false);
    }
  }, []);

  const handleShare = useCallback(() => {
    const resumeLink = window.location.href;
    navigator.clipboard
      .writeText(resumeLink)
      .then(() => {
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 3000);
      })
      .catch(() => alert("Failed to copy link to clipboard."));
  }, []);

  const handleUploadResume = useCallback(() => {
    setShowUploadErrorPopup(true);
    setTimeout(() => setShowUploadErrorPopup(false), 3000);
  }, []);

  const handleSettingChange = useCallback((section, setting) => {
    setSectionSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [setting]: !prev[section][setting] },
    }));
  }, []);

  const handleBrandingToggle = useCallback(
    () => setBranding((prev) => !prev),
    [],
  );

  const handleSettingsClick = useCallback((section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  }, []);

  const handleMoveSectionUp = useCallback(
    (index) => {
      if (index > 0) {
        const newOrder = [...sectionsOrder];
        [newOrder[index - 1], newOrder[index]] = [
          newOrder[index],
          newOrder[index - 1],
        ];
        setSectionsOrder(newOrder);
      }
    },
    [sectionsOrder],
  );

  const handleMoveSectionDown = useCallback(
    (index) => {
      if (index < sectionsOrder.length - 1) {
        const newOrder = [...sectionsOrder];
        [newOrder[index + 1], newOrder[index]] = [
          newOrder[index],
          newOrder[index + 1],
        ];
        setSectionsOrder(newOrder);
      }
    },
    [sectionsOrder],
  );

  const [showAIMenu, setShowAIMenu] = useState(false);
  
  const handleAIEnhancement = useCallback(() => {
    setShowAIErrorPopup(true);
  }, []);

  const handleColorPicker = useCallback(() => {
    setShowColorPicker(true);
  }, []);

  const applyColorToSelection = useCallback((color) => {
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.color = color;
      range.surroundContents(span);
    }
    setShowColorPicker(false);
    setActiveColor(color);
  }, []);

  const LoadingScreen = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-xl font-semibold">
            Enhancing your resume...
          </p>
        </div>
      </div>
    ),
    [],
  );

  const DownloadPreloader = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-800 text-lg font-semibold">Generating PDF...</p>
      </div>
    </motion.div>
  );

  const ShareNotification = () => (
    <motion.div
      className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      Link copied to clipboard!
    </motion.div>
  );

  const AIEnhancementPanel = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-white bg-red-500 rounded-full p-1 mr-2">
              <span className="text-xl">🤖</span>
            </span>
            <h3 className="text-lg font-bold text-gray-800">AI Assistant</h3>
          </div>
          <button
            onClick={() => setShowAIErrorPopup(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 font-medium mb-3">Enhance Specific Field</p>
          <div className="flex flex-col space-y-2">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-center font-medium"
              onClick={() => {
                setShowAIErrorPopup(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
            >
              Enhance Summary
            </button>
            
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-center font-medium"
              onClick={() => {
                setShowAIErrorPopup(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
            >
              Enhance Achievements
            </button>
            
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-center font-medium"
              onClick={() => {
                setShowAIErrorPopup(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
            >
              Enhance Experience
            </button>
            
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-center font-medium"
              onClick={() => {
                setShowAIErrorPopup(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
            >
              Enhance Education
            </button>
            
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-center font-medium"
              onClick={() => {
                setShowAIErrorPopup(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
            >
              Enhance Projects
            </button>
            
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-center font-medium"
              onClick={() => {
                setShowAIErrorPopup(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
            >
              Enhance Courses
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const AIErrorPopup = () => (
    <AIEnhancementPanel />
  );

  const UploadErrorPopup = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4 text-center">
        <p className="text-lg font-semibold text-red-600 mb-4">
          Upload feature unavailable <br />
          Try again later
        </p>
        <button
          onClick={() => setShowUploadErrorPopup(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );

  const ColorPickerPopup = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Select Color</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 transition-colors"
              style={{ backgroundColor: color.value }}
              onClick={() => applyColorToSelection(color.value)}
              title={color.name}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowColorPicker(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        setActiveSection={setActiveSection}
        handleAIEnhancement={handleAIEnhancement}
        handleDownload={handleDownload}
        handleShare={handleShare}
        branding={branding}
        handleBrandingToggle={handleBrandingToggle}
        handleUploadResume={handleUploadResume}
        handleColorPicker={handleColorPicker}
        showAIMenu={showAIMenu}
        setShowAIMenu={setShowAIMenu}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <div className="flex-1 p-6 overflow-auto flex justify-center">
        <div
          className="bg-white shadow-md"
          style={{
            width: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box",
          }}
        >
          <div
            ref={resumeRef}
            className="p-12 flex flex-col"
            style={{
              width: "210mm",
              minHeight: "297mm",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleInputChange(null, "name", e.target.innerText)
                  }
                  className="text-3xl font-bold text-gray-900 uppercase tracking-wide"
                >
                  {resumeData.name}
                </h1>
                {sectionSettings.header.showTitle && (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInputChange(null, "role", e.target.textContent)
                    }
                    className="text-sm text-blue-600 mt-1"
                  >
                    {resumeData.role}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                  {sectionSettings.header.showPhone && (
                    <div className="flex items-center">
                      <span className="mr-1">☎</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleInputChange(null, "phone", e.target.textContent)
                        }
                      >
                        {resumeData.phone}
                      </span>
                    </div>
                  )}
                  {sectionSettings.header.showEmail && (
                    <div className="flex items-center">
                      <span className="mr-1">✉</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleInputChange(null, "email", e.target.textContent)
                        }
                      >
                        {resumeData.email}
                      </span>
                    </div>
                  )}
                  {sectionSettings.header.showLink && (
                    <div className="flex items-center">
                      <span className="mr-1">🔗</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleInputChange(
                            null,
                            "linkedin",
                            e.target.textContent,
                          )
                        }
                      >
                        {resumeData.linkedin}
                      </span>
                    </div>
                  )}
                  {sectionSettings.header.showLocation && (
                    <div className="flex items-center">
                      <span className="mr-1">📍</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleInputChange(
                            null,
                            "location",
                            e.target.textContent,
                          )
                        }
                      >
                        {resumeData.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {sectionSettings.header.showPhoto && (
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  AT
                </div>
              )}
            </div>
            <div className="flex flex-1">
              <div className="w-1/2 pr-4">
                {sectionsOrder.map((section) => {
                  if (
                    section === "summary" &&
                    sectionSettings.summary.showSummary
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>SUMMARY</span>
                          {showButtons && activeSection === "summary" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("summary")}
                              aria-label="Open summary settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(
                              null,
                              "summary",
                              e.target.textContent,
                            )
                          }
                          className="text-sm text-gray-700 leading-relaxed"
                        >
                          {resumeData.summary}
                        </p>
                      </div>
                    );
                  }
                  if (
                    section === "experience" &&
                    sectionSettings.experience.showExperience
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>EXPERIENCE</span>
                          {showButtons && activeSection === "experience" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("experience")}
                              aria-label="Open experience settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        {resumeData.experience.map((exp, idx) => (
                          <div key={idx} className="mb-4">
                            <div className="mb-1">
                              <div className="flex justify-between items-center">
                                <h3
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInputChange(
                                      "experience",
                                      "title",
                                      e.target.textContent,
                                      idx,
                                    )
                                  }
                                  className="text-sm font-bold text-gray-900"
                                >
                                  {exp.title}
                                </h3>
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                      handleInputChange(
                                        "experience",
                                        "companyName",
                                        e.target.textContent,
                                        idx,
                                      )
                                    }
                                    className="text-sm text-blue-600"
                                  >
                                    {exp.companyName}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-600 italic flex flex-col items-end">
                                  <div className="flex items-center">
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      onBlur={(e) =>
                                        handleInputChange(
                                          "experience",
                                          "date",
                                          e.target.textContent,
                                          idx,
                                        )
                                      }
                                    >
                                      {exp.date}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      onBlur={(e) =>
                                        handleInputChange(
                                          "experience",
                                          "companyLocation",
                                          e.target.textContent,
                                          idx,
                                        )
                                      }
                                    >
                                      {exp.companyLocation}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "experience",
                                  "accomplishment",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-xs text-gray-700 whitespace-pre-line"
                            >
                              {exp.accomplishment}
                            </div>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("experience", idx)
                                }
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                              >
                                Remove Experience
                              </button>
                            )}
                          </div>
                        ))}
                        {showButtons && (
                          <button
                            onClick={() => handleAddSection("experience")}
                            className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                          >
                            Add Experience
                          </button>
                        )}
                      </div>
                    );
                  }
                  if (
                    section === "education" &&
                    sectionSettings.education.showEducation
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>EDUCATION</span>
                          {showButtons && activeSection === "education" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("education")}
                              aria-label="Open education settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        {resumeData.education.map((edu, idx) => (
                          <div key={idx} className="mb-3">
                            <h3
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "education",
                                  "degree",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-sm font-bold text-gray-900"
                            >
                              {edu.degree}
                            </h3>
                            <div className="flex justify-between">
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInputChange(
                                    "education",
                                    "institution",
                                    e.target.textContent,
                                    idx,
                                  )
                                }
                                className="text-sm text-gray-700"
                              >
                                {edu.institution}
                              </p>
                              <div className="text-xs text-gray-600 flex flex-col items-end">
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInputChange(
                                      "education",
                                      "duration",
                                      e.target.textContent,
                                      idx,
                                    )
                                  }
                                >
                                  {edu.duration}
                                </span>
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInputChange(
                                      "education",
                                      "location",
                                      e.target.textContent,
                                      idx,
                                    )
                                  }
                                >
                                  {edu.location}
                                </span>
                              </div>
                            </div>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("education", idx)
                                }
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Remove Education
                              </button>
                            )}
                          </div>
                        ))}
                        {showButtons && (
                          <button
                            onClick={() => handleAddSection("education")}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Add Education
                          </button>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="w-1/2 pl-4">
                {sectionsOrder.map((section) => {
                  if (
                    section === "skills" &&
                    sectionSettings.skills.showSkills
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>SKILLS</span>
                          {showButtons && activeSection === "skills" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("skills")}
                              aria-label="Open skills settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                          {resumeData.skills.map((skillCategory, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 p-2 rounded text-center"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "skills",
                                  "category",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                            >
                              {skillCategory.category}
                            </div>
                          ))}
                        </div>
                        {showButtons && (
                          <div className="mt-2">
                            {resumeData.skills.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAddSkillItem(idx)}
                                className="text-xs text-blue-500 hover:text-blue-700 mr-2"
                              >
                                Add Skill
                              </button>
                            ))}
                            <button
                              onClick={() => handleAddSection("skills")}
                              className="text-xs text-blue-500 hover:text-blue-700"
                            >
                              Add Skill Category
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  if (
                    section === "achievements" &&
                    sectionSettings.achievements.showAchievements
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>KEY ACHIEVEMENTS</span>
                          {showButtons && activeSection === "achievements" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                handleSettingsClick("achievements")
                              }
                              aria-label="Open achievements settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        {resumeData.achievements.map((achievement, idx) => (
                          <div key={idx} className="mb-3 flex">
                            <div className="mr-2 text-blue-500">
                              {idx === 0 && <span>🏆</span>}
                              {idx === 1 && <span>💰</span>}
                              {idx === 2 && <span>📚</span>}
                              {idx === 3 && <span>🏅</span>}
                              {idx > 3 && <span>🌟</span>}
                            </div>
                            <div>
                              <h3
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInputChange(
                                    "achievements",
                                    "keyAchievements",
                                    e.target.textContent,
                                    idx,
                                  )
                                }
                                className="text-sm font-bold text-gray-900"
                              >
                                {achievement.keyAchievements}
                              </h3>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInputChange(
                                    "achievements",
                                    "describe",
                                    e.target.textContent,
                                    idx,
                                  )
                                }
                                className="text-xs text-gray-700"
                              >
                                {achievement.describe}
                              </p>
                            </div>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("achievements", idx)
                                }
                                className="text-xs text-red-500 hover:text-red-700 ml-2"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        {showButtons && (
                          <button
                            onClick={() => handleAddSection("achievements")}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Add Achievement
                          </button>
                        )}
                      </div>
                    );
                  }
                  if (
                    section === "languages" &&
                    sectionSettings.languages.showLanguages
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>LANGUAGES</span>
                          {showButtons && activeSection === "languages" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("languages")}
                              aria-label="Open languages settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        {resumeData.languages.map((lang, idx) => (
                          <div key={idx} className="mb-3">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <p
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInputChange(
                                      "languages",
                                      "name",
                                      e.target.textContent,
                                      idx,
                                    )
                                  }
                                  className="text-sm font-bold text-gray-900"
                                >
                                  {lang.name}
                                </p>
                                {showButtons ? (
                                  <select
                                    value={lang.level}
                                    onChange={(e) =>
                                      handleLanguageLevelChange(
                                        idx,
                                        e.target.value,
                                      )
                                    }
                                    className="text-xs text-gray-600 border rounded p-1"
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Native">Native</option>
                                  </select>
                                ) : (
                                  <p className="text-xs text-gray-600">
                                    {lang.level}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < lang.dots
                                        ? "bg-gray-900"
                                        : "bg-gray-300"
                                    }`}
                                  ></span>
                                ))}
                              </div>
                            </div>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("languages", idx)
                                }
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                              >
                                Remove Language
                              </button>
                            )}
                          </div>
                        ))}
                        {showButtons && (
                          <button
                            onClick={() => handleAddSection("languages")}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Add Language
                          </button>
                        )}
                      </div>
                    );
                  }
                  if (
                    section === "projects" &&
                    sectionSettings.projects.showProjects
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>PROJECTS</span>
                          {showButtons && activeSection === "projects" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("projects")}
                              aria-label="Open projects settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        {resumeData.projects.map((project, idx) => (
                          <div key={idx} className="mb-3">
                            <h3
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "projects",
                                  "title",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-sm font-bold text-gray-900"
                            >
                              {project.title}
                            </h3>
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "projects",
                                  "description",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-xs text-gray-700"
                            >
                              {project.description}
                            </p>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("projects", idx)
                                }
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                              >
                                Remove Project
                              </button>
                            )}
                          </div>
                        ))}
                        {showButtons && (
                          <button
                            onClick={() => handleAddSection("projects")}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Add Project
                          </button>
                        )}
                      </div>
                    );
                  }
                  if (
                    section === "courses" &&
                    sectionSettings.courses.showCourses
                  ) {
                    return (
                      <div className="mb-6" key={section}>
                        <h2 className="text-md font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-2 flex items-center justify-between">
                          <span>COURSES</span>
                          {showButtons && activeSection === "courses" && (
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleSettingsClick("courses")}
                              aria-label="Open courses settings"
                            >
                              ⚙
                            </button>
                          )}
                        </h2>
                        {resumeData.courses.map((course, idx) => (
                          <div key={idx} className="mb-3">
                            <h3
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "courses",
                                  "title",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-sm font-bold text-gray-900"
                            >
                              {course.title}
                            </h3>
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInputChange(
                                  "courses",
                                  "description",
                                  e.target.textContent,
                                  idx,
                                )
                              }
                              className="text-xs text-gray-700"
                            >
                              {course.description}
                            </p>
                            {showButtons && (
                              <button
                                onClick={() =>
                                  handleRemoveSection("courses", idx)
                                }
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                              >
                                Remove Course
                              </button>
                            )}
                          </div>
                        ))}
                        {showButtons && (
                          <button
                            onClick={() => handleAddSection("courses")}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Add Course
                          </button>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            {branding && (
              <div className="text-[8px] text-gray-400 text-right mt-auto pt-4">
                Aditya Tiwary
              </div>
            )}
          </div>
        </div>
      </div>
      {activeSection === "rearrange" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Rearrange Sections
            </h3>
            {sectionsOrder.map((section, idx) => (
              <div
                key={section}
                className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium text-gray-800">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveSectionUp(idx)}
                    className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    disabled={idx === 0}
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => handleMoveSectionDown(idx)}
                    className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    disabled={idx === sectionsOrder.length - 1}
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveSection(null)}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {activeSection && activeSection !== "rearrange" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
              Settings
            </h3>
            <div className="space-y-3">
              {Object.keys(sectionSettings[activeSection]).map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {key
                      .replace("show", "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </span>
                  <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      id={`toggle-${key}`}
                      className="sr-only"
                      checked={sectionSettings[activeSection][key]}
                      onChange={() => handleSettingChange(activeSection, key)}
                    />
                    <label
                      htmlFor={`toggle-${key}`}
                      className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                        sectionSettings[activeSection][key]
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white ${
                          sectionSettings[activeSection][key]
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </label>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveSection(null)}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showShareNotification && <ShareNotification />}
      {isLoading && <LoadingScreen />}
      {isDownloading && <DownloadPreloader />}
      {showAIErrorPopup && <AIErrorPopup />}
      {showUploadErrorPopup && <UploadErrorPopup />}
      {showColorPicker && <ColorPickerPopup />}
    </div>
  );
};

export default ResumeEditor;
