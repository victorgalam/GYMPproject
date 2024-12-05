import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { FaCloud, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
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
console.log({user});

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

  return (
    <nav className="bg-slate-800 shadow-md py-4 px-6 fixed top-0 left-0 right-0 z-50 flex items-center justify-between rtl">
      <div className="flex-1 flex items-center justify-between">
        {user ? (
          <>
            {/* Left side */}
            <div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 flex items-center"
              >
                <span>התנתק</span>
                <FaSignOutAlt className="mr-2 text-lg" />
              </button>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-6 space-x-reverse">
              {user?.role==="admin" && <Link to="/admin/panel" className="text-gray-300 hover:text-white" >ניהול אתר </Link>}
              <Link to="/videos" className="text-gray-300 hover:text-white">סרטוני אימון</Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <Link to="/locations" className="text-gray-300 hover:text-white">מיקומים</Link>
              <Link to="/user-panel" className="text-gray-300 hover:text-white">מערכת אימונים</Link>
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
        ) : (
          <>
            <div className="flex items-center space-x-reverse space-x-4">
              <Link 
                to="/register" 
                className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-300"
              >
                הרשמה
              </Link>
              <div className="w-px h-6 bg-slate-600"></div>
              <div className="relative">
                <button 
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-300 flex items-center"
                >
                  התחברות
                </button>
                {showLoginDropdown && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        התחברות משתמש
                      </Link>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          navigate('/admin');
                          setShowLoginDropdown(false);
                        }}
                      >
                        התחברות מנהל
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;