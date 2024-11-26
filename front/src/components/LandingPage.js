import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

const LandingPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // פונקציה לבדיקת סטטוס המשתמש
    const checkAuthStatus = () => {
      const currentUser = authService.getCurrentUser();
      console.log('Current user from authService:', currentUser);
      setUser(currentUser);
    };

    // בדיקה ראשונית
    checkAuthStatus();

    // הוספת מאזין לשינויים ב-localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'auth_token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // מאזין מיוחד לשינויים פנימיים
    window.addEventListener('auth-change', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', checkAuthStatus);
    };
  }, []);

  // Debug: בדיקת מצב הסטייט
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  // רנדור של תפריט למשתמש מחובר
  const LoggedInMenu = () => (
    <div className="flex items-center space-x-4 space-x-reverse">
      <div className="flex items-center">
        <UserCircle className="w-6 h-6 text-gray-600" />
        <span className="mr-2 text-gray-600">{user?.username || user?.name || 'משתמש'}</span>
      </div>
      <Link to="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200">
        אזור אישי
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200"
      >
        <LogOut className="w-5 h-5 ml-2" />
        התנתק
      </button>
    </div>
  );

  // רנדור של תפריט למשתמש לא מחובר
  const GuestMenu = () => (
    <div className="flex items-center space-x-4 space-x-reverse">
      <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200">
        התחברות
      </Link>
      <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
        הרשמה
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">GYM</span>
            {user ? <LoggedInMenu /> : <GuestMenu />}
          </div>
        </div>
      </nav>

      {/* Hero Section - שונה בהתאם למצב המשתמש */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-right">
            {user ? (
              <>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  ברוך הבא בחזרה, {user?.username || user?.name || 'משתמש'}!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  המשך את המסע שלך לעבר המטרות שלך
                </p>
                <Link 
                  to="/dashboard" 
                  className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
                >
                  המשך לאזור האישי
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  הדרך שלך להצלחה מתחילה כאן
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  מערכת מתקדמת למעקב אחר אימונים, תזונה והתקדמות אישית
                </p>
                <Link 
                  to="/register" 
                  className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
                >
                  התחל להתאמן עכשיו
                </Link>
              </>
            )}
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <img 
              src="/api/placeholder/600/400"
              alt="אימון"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">למה לבחור בנו?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">תוכנית אימונים אישית</h3>
              <p className="text-gray-600">תוכנית אימונים מותאמת אישית לפי המטרות והיכולות שלך</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">מעקב התקדמות</h3>
              <p className="text-gray-600">עקוב אחר ההתקדמות שלך עם גרפים וסטטיסטיקות מפורטות</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">ליווי מקצועי</h3>
              <p className="text-gray-600">צוות מאמנים מקצועי שילווה אותך לאורך כל הדרך</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - מוצג רק למשתמשים לא מחוברים */}
      {!user && (
        <section className="py-16 px-4 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              מוכנים להתחיל את המסע שלכם?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              הצטרפו עכשיו וקבלו חודש ראשון חינם!
            </p>
            <Link 
              to="/register" 
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              הצטרפו עכשיו
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GYM</h3>
              <p className="text-gray-400">המערכת המתקדמת ביותר למעקב אחר אימונים והתקדמות אישית</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">קישורים מהירים</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-200">אודות</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition duration-200">צור קשר</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition duration-200">מדיניות פרטיות</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">צור קשר</h3>
              <p className="text-gray-400">טלפון: 03-1234567</p>
              <p className="text-gray-400">דוא"ל: info@gym.co.il</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GYM. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;