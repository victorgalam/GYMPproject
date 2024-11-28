import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import {userService} from '../services/UserService';

function GymPersonalDetails() {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    experience: 'מתחיל',
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

  useEffect(() => {
    const initializeData = async () => {
      try {
        // בדיקת התחברות
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        // נסיון לטעון נתונים קיימים
        try {
          const response = await userService.getMyPersonalDetails();
          
          if (response.data) {
            setFormData(response.data);
            setIsDataLoaded(true);
            console.log('Loaded existing data:', response.data);
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Error loading data:', error);
            setError('אירעה שגיאה בטעינת הנתונים');
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setError('אירעה שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev =>({

      ...prev,
      [name]: value
    }));
    if (error) setError('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setError('משתמש לא מחובר');
        navigate('/login');
        return;
      }

      const token = authService.getToken();
      if (!token) {
        setError('טוקן לא תקין');
        navigate('/login');
        return;
      }

      // נסיון לשמור את הנתונים
      try {
        let response;
        if (isDataLoaded) {
          // עדכון נתונים קיימים
          response = await userService.updateMyPersonalDetails(formData);
        } else {
          // יצירת נתונים חדשים
          response = await userService.createMyPersonalDetails(formData);
        }
        
        console.log('Data saved successfully:', response);
        // שמירת הנתונים ב-localStorage למקרה שהמשתמש יעשה רענון לדף
        localStorage.setItem('gymUserData', JSON.stringify(formData));
        
        // הצגת הודעת הצלחה
        alert('הפרטים האישיים נשמרו בהצלחה!');
        
        // העברת הנתונים דרך state בניווט
        navigate('/recommendations', { state: { personalDetails: formData } });
      } catch (error) {
        console.error('Error saving data:', error);
        setError(error.response?.data?.message || 'אירעה שגיאה בשמירת הנתונים');
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'אירעה שגיאה בשמירת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            {/* Add your loading spinner here */}
          </div>
          <p className="mt-2">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {isDataLoaded ? 'עדכון פרטים אישיים' : 'הזן את פרטיך האישיים'}
            </h2>
            <p className="text-center text-gray-600 mt-2">
              {isDataLoaded 
                ? 'כאן תוכל לעדכן את פרטיך האישיים'
                : 'המידע הזה יעזור לנו להתאים את התוכנית עבורך'}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={loading}
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
                  min="100"
                  max="250"
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                רמת ניסיון
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="מתחיל">מתחיל</option>
                <option value="מתקדם">מתקדם</option>
                <option value="מקצועי">מקצועי</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מטרות אימון (ניתן לבחור מספר אפשרויות)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trainingGoals.map((goal) => (
                  <label
                    key={goal}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                      disabled={loading}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מצב רפואי (אופציונלי)
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="פרט מצבים רפואיים שיש לקחת בחשבון"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                זמן מועדף לאימון
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="">בחר זמן מועדף</option>
                <option value="בוקר">בוקר</option>
                <option value="צהריים">צהריים</option>
                <option value="ערב">ערב</option>
                <option value="לילה">לילה</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר ימי אימון בשבוע
              </label>
              <select
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="">בחר מספר ימים</option>
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium py-3 px-4 rounded-md transition duration-200`}
              >
                {loading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {isDataLoaded ? 'מעדכן...' : 'שומר...'}
                  </>
                ) : (
                  isDataLoaded ? 'עדכן והמשך' : 'שמור והמשך'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default GymPersonalDetails;