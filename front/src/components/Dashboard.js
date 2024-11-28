// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GymRecommendations from './GymRecommendations';
import WorkoutPlanner from './WorkoutPlanner';
import { axiosInstance } from '../services/authService';

// Initialize empty form data structure
const initialFormData = {
  age: '',
  height: '',
  weight: '',
  experience: '',
  preferredTime: '',
  daysPerWeek: '',
  goals: [],
  medicalConditions: ''
};

const Dashboard = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [userData, setUserData] = useState(null);

  const location = useLocation();

  // useEffect(() => {
  //     const storedUserData = JSON.parse(localStorage.getItem('user'));
  //       console.log(storedUserData);
  //       setUserData(storedUserData);
  //     })
  //       .catch(error => {console.error(error);});
  //   }, []);

  useEffect(() => {
    // Try to get data from location state or localStorage
    const savedData = location.state?.formData || localStorage.getItem('user') || '{}';
    console.log({ savedData });

    // Merge saved data with initial structure to ensure all fields exist
    setFormData(prevData => ({
      ...initialFormData,
      ...savedData
    }));
  }, [location.state]);

  const updateWorkoutPlan = (exercises) => {
    setWorkoutPlan(exercises);
    // Optionally save to localStorage
    localStorage.setItem('workoutPlan', JSON.stringify(exercises));
  };

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            לא נמצאו נתונים. אנא מלא את הטופס תחילה.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            הדשבורד האישי שלך
          </h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">הפרטים שלך</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">גיל:</span> {formData.age || 'לא צוין'}
              </div>
              <div>
                <span className="font-medium">גובה:</span> {formData.height ? `${formData.height} ס"מ` : 'לא צוין'}
              </div>
              <div>
                <span className="font-medium">משקל:</span> {formData.weight ? `${formData.weight} ק"ג` : 'לא צוין'}
              </div>
              <div>
                <span className="font-medium">ניסיון:</span> {formData.experience || 'לא צוין'}
              </div>
              <div>
                <span className="font-medium">זמן מועדף:</span> {formData.preferredTime || 'לא צוין'}
              </div>
              <div>
                <span className="font-medium">תדירות אימונים:</span> {formData.daysPerWeek || 'לא צוין'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">מטרות:</span>{' '}
                {formData.goals?.length > 0 ? formData.goals.join(', ') : 'לא צוינו'}
              </div>
              {formData.medicalConditions && (
                <div className="col-span-2">
                  <span className="font-medium">מצב רפואי:</span>{' '}
                  {formData.medicalConditions}
                </div>
              )}
            </div>
          </div>

          {/* Workout Planner Component */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <WorkoutPlanner
              formData={formData}
              workoutPlan={workoutPlan}
              onUpdatePlan={updateWorkoutPlan}
            />
          </div>

          {/* קומפוננטת ההמלצות */}
          <GymRecommendations formData={formData} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;