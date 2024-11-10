import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // בדיקת שם משתמש וסיסמה - תוכל לשנות את הערכים בהתאם לצורך שלך
    if (username === 'user' && password === 'userpassword') {
      navigate('/home'); // מעבר לדף הבית של המשתמש
    } else {
      alert('שם משתמש או סיסמה אינם נכונים');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>כניסת משתמש רגיל</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}

export default UserLogin;
