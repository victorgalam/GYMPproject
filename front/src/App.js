import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';

// Auth Components
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import AdminLogin from './components/AdminLogin';

// Main Pages
import LandingPage from './components/LandingPage';
import About from './components/About';
import Contact from './components/Contact';
import Introduction from './components/Introduction';

// User Dashboard Components
import UserPanel from './components/UserPanel';
import Dashboard from './components/Dashboard';
import GymPersonalDetails from './components/GymPersonalDetails';
import GymRecommendations from './components/GymRecommendations';
import CalendarPage from './components/CalendarPage';

// Admin Components
import AdminPanel from './components/AdminPanel';

// Feature Components
import WorkoutVideos from './components/WorkoutVideos';
import LocationsMap from './components/LocationsMap';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/locations" element={<LocationsMap />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin" element={<AdminLogin />} />
          
          {/* User Routes */}
          <Route path="/user-panel" element={<UserPanel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal-details" element={<GymPersonalDetails />} />
          <Route path="/recommendations" element={<GymRecommendations />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/workout-videos" element={<WorkoutVideos />} />
          
          {/* Admin Routes */}
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;