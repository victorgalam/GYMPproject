import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/UserPanel';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister'; // ייבוא קומפוננטת הרישום של המשתמש
import Navbar from './components/Navbar'; 
import WorkoutVideos from './components/WorkoutVideos';
import Introduction from './components/Introduction'; 
import LocationsMap from './components/LocationsMap';
import LandingPage from './components/LandingPage';
import About from './components/About';
import Contact from './components/Contact';
import GymPersonalDetails from './components/GymPersonalDetails';
import GymRecommendations from './components/GymRecommendations';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <Router>
      <div>
        <Navbar />  {/* הוסף את הנאבבר כאן */}
        <Routes>
          <Route path="/workout-videos" element={<WorkoutVideos />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/UserPanel" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/locations" element={<LocationsMap />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gym-details" element={<GymPersonalDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal-details" element={<GymPersonalDetails />} />

          </Routes>
      </div>
    </Router>
  );
}

export default App;