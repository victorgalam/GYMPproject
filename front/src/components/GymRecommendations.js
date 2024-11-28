import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const GymRecommendations = ({ isDashboard = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState([]);
  const [userData, setUserData] = useState(null);
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // טעינת נתוני המשתמש מ-localStorage
    const storedData = localStorage.getItem('gymUserData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      
      // חישוב BMI
      if (parsedData.height && parsedData.weight) {
        const heightInMeters = parsedData.height / 100;
        const calculatedBMI = (parsedData.weight / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(calculatedBMI);
        generateRecommendations(parsedData, calculatedBMI);
      }
    }
  }, [navigate]);

  const getBmiCategory = (bmiValue) => {
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return 'תת משקל';
    if (bmiNum < 25) return 'משקל תקין';
    if (bmiNum < 30) return 'עודף משקל';
    return 'השמנה';
  };

  const generateRecommendations = (data, bmiValue) => {
    const personalizedRecommendations = [];

    // המלצות על בסיס BMI
    if (bmiValue) {
      const bmiCategory = getBmiCategory(bmiValue);
      switch (bmiCategory) {
        case 'תת משקל':
          personalizedRecommendations.push({
            title: 'בניית מסת שריר',
            description: 'מומלץ להתמקד באימוני כוח ולהגדיל את צריכת הקלוריות'
          });
          break;
        case 'משקל תקין':
          personalizedRecommendations.push({
            title: 'שמירה על הקיים',
            description: 'המשך באימונים מאוזנים המשלבים כוח ואירובי'
          });
          break;
        case 'עודף משקל':
        case 'השמנה':
          personalizedRecommendations.push({
            title: 'ירידה במשקל',
            description: 'שלב אימונים אירוביים עם אימוני כוח לשריפת שומן'
          });
          break;
        default:
          break;
      }
    }

    // המלצות על בסיס רמת הניסיון
    if (data.experienceLevel) {
      switch (data.experienceLevel) {
        case 'מתחיל':
          personalizedRecommendations.push({
            title: 'תוכנית למתחילים',
            description: 'התחל עם 3 אימונים בשבוע, התמקד בתרגילים בסיסיים'
          });
          break;
        case 'מתקדם':
          personalizedRecommendations.push({
            title: 'תוכנית למתקדמים',
            description: 'הגדל ל-4-5 אימונים בשבוע, הוסף תרגילים מורכבים'
          });
          break;
        case 'מקצועי':
          personalizedRecommendations.push({
            title: 'תוכנית למקצוענים',
            description: 'תוכנית מפוצלת של 5-6 אימונים בשבוע עם עצימות גבוהה'
          });
          break;
        default:
          break;
      }
    }

    // המלצות על בסיס מטרות האימון
    if (data.trainingGoals) {
      data.trainingGoals.forEach(goal => {
        switch (goal) {
          case 'חיטוב':
            personalizedRecommendations.push({
              title: 'תוכנית חיטוב',
              description: 'שלב אימוני HIIT עם אימוני משקולות במשקל בינוני-קל'
            });
            break;
          case 'כוח':
            personalizedRecommendations.push({
              title: 'בניית כוח',
              description: 'התמקד במשקלים כבדים עם מספר חזרות נמוך'
            });
            break;
          case 'סיבולת':
            personalizedRecommendations.push({
              title: 'פיתוח סיבולת',
              description: 'שלב אימונים אירוביים ארוכים עם אינטרוולים'
            });
            break;
          default:
            break;
        }
      });
    }

    setRecommendations(personalizedRecommendations);
  };

  return (
    <div className={`${isDashboard ? '' : 'min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'}`}>
      <div className={`${isDashboard ? '' : 'max-w-3xl mx-auto'}`}>
        <div className={`${isDashboard ? '' : 'bg-white shadow-xl rounded-lg overflow-hidden'}`}>
          <div className={`${isDashboard ? '' : 'px-6 py-8'}`}>
            {!isDashboard && (
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                המלצות אימון מותאמות אישית
              </h2>
            )}

            {/* הצגת BMI */}
            {bmi && !isDashboard && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">נתוני BMI</h3>
                <p className="text-blue-800">
                  ה-BMI שלך הוא: {bmi}
                  <span className="mr-2">({getBmiCategory(bmi)})</span>
                </p>
              </div>
            )}

            {/* הצגת ההמלצות */}
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h3>
                  <p className="text-gray-700">{rec.description}</p>
                </div>
              ))}
            </div>

            {/* כפתור המשך לדף הבית - רק אם לא בדשבורד */}
            {!isDashboard && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  המשך
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymRecommendations;