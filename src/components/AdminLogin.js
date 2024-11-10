import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'password') { // בדיקת שם משתמש וסיסמה של האדמין
      navigate('/admin/panel'); // מעבר לדף הניהול
    } else {
      alert('שם משתמש או סיסמה אינם נכונים');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>כניסת אדמין</h2>
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

export default AdminLogin;
