import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GymPersonalDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    experience: 'מתחיל', // ברירת מחדל
    goals: [],
    medicalConditions: '',
    preferredTime: '',
    daysPerWeek: ''
  });

  const trainingGoals = [
    'ירידה במשקל',
    'בניית מסת שריר',
    'שיפור כוח',
    'שיפור סיבולת',
    'שיפור גמישות',
    'תחזוקה כללית'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalChange = (goal) => {
    setFormData(prev => {
      const updatedGoals = prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal];
      return {
        ...prev,
        goals: updatedGoals
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // שמירת הנתונים ב-localStorage
    localStorage.setItem('gymUserData', JSON.stringify(formData));
    // ניווט לדשבורד עם הנתונים
    navigate('/dashboard', { 
      state: { formData }
    });
};

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">פרטים אישיים לאימון</h2>
            <p className="text-center text-gray-600 mt-2">המידע הזה יעזור לנו להתאים את התוכנית עבורך</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* שורה ראשונה - גיל, גובה ומשקל */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  גיל
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="16"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  גובה (בס"מ)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="120"
                  max="250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  משקל (בק"ג)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="30"
                  max="300"
                />
              </div>
            </div>

            {/* ניסיון באימונים */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ניסיון באימונים
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="מתחיל">מתחיל - אין ניסיון קודם</option>
                <option value="מתחיל מתקדם">מתחיל מתקדם - עד שנה של ניסיון</option>
                <option value="מתאמן">מתאמן - 1-3 שנות ניסיון</option>
                <option value="מתקדם">מתקדם - מעל 3 שנות ניסיון</option>
              </select>
            </div>

            {/* מטרות אימון */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מטרות אימון (ניתן לבחור מספר אפשרויות)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trainingGoals.map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* מצב רפואי */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מצב רפואי (אופציונלי)
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                placeholder="פרט/י האם יש מגבלות רפואיות שחשוב שנדע עליהן"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>

            {/* זמני אימון מועדפים */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שעות אימון מועדפות
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">בחר/י זמן מועדף</option>
                <option value="בוקר מוקדם">בוקר מוקדם (05:00-08:00)</option>
                <option value="בוקר">בוקר (08:00-12:00)</option>
                <option value="צהריים">צהריים (12:00-16:00)</option>
                <option value="אחר הצהריים">אחר הצהריים (16:00-20:00)</option>
                <option value="ערב">ערב (20:00-23:00)</option>
              </select>
            </div>

            {/* מספר אימונים בשבוע */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כמה פעמים בשבוע את/ה מתכנן/ת להתאמן?
              </label>
              <select
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">בחר/י מספר אימונים</option>
                <option value="1-2">1-2 פעמים בשבוע</option>
                <option value="3-4">3-4 פעמים בשבוע</option>
                <option value="5-6">5-6 פעמים בשבוע</option>
                <option value="7">כל יום</option>
              </select>
            </div>

            {/* כפתור שליחה */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                שמור והמשך
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default GymPersonalDetails;