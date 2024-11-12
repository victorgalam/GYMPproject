// Dashboard.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import GymRecommendations from './GymRecommendations';

const Dashboard = () => {
  const location = useLocation();
  // נסה לקבל את הנתונים מה-state או מה-localStorage
  const formData = location.state?.formData || JSON.parse(localStorage.getItem('gymUserData') || '{}');

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
                <span className="font-medium">גיל:</span> {formData.age}
              </div>
              <div>
                <span className="font-medium">גובה:</span> {formData.height} ס"מ
              </div>
              <div>
                <span className="font-medium">משקל:</span> {formData.weight} ק"ג
              </div>
              <div>
                <span className="font-medium">ניסיון:</span> {formData.experience}
              </div>
              <div>
                <span className="font-medium">זמן מועדף:</span> {formData.preferredTime}
              </div>
              <div>
                <span className="font-medium">תדירות אימונים:</span> {formData.daysPerWeek}
              </div>
              <div className="col-span-2">
                <span className="font-medium">מטרות:</span>{' '}
                {formData.goals.join(', ')}
              </div>
              {formData.medicalConditions && (
                <div className="col-span-2">
                  <span className="font-medium">מצב רפואי:</span>{' '}
                  {formData.medicalConditions}
                </div>
              )}
            </div>
          </div>
          
          {/* קומפוננטת ההמלצות */}
          <GymRecommendations formData={formData} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;