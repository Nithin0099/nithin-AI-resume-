import { useState, useEffect } from "react";
import { FaPlus, FaDownload, FaHistory, FaBars, FaTimes, FaRobot } from "react-icons/fa";

const Sidebar2 = ({ onAddSection, onSelectSection, handleDownloadPDF }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

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

  const sections = [
    {
      id: "languages",
      title: "LANGUAGES",
      content: (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">English</span>
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              </div>
              <span className="text-sm text-gray-600">Proficient</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Spanish</span>
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              </div>
              <span className="text-sm text-gray-600">Advanced</span>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "projects",
      title: "PROJECTS",
      content: (
        <>
          <div className="space-y-4">
            <div className="border-l-4 border-gray-800 pl-4">
              <strong className="block text-lg">Tesla Model S for Kids</strong>
              <div className="text-sm text-gray-600">01/2015 - 04/2016</div>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-700">
                <li>Designed a kid-friendly Model S car in collaboration with Tesla.</li>
                <li>Shot promotional videos and photography for marketing.</li>
                <li>Developed the packaging and branding for the product.</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md lg:hidden"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {showSidebar && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${showSidebar ? "show" : ""}`}
        style={{ width: "20rem", minWidth: "20rem" }} // Inline style as a fallback
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-3 right-3 text-black lg:hidden"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col h-full p-4 space-y-3">
          <h2 className="text-lg font-bold hidden lg:block">Resume Tools</h2>
          <NavItem icon={<FaPlus />} label="Add Section" onClick={() => setShowAddSectionModal(true)} />
          <NavItem icon={<FaDownload />} label="Download" onClick={handleDownloadPDF} />
          <NavItem icon={<FaRobot />} label="AI Assistant" onClick={() => onSelectSection("ai_assistant")} />
          <NavItem icon={<FaHistory />} label="History" onClick={() => onSelectSection("history")} />
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddSectionModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowAddSectionModal(false)}
            >
              ❌
            </button>
            <h2 className="text-xl font-semibold mb-2">Add a new section</h2>
            <p className="text-gray-600 text-sm mb-4">Click on a section to add it to your resume</p>
            <div className="grid grid-cols-1 gap-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    onAddSection(section.id);
                    setShowAddSectionModal(false);
                  }}
                >
                  <h3 className="font-medium text-gray-800">{section.title}</h3>
                  <div className="mt-2 text-gray-600">{section.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => {
  return (
    <div
      className="flex items-center p-3 rounded-lg cursor-pointer transition duration-200 hover:bg-white hover:text-black"
      onClick={onClick}
    >
      {icon}
      <span className="ml-2 whitespace-normal">{label}</span>
    </div>
  );
};

export default Sidebar2;