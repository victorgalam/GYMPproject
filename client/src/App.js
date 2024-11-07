import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister'; // ייבוא קומפוננטת הרישום של המשתמש



function App() {
  return (
    <Router>
      <Routes>

      <Route path="/login" element={<UserLogin />} /> {/* דף התחברות */}
        {/* מסלול לדף הבית של משתמש רגיל */}
        <Route path="/" element={<Home />} />
        
        {/* מסלול לדף התחברות של אדמין */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* מסלול לפאנל ניהול אדמין (רק אם האדמין התחבר) */}
        <Route path="/admin/panel" element={<AdminPanel />} />

        <Route path="/register" element={<UserRegister />} /> {/* רישום משתמש רגיל */}

      </Routes>
    </Router>
  );
}

export default App;