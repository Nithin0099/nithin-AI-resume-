import { useState, useEffect } from "react";
import { FaPlus, FaDownload, FaHistory, FaBars, FaTimes, FaSave, FaRobot } from "react-icons/fa";

const Sidebar = ({ onAddSection, onSelectSection, handleDownloadPDF, saveResume }) => {
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
        className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md lg:hidden"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      {showSidebar && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`sidebar ${showSidebar ? "show" : ""}`}
        style={{ width: "20rem", minWidth: "20rem" }} // Inline style as a fallback
      >
        <button
          className="absolute top-3 right-3 text-black lg:hidden"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col h-full p-4 space-y-3">
          <h2 className="text-lg font-bold hidden lg:block">Resume Tools</h2>
          <NavItem icon={<FaSave />} label="Save Resume" onClick={saveResume} />
          <NavItem icon={<FaDownload />} label="Download" onClick={handleDownloadPDF} />
          <NavItem icon={<FaRobot />} label="AI Assistant" onClick={() => onSelectSection("ai_assistant")} />
        </div>
      </div>
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
      <span className="ml-2 whitespace-normal">{label}</span> {/* Allow text wrapping */}
    </div>
  );
};

export default Sidebar;