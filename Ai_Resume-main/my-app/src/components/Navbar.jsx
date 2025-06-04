import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold cursor-pointer">
              AI Resume Builder
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/Signup" 
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                SignUp
              </Link>
              <a 
                href="/login" 
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                SignIn
              </a>
             
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="#home" 
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a 
              href="#about" 
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </a>
            <a 
              href="#resume" 
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Resume
            </a>
            <a 
              href="#login" 
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              SignIn
            </a>
           
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
