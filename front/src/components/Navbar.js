// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // בדיקת משתמש מחובר בטעינת הקומפוננט
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    // שימוש בפונקציית ההתנתקות של authService
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* כפתור תפריט למובייל */}
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

          {/* תפריט דסקטופ */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
            >
              דף הבית
            </Link>
            
            {user ? (
              // תצוגה למשתמש מחובר
              <>
                <span className="text-white font-medium">
                  שלום, {user.username || user.name || 'משתמש'}
                </span>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
                  >
                    ניהול
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
                >
                  אזור אישי
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
                >
                  התנתק
                </button>
              </>
            ) : (
              // תצוגה למשתמש לא מחובר
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
                >
                  התחברות
                </Link>
                <Link 
                  to="/register" 
                  className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>
        </div>

        {/* תפריט מובייל */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 text-right">
            <Link 
              to="/" 
              className="block text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
            >
              דף הבית
            </Link>
            
            {user ? (
              // תצוגת מובייל למשתמש מחובר
              <>
                <div className="block text-white px-3 py-2 text-base font-medium">
                  שלום, {user.username || user.name || 'משתמש'}
                </div>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="block text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
                  >
                    ניהול
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="block text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
                >
                  אזור אישי
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-right text-white hover:bg-blue-700 rounded-md px-3 py-2 text-base font-medium transition duration-300"
                >
                  התנתק
                </button>
              </>
            ) : (
              // תצוגת מובייל למשתמש לא מחובר
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;