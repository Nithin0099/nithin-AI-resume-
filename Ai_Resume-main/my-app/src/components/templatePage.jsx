import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WithoutAiTemp from './templateCards';
import { useNavigate } from 'react-router-dom';

const WithoutAi = () => {
  const [isHovered, setIsHovered] = useState(false);

  // const handleBackClick = () => {
  //   window.history.back();
  // };
  const navigate = useNavigate();

const handleBackClick = () => {
  navigate(-1); // Go back to the previous page
   navigate('/home');
};


  // Profile image URL
  const profileImage =
    'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*mAIfR-lj6YkUEI7AaP6CGg.jpeg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-indigo-300 to-white p-4 py-12 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="max-w-5xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="mb-8 flex items-center text-white hover:text-pink-100 transition-all duration-300 ease-in-out focus:outline-none p-3 rounded-full shadow-xl bg-pink-600 hover:bg-pink-700 backdrop-blur-lg"
          aria-label="Go back"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </motion.button>

        {/* Content Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>

          <motion.div
            className="flex-shrink-0 mb-6 md:mb-0 relative"
            whileHover={{ scale: 1.07 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-full blur-md opacity-30 scale-125"></div>
            <img
              src={profileImage}
              alt="User Avatar"
              className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl relative z-10 border-4 border-white"
            />
            <motion.div
              className="absolute inset-0 border-4 border-pink-500 rounded-full z-0"
              animate={{
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 0 : 1,
              }}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            ></motion.div>
          </motion.div>

          <div className="text-center md:text-left z-10">
            <motion.h2
              className="text-5xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Design Your Dream Resume
            </motion.h2>

            <motion.p
              className="text-xl text-gray-700 mb-8 max-w-md mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Captivate employers with a stunning, professional resume that
              showcases your unique talents and experience. Stand out from the
              crowd with our eye-catching templates.
            </motion.p>

            <motion.button
              className="text-white px-8 py-4 rounded-lg text-lg shadow-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-500"></span>
              <span className="relative flex items-center justify-center">
                Get Started
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Template Selection */}
        <div className="mt-16">
          <WithoutAiTemp />
        </div>
      </motion.div>
    </div>
  );
};

export default WithoutAi;
