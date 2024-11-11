import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister'; // ייבוא קומפוננטת הרישום של המשתמש
import Navbar from './components/Navbar'; 
import WorkoutVideos from './components/WorkoutVideos';
import Introduction from './components/Introduction'; 


function App() {
  return (
    <Router>
      <div>
        <Navbar />  {/* הוסף את הנאבבר כאן */}
        <Routes>
          <Route path="/workout-videos" element={<WorkoutVideos />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/introduction" element={<Introduction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;