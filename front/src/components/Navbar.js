import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { FaCloud, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

// Mobile Navbar Component
const MobileNavbar = ({ user, handleLogout, isMobileMenuOpen, toggleMobileMenu }) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden">
      <nav className="bg-slate-800 shadow-md py-4 px-6 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        {/* Logout button on left */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 flex items-center mr-4"
        >
          <FaSignOutAlt className="text-lg" />
        </button>

        {/* Hamburger and Cloud Logo on right */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-4">
            <FaCloud className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white mr-2">Cloud GYM</span>
          </Link>
          
          <button 
            onClick={toggleMobileMenu} 
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <div 
        className={`fixed top-0 right-0 w-[250px] h-full bg-slate-800 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 pt-20`}
      >
        <div className="px-6">
          {user ? (
            <div className="flex flex-col space-y-4">
              {user?.role === "admin" && (
                <Link 
                  to="/admin/panel" 
                  className="text-gray-300 hover:text-white px-2 w-full text-center"
                  onClick={toggleMobileMenu}
                >
                  ניהול אתר
                </Link>
              )}
              <Link 
                to="/videos" 
                className="text-gray-300 hover:text-white px-2 w-full text-center"
                onClick={toggleMobileMenu}
              >
                סרטוני אימון
              </Link>
              <Link 
                to="/locations" 
                className="text-gray-300 hover:text-white px-2 w-full text-center"
                onClick={toggleMobileMenu}
              >
                מיקומים
              </Link>
              <Link 
                to="/user-panel" 
                className="text-gray-300 hover:text-white px-2 w-full text-center"
                onClick={toggleMobileMenu}
              >
                מערכת אימונים
              </Link>
              <button 
                className="flex items-center space-x-2 space-x-reverse bg-slate-700 hover:bg-slate-600 rounded-full px-4 py-2 w-full justify-center"
                onClick={() => {
                  navigate('/personal-details');
                  toggleMobileMenu();
                }}
              >
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'א'}
                </div>
                <span className="text-white mr-2">{user?.username || user?.name}</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="text-red-400 hover:text-red-300 flex items-center justify-center w-full py-2"
              >
                <span>התנתק</span>
                <FaSignOutAlt className="mr-2 text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link 
                to="/register"
                className="text-white hover:text-blue-200 text-center py-2"
                onClick={toggleMobileMenu}
              >
                הרשמה
              </Link>
              <Link 
                to="/login"
                className="text-white hover:text-blue-200 text-center py-2"
                onClick={toggleMobileMenu}
              >
                התחברות
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

// Desktop Navbar Component
const DesktopNavbar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="hidden md:flex items-center justify-between p-4 bg-slate-800 text-white">
      {/* Logout button on far left */}
      <div className="flex items-center">
        {user && (
          <button 
            onClick={handleLogout} 
            className="text-red-500 hover:text-red-400 transition-colors duration-300"
          >
            התנתק
          </button>
        )}
      </div>

      {/* Navigation items on right */}
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <div className="flex items-center">
              <div className="flex items-center space-x-4 space-x-reverse">
                {user?.role === "admin" && (
                  <>
                    <Link to="/admin/panel" className="text-gray-300 hover:text-white px-2">ניהול אתר</Link>
                    <div className="h-4 w-px bg-gray-600"></div>
                  </>
                )}
                <Link to="/videos" className="text-gray-300 hover:text-white px-2">סרטוני אימון</Link>
                <div className="h-4 w-px bg-gray-600"></div>
                <Link to="/locations" className="text-gray-300 hover:text-white px-2">מיקומים</Link>
                <div className="h-4 w-px bg-gray-600"></div>
                <Link to="/user-panel" className="text-gray-300 hover:text-white px-2">מערכת אימונים</Link>
              </div>
              <button 
                className="flex items-center space-x-2 space-x-reverse bg-slate-700 hover:bg-slate-600 rounded-full px-4 py-2"
                onClick={() => navigate('/personal-details')}
              >
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'א'}
                </div>
                <span className="text-white mr-2">{user?.username || user?.name}</span>
              </button>
              <Link to="/" className="flex items-center">
                <FaCloud className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white mr-2">Cloud GYM</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

// Main Navbar Component
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCurrentUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    checkCurrentUser();

    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkCurrentUser();
      }
    };

    const handleAuthChange = () => {
      checkCurrentUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('auth-change'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return user ? (
    <>
      <MobileNavbar 
        user={user} 
        handleLogout={handleLogout} 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      <DesktopNavbar 
        user={user} 
        handleLogout={handleLogout} 
      />
    </>
  ) : (
    <nav className="bg-slate-800 shadow-md py-4 px-6 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
      <div className="flex items-center space-x-reverse space-x-4">
        <Link 
          to="/register" 
          className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-300"
        >
          הרשמה
        </Link>
        <div className="w-px h-6 bg-slate-600"></div>
        <Link 
          to="/login"
          className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-300 flex items-center"
        >
          התחברות
        </Link>
      </div>
      <div className="flex items-center space-x-reverse space-x-4">
        <Link 
          to="/" 
          className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-300 flex items-center space-x-reverse space-x-2"
        >
          <FaCloud className="text-xl" />
          <span>Cloud GYM</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;