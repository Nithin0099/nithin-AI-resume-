import React from 'react';

import { useState } from "react";

const Sidebar1 = ({ onDownload, onSave, onShare, onEnhance, onRearrange }) => {
  const [showEnhanceOptions, setShowEnhanceOptions] = useState(false);

  return (
    <div className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <h2 className="text-lg font-bold mb-4">Resume Tools <span className="text-yellow-400">👑</span></h2>

      {/* AI Enhance Button */}
      <button
        onClick={() => setShowEnhanceOptions(!showEnhanceOptions)}
        className="w-full bg-blue-500 py-2 rounded mb-1"
      >
        AI Enhance
      </button>

      {/* Sub-buttons for Enhance Options */}
      {showEnhanceOptions && (
        <div className="ml-4 m-3 space-y-2">
          <button onClick={() => { onEnhance("profile"); }} className="w-full bg-blue-400 py-2 rounded">
            Enhance Profile
          </button>
          <button onClick={() => onEnhance("experience")} className="w-full bg-blue-400 py-2 rounded">Enhance Experience</button>
          <button onClick={() => onEnhance("projects")} className="w-full bg-blue-400 py-2 rounded">
            Enhance Projects
          </button>        
        </div>
      )}
      
      <button onClick={() => onSave()} className="w-full bg-green-500 py-2 rounded mb-2">Save PDF</button>
      <button onClick={() => { onSave(); onDownload(); }} className="w-full bg-green-500 py-2 rounded mb-2">Download PDF</button>
      <button onClick={onShare} className="w-full bg-green-500 py-2 rounded">Share Resume</button>
    </div>
  );
};

export default Sidebar1;