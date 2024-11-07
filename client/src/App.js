import './App.css';
import React, { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // מצב התחברות
  const [activeSection, setActiveSection] = useState('registers'); // קובע איזו לשונית פעילה

  // פונקציית התחברות
  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('שם משתמש או סיסמה אינם נכונים');
    }
  };

  // שינוי לשונית
  const showSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="container mt-5" dir="rtl">
      {!isLoggedIn ? (
        // דף הכניסה
        <div className="row justify-content-center">
          <div className="col-md-4">
            <h3 className="text-center">כניסת אדמין</h3>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">שם משתמש</label>
                <input type="text" className="form-control" name="username" placeholder="הכנס שם משתמש" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">סיסמה</label>
                <input type="password" className="form-control" name="password" placeholder="הכנס סיסמה" required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">התחבר</button>
            </form>
          </div>
        </div>
      ) : (
        // פאנל ניהול
        <div>
          <h2 className="text-center">דף ניהול</h2>
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'registers' ? 'active' : ''}`} onClick={() => showSection('registers')}>
                Registers
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'users' ? 'active' : ''}`} onClick={() => showSection('users')}>
                Users
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'exercises' ? 'active' : ''}`} onClick={() => showSection('exercises')}>
                Exercises
              </button>
            </li>
          </ul>

          {/* תוכן האזורים השונים */}
          <div className="mt-4">
            {activeSection === 'registers' && (
              <div>
                <h4>רשומות</h4>
                <p>כאן תוכל לנהל את הרשומות.</p>
              </div>
            )}
            {activeSection === 'users' && (
              <div>
                <h4>משתמשים</h4>
                <p>כאן תוכל לנהל את המשתמשים.</p>
              </div>
            )}
            {activeSection === 'exercises' && (
              <div>
                <h4>תרגילים</h4>
                <p>כאן תוכל לנהל את התרגילים.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
