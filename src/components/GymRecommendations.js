// GymRecommendations.js
import React from 'react';

const GymRecommendations = ({ formData }) => {
  if (!formData || Object.keys(formData).length === 0) {
    return null;
  }

  const getIntensityRecommendation = () => {
    const { experience, medicalConditions } = formData;
    if (medicalConditions) {
      return 'נמוכה עד בינונית';
    }
    switch (experience) {
      case 'מתחיל':
        return 'נמוכה עד בינונית';
      case 'מתחיל מתקדם':
        return 'בינונית';
      case 'מתאמן':
        return 'בינונית עד גבוהה';
      case 'מתקדם':
        return 'גבוהה';
      default:
        return 'בינונית';
    }
  };

  const getWorkoutDuration = () => {
    const { experience } = formData;
    switch (experience) {
      case 'מתחיל':
        return '30-45 דקות';
      case 'מתחיל מתקדם':
        return '45-60 דקות';
      case 'מתאמן':
      case 'מתקדם':
        return '60-90 דקות';
      default:
        return '45-60 דקות';
    }
  };

  const getBmiCategory = () => {
    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) return 'תת משקל';
    if (bmi < 25) return 'משקל תקין';
    if (bmi < 30) return 'עודף משקל';
    return 'השמנה';
  };

  const getSpecificRecommendations = () => {
    const recommendations = [];
    const bmiCategory = getBmiCategory();

    // המלצות על פי BMI
    switch(bmiCategory) {
      case 'תת משקל':
        recommendations.push({
          title: 'המלצות למצב תת משקל',
          description: 'התמקד בבניית מסת שריר ועלייה במשקל בריאה. הגדל צריכה קלורית ושלב אימוני כוח. התייעץ עם תזונאי/ת.'
        });
        break;
      case 'עודף משקל':
      case 'השמנה':
        recommendations.push({
          title: 'המלצות לירידה בריאה במשקל',
          description: 'שלב אימוני כוח עם אימוני סיבולת. התחל בעצימות נמוכה והעלה בהדרגה. מומלץ להתייעץ עם מאמן כושר אישי.'
        });
        break;
    }
    
    // המלצות על פי מטרות
    formData.goals.forEach(goal => {
      switch (goal) {
        case 'ירידה במשקל':
          recommendations.push({
            title: 'המלצות לירידה במשקל',
            description: 'שלב אימוני קרדיו (20-30 דקות) בסוף כל אימון משקולות. התמקד באימונים מעגליים עם מעט זמני מנוחה.'
          });
          break;
        case 'בניית מסת שריר':
          recommendations.push({
            title: 'המלצות לבניית שריר',
            description: 'התמקד במשקלים כבדים יחסית (70-85% מהמשקל המקסימלי) עם 8-12 חזרות בסט. בצע 3-4 סטים לכל תרגיל.'
          });
          break;
        case 'שיפור סיבולת':
          recommendations.push({
            title: 'המלצות לשיפור סיבולת',
            description: 'שלב אימוני אינטרוולים עצימים (HIIT) פעמיים בשבוע. התחל עם 20 דקות ועלה בהדרגה.'
          });
          break;
      }
    });

    // המלצות על פי זמני אימון
    if (formData.preferredTime === 'בוקר מוקדם') {
      recommendations.push({
        title: 'המלצות לאימון בוקר',
        description: 'הקפד על ארוחת בוקר קלה כשעה לפני האימון. בצע חימום ארוך יותר בשעות הבוקר המוקדמות.'
      });
    }

    // המלצות על פי תדירות
    if (formData.daysPerWeek === '5-6' || formData.daysPerWeek === '7') {
      recommendations.push({
        title: 'המלצות לאימונים תכופים',
        description: 'חשוב לחלק את האימונים לקבוצות שרירים שונות ולהקפיד על ימי מנוחה. שקול לשלב אימונים קלים יותר לשיקום.'
      });
    }

    return recommendations;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">המלצות אימון מותאמות אישית</h2>
        
        {/* סיכום בסיסי */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">עצימות מומלצת</h3>
            <p className="text-blue-600">{getIntensityRecommendation()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">משך אימון מומלץ</h3>
            <p className="text-blue-600">{getWorkoutDuration()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">BMI קטגוריית</h3>
            <p className="text-blue-600">{getBmiCategory()}</p>
          </div>
        </div>

        {/* המלצות ספציפיות */}
        <div className="space-y-4">
          {getSpecificRecommendations().map((rec, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">{rec.title}</h3>
              <p className="mt-1 text-gray-600">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymRecommendations;