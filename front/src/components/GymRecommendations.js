import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GymRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // נסה לקבל נתונים מה-state של הניווט
    const personalDetails = location.state?.personalDetails;
    
    if (personalDetails) {
      setFormData(personalDetails);
    } else {
      // אם אין נתונים בניווט, נסה לקחת מ-localStorage
      const storedData = localStorage.getItem('gymUserData');
      if (storedData) {
        setFormData(JSON.parse(storedData));
      } else {
        // אם אין נתונים בכלל, נווט חזרה לדף הפרטים האישיים
        navigate('/personal-details');
      }
    }
  }, [location, navigate]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            {/* Add your loading spinner here */}
          </div>
          <p className="mt-2">טוען המלצות...</p>
        </div>
      </div>
    );
  }

  const getIntensityRecommendation = () => {
    const { experience, medicalConditions } = formData;
    if (medicalConditions) return 'נמוכה עד בינונית';
    switch (experience) {
      case 'מתחיל': return 'נמוכה עד בינונית';
      case 'מתקדם': return 'בינונית עד גבוהה';
      case 'מקצועי': return 'גבוהה';
      default: return 'בינונית';
    }
  };

  const getWorkoutDuration = () => {
    const { experience } = formData;
    switch (experience) {
      case 'מתחיל': return '30-45 דקות';
      case 'מתקדם': return '45-60 דקות';
      case 'מקצועי': return '60-90 דקות';
      default: return '45-60 דקות';
    }
  };

  const calculateBmi = () => {
    const heightInMeters = formData.height / 100;
    return formData.weight / (heightInMeters * heightInMeters);
  };

  const getBmiInfo = (bmi) => {
    if (bmi < 18.5) return { category: 'תת משקל', color: '#60A5FA', lightColor: '#DBEAFE' };
    if (bmi < 25) return { category: 'משקל תקין', color: '#34D399', lightColor: '#D1FAE5' };
    if (bmi < 30) return { category: 'עודף משקל', color: '#FBBF24', lightColor: '#FEF3C7' };
    return { category: 'השמנה', color: '#F87171', lightColor: '#FEE2E2' };
  };

  const getWorkoutFrequencyRecommendation = () => {
    const { daysPerWeek, experience } = formData;
    const days = Number(daysPerWeek);
    
    if (days <= 2) return 'מומלץ להגדיל את תדירות האימונים ל-3 ימים בשבוע לפחות להשגת תוצאות טובות יותר';
    if (days >= 6) return 'חשוב להקפיד על ימי מנוחה מספקים בין האימונים למניעת עומס יתר';
    return 'תדירות האימונים טובה, הקפד על יום מנוחה בין אימונים';
  };

  const getSpecificRecommendations = () => {
    const recommendations = [];
    const bmi = calculateBmi();
    
    // המלצות על פי BMI
    if (bmi < 18.5) {
      recommendations.push({
        title: 'תוכנית לעלייה במשקל',
        description: 'התמקד באימוני כוח עם משקלים כבדים (3-5 סטים, 6-8 חזרות) ואכילת עודף קלורי של 300-500 קלוריות ליום. חשוב להתייעץ עם תזונאי.'
      });
    } else if (bmi >= 25) {
      recommendations.push({
        title: 'תוכנית לירידה במשקל',
        description: 'שלב אימוני כוח (3 סטים, 12-15 חזרות) עם אימוני אירובי (30 דקות לפחות). צור גירעון קלורי של 500 קלוריות ליום.'
      });
    }
    
    // המלצות על פי מטרות האימון
    if (formData.goals.includes('ירידה במשקל')) {
      recommendations.push({
        title: 'אסטרטגיית ירידה במשקל',
        description: 'שלב אימוני HIIT פעמיים בשבוע, התמקד באימונים מעגליים עם משקל גוף, והוסף 20-30 דקות קרדיו בסוף כל אימון משקולות.'
      });
    }
    
    if (formData.goals.includes('בניית מסת שריר')) {
      recommendations.push({
        title: 'תוכנית היפרטרופיה',
        description: 'התמקד באימונים עם משקלים בטווח של 8-12 חזרות, 4 סטים לתרגיל. חשוב לצרוך חלבון (1.6-2.2 גרם לק"ג משקל גוף).'
      });
    }

    if (formData.goals.includes('שיפור כוח')) {
      recommendations.push({
        title: 'אימוני כוח',
        description: 'בצע תרגילי compound עם משקלים כבדים (4-6 חזרות, 5 סטים). התמקד בתרגילים כמו סקוואט, דדליפט ולחיצת חזה.'
      });
    }

    // המלצות לפי שעות האימון
    switch (formData.preferredTime) {
      case 'בוקר':
        recommendations.push({
          title: 'טיפים לאימון בוקר',
          description: 'הקפד על ארוחת בוקר קלה שעה לפני האימון. בצע חימום ארוך יותר כיוון שהגוף קר יותר בשעות הבוקר.'
        });
        break;
      case 'ערב':
        recommendations.push({
          title: 'טיפים לאימון ערב',
          description: 'הימנע מאימונים עצימים מאוד 2-3 שעות לפני השינה. אכול ארוחה קלה 2 שעות לפני האימון.'
        });
        break;
    }

    // המלצות לפי מצב רפואי
    if (formData.medicalConditions) {
      recommendations.push({
        title: 'התאמות בריאותיות',
        description: 'נדרשת התייעצות עם רופא ספורט. התחל באימונים בעצימות נמוכה והעלה בהדרגה. הקפד על חימום וקירור ממושכים.'
      });
    }

    return recommendations;
  };

  const bmi = calculateBmi();
  const bmiInfo = getBmiInfo(bmi);
  const rotation = Math.min(180, Math.max(0, (bmi - 15) * (180 / 25)));

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            תוכנית אימונים מותאמת אישית
          </h1>
          <p className="text-center text-gray-600 mb-6">
            המלצות מותאמות למטרות ולנתונים האישיים שלך
          </p>

          {/* BMI Display */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            {/* [Previous BMI visualization code remains the same] */}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">עצימות מומלצת</h3>
              <p className="text-blue-600">{getIntensityRecommendation()}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">משך אימון מומלץ</h3>
              <p className="text-blue-600">{getWorkoutDuration()}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">תדירות אימונים</h3>
              <p className="text-blue-600">{getWorkoutFrequencyRecommendation()}</p>
            </div>
          </div>

          {/* Detailed Recommendations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">המלצות מפורטות</h2>
            {getSpecificRecommendations().map((rec, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border-r-4 border-blue-500"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                <p className="text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* נווט בחזרה לעריכת פרטים */}
        <div className="text-center">
          <button
            onClick={() => navigate('/personal-details')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            עדכן פרטים אישיים
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymRecommendations;