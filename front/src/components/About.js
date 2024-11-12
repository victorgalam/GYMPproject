import React from 'react';

const About = () => {
 return (
   <div className="min-h-screen bg-gray-50" dir="rtl">
     <div className="container mx-auto px-4 py-8">
       {/* לוגו החברה */}
       <div className="flex justify-center mb-8">
         <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
           {/* כאן יבוא הלוגו */}
           <span className="text-2xl font-bold text-gray-400">CludeGYM</span>
         </div>
       </div>

       {/* אודות החברה */}
       <div className="max-w-4xl mx-auto">
         <h1 className="text-4xl font-bold text-center mb-8">אודות CludeGYM</h1>
         
         {/* מנכ"לים */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
           <h2 className="text-2xl font-bold mb-4">המייסדים שלנו</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="text-center">
               <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4">
                 {/* תמונת מנכ"ל 1 */}
               </div>
               <h3 className="text-xl font-semibold">ויקטור גלאם</h3>
               <p className="text-gray-600">מנכ"ל משותף</p>
             </div>
             <div className="text-center">
               <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4">
                 {/* תמונת מנכ"ל 2 */}
               </div>
               <h3 className="text-xl font-semibold">אליה תודה</h3>
               <p className="text-gray-600">מנכ"ל משותף</p>
             </div>
           </div>
         </div>

         {/* הסיפור שלנו */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
           <h2 className="text-2xl font-bold mb-4">הסיפור שלנו</h2>
           <p className="text-gray-700 mb-4">
             CludeGYM נולדה מתוך חזון משותף של שני חברים שראו את הצורך בפתרון טכנולוגי חדשני בעולם הכושר והספורט. 
             כסטודנטים להנדסת תוכנה, הבנו שיש פער משמעותי בין הטכנולוגיה הקיימת לבין הצרכים האמיתיים של המתאמנים והמאמנים.
           </p>
           <p className="text-gray-700 mb-4">
             ההשראה הגיעה כאשר נתקלנו בקושי למצוא מקומות אימון נגישים ומידע מדויק על חדרי כושר ופארקים בסביבתנו. 
             החלטנו ליצור פלטפורמה שתחבר בין אנשים לבין מקומות האימון הקרובים אליהם, תוך מתן מידע מקיף ומעודכן.
           </p>
         </div>

         {/* החזון שלנו */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
           <h2 className="text-2xl font-bold mb-4">החזון שלנו</h2>
           <p className="text-gray-700 mb-4">
             אנחנו מאמינים שלכל אדם מגיעה הזדמנות פשוטה ונוחה לשמור על אורח חיים בריא. 
             החזון שלנו הוא להפוך את עולם הכושר לנגיש יותר, ידידותי יותר וקהילתי יותר.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
             <div className="text-center p-4 bg-blue-50 rounded-lg">
               <h3 className="font-bold mb-2">נגישות</h3>
               <p className="text-sm text-gray-600">מתן גישה קלה למידע על מקומות אימון בכל מקום</p>
             </div>
             <div className="text-center p-4 bg-blue-50 rounded-lg">
               <h3 className="font-bold mb-2">קהילתיות</h3>
               <p className="text-sm text-gray-600">יצירת קהילה תומכת של מתאמנים ומאמנים</p>
             </div>
             <div className="text-center p-4 bg-blue-50 rounded-lg">
               <h3 className="font-bold mb-2">חדשנות</h3>
               <p className="text-sm text-gray-600">פיתוח מתמיד של פתרונות טכנולוגיים חדשים</p>
             </div>
           </div>
         </div>

         {/* התקדמות ועתיד */}
         <div className="bg-white rounded-lg shadow-md p-6">
           <h2 className="text-2xl font-bold mb-4">לאן אנחנו הולכים</h2>
           <p className="text-gray-700 mb-4">
             אנחנו ממשיכים לפתח ולשפר את המערכת שלנו באופן מתמיד. בין התכניות העתידיות שלנו:
           </p>
           <ul className="list-disc list-inside text-gray-700 space-y-2">
             <li>פיתוח מערכת לתיאום אימונים אישיים</li>
             <li>הוספת תכונות חברתיות ושיתוף חוויות</li>
             <li>שילוב טכנולוגיות AI למתן המלצות מותאמות אישית</li>
             <li>הרחבת הפלטפורמה לערים נוספות</li>
           </ul>
         </div>
       </div>
     </div>
   </div>
 );
};

export default About;