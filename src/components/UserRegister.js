import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // כאן תוכל לשמור את המשתמשים בבסיס נתונים או לשלוח לשרת
    console.log('User Registered:', { username, password, email });

    // לאחר רישום מוצלח, יש לעבור לדף הבית של המשתמש
    navigate('/home');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>רישום משתמש רגיל</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">הירשם</button>
      </form>
    </div>
  );
}

export default UserRegister;
