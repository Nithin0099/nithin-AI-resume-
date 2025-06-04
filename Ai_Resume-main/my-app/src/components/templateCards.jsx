import React, { useState } from 'react';
import { motion } from 'framer-motion';
import temp1 from '../images/temp1.png';
import temp2 from '../images/temp2.png';
import Temp3 from '../images/Temp3.jpg';
import temp4 from '../images/temp4.png';
import temp5 from '../images/temp5.jpg';
import temp6 from '../images/temp6.png';
import temp7 from '../images/temp7.png';
import temp8 from '../images/temp8.jpg';
import temp9 from '../images/temp9.jpg';
import { useNavigate } from 'react-router-dom';
const WithoutAiTemp = ({ setActiveStep }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Classic',
      preview: temp1, // Use imported image
      description: 'Timeless elegance for traditional industries',
      url: '/temp1'
    },
    {
      id: 2,
      name: 'Creative',
      preview: temp2,
      description: 'Stand out with unique flair and personality',
      url: '/temp2'
    },
    {
      id: 3,
      name: 'Modern',
      preview: Temp3,
      description: 'Clean, contemporary design for the digital age',
      url: '/temp3'
    },
    {
      id: 4,
      name: 'Modern',
      preview: temp4,
      description: 'Clean, contemporary design for the digital age',
      url: '/temp4'
    },
    {
      id: 5,
      name: 'Tech Professional',
      preview: temp5,
      description: 'Sleek design for full-stack developers and tech experts',
      url: '/Temp5'
    },
    {
      id: 6,
      name: 'Tech Leader',
      preview: temp6,
      description: 'Professional design tailored for senior tech experts and team leaders',
      url: '/Temp6'
    },
    {
      id: 7,
      name: 'Design Innovator',
      preview: temp7,
      description: 'Vibrant layout for graphic designers showcasing creative excellence',
      url: '/Temp7'
    },
    {
      id: 8,
      name: 'Design Innovator',
      preview: temp8,
      description: 'Vibrant layout for graphic designers showcasing creative excellence',
      url: '/Temp8'
    },
    {
      id: 9,
      name: 'Design Innovator',
      preview: temp9,
      description: 'Vibrant layout for graphic designers showcasing creative excellence',
      url: '/Temp9'
    },
    {
      id: 10,
      name: 'Design Innovator',
      preview: temp9,
      description: 'Vibrant layout for graphic designers showcasing creative excellence',
      url: '/try'
    }
  ];

  // const handleSelectTemplate = (template) => {
  //   setSelectedTemplate(template.id);
  //   window.location.href = template.url; // Navigate to the template URL
  // };
  const navigate = useNavigate();  // 
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    navigate(template.url); // 
  };

  return (
    <div className="mt-16">
      <motion.h3 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-3 text-center tracking-wide bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent"
      >
        Choose Your Perfect Template
      </motion.h3>
      <p className="text-lg text-center text-indigo-200 mb-12 max-w-2xl mx-auto">
        Select a design that showcases your professional identity and captures attention
      </p>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className="relative group cursor-pointer overflow-hidden rounded-xl border ring-2 ring-indigo-300/30 shadow-lg"
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            <div className="relative overflow-hidden rounded-xl">
              <motion.img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 transform"
                animate={hoveredTemplate === template.id ? { scale: 1.1 } : { scale: 1 }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h4 className="text-xl font-bold text-white">{template.name}</h4>
              <p className="text-white/80 text-sm mb-3">{template.description}</p>
              <motion.button
                onClick={() => handleSelectTemplate(template)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
              </motion.button>
            </div>
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WithoutAiTemp;
