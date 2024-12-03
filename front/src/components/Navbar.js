import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gray-100 shadow-md py-4 px-6 flex items-center justify-between rtl">
      <div className="flex items-center space-x-reverse space-x-4">
        {user ? (
          <>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-red-50"
            >
              התנתק
            </button>
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              דף הבית
            </Link>
            <Link 
              to="/videos" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              סרטוני אימון
            </Link>
            <Link 
              to="/locations" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              מיקומים
            </Link>
            <Link 
              to="/user-panel" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              מערכת אימונים
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              התחברות
            </Link>
            <Link 
              to="/register" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              הרשמה
            </Link>
          </>
        )}
      </div>

      {user && (
        <div className="flex items-center space-x-reverse space-x-3">
          <div className="flex items-center space-x-reverse space-x-2">
            <Link 
              to="/personal-details"
              className="text-gray-800 font-medium hover:text-gray-600 transition-colors duration-300 cursor-pointer"
            >
              {user.username || user.name || 'משתמש'}
            </Link>
            <Link
              to="/personal-details"
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold cursor-pointer hover:bg-gray-400 transition-colors duration-300"
            >
              {user.username ? user.username.charAt(0).toUpperCase() : 'א'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;