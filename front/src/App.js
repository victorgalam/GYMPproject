import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { authService } from './services/authService';

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Guest Route Component (רק למשתמשים לא מחוברים)
const GuestRoute = ({ children }) => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

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
          
          {/* Auth Routes - רק למשתמשים לא מחוברים */}
          <Route path="/login" element={
            <GuestRoute>
              <UserLogin />
            </GuestRoute>
          } />
          <Route path="/register" element={
            <GuestRoute>
              <UserRegister />
            </GuestRoute>
          } />
          <Route path="/admin" element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          } />
          
          {/* User Routes - רק למשתמשים מחוברים */}
          <Route path="/user-panel" element={
            <ProtectedRoute>
              <UserPanel />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/personal-details" element={
            <ProtectedRoute>
              <GymPersonalDetails />
            </ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <GymRecommendations />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } />
          <Route path="/workout-videos" element={
            <ProtectedRoute>
              <WorkoutVideos />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/panel" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;