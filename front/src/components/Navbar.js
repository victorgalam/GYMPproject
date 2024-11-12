import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link 
              to="/register" 
              className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
            >
              הרשמה
            </Link>
            <Link 
              to="/login" 
              className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
            >
              התחברות
            </Link>
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
            >
              דף הבית
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 text-right">
            <Link 
              to="/" 
              className="block text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
            >
              דף הבית
            </Link>
            <Link 
              to="/login" 
              className="block text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
            >
              התחברות
            </Link>
            <Link 
              to="/register" 
              className="block text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
            >
              הרשמה
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;