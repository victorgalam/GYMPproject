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

  // תפריט למשתמש מחובר
  const AuthenticatedLinks = () => (
    <>
      <Link 
        to="/dashboard" 
        className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
      >
        אזור אישי
      </Link>
      {user?.role === 'admin' && (
        <Link 
          to="/admin/panel" 
          className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
        >
          ניהול
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="text-white hover:text-blue-200 transition duration-300 text-lg font-medium"
      >
        התנתק
      </button>
    </>
  );

  // תפריט למשתמש לא מחובר
  const GuestLinks = () => (
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
  );

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* לוגו או שם האתר */}
          <Link to="/" className="text-white text-xl font-bold">
            GYM
          </Link>

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
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {user ? (
              <>
                <span className="text-white font-medium">
                  שלום, {user.username || user.name || 'משתמש'}
                </span>
                <AuthenticatedLinks />
              </>
            ) : (
              <GuestLinks />
            )}
          </div>
        </div>

        {/* תפריט מובייל */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4 items-center">
              {user ? (
                <>
                  <span className="text-white font-medium">
                    שלום, {user.username || user.name || 'משתמש'}
                  </span>
                  <AuthenticatedLinks />
                </>
              ) : (
                <GuestLinks />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;