import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();

 const handleLogin = (e) => {
   e.preventDefault();

   if (username === 'user' && password === 'userpassword') {
     navigate('/home');
   } else {
     alert('שם משתמש או סיסמה אינם נכונים');
   }
 };

 return (
   <div className="min-h-screen bg-gray-50" dir="rtl">
     <main className="container mx-auto px-4 py-8">
       <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
         <div className="mb-6">
           <h2 className="text-2xl font-bold text-center text-gray-800">התחברות למערכת</h2>
         </div>
         
         <form onSubmit={handleLogin} className="space-y-4">
           {/* שם משתמש */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               שם משתמש
             </label>
             <input
               type="text"
               placeholder="הכנס שם משתמש"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               required
             />
           </div>

           {/* סיסמה */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               סיסמה
             </label>
             <input
               type="password"
               placeholder="הכנס סיסמה"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               required
             />
           </div>

           {/* כפתור התחברות */}
           <div className="mt-6">
             <button
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
             >
               התחבר
             </button>
           </div>
         </form>

         {/* קישורים נוספים */}
         <div className="mt-4 text-center space-y-2">
           <p className="text-sm text-gray-600">
             אין לך חשבון?{' '}
             <button
               onClick={() => navigate('/register')}
               className="text-blue-600 hover:text-blue-800 font-medium"
             >
               הירשם כאן
             </button>
           </p>
           <p className="text-sm text-gray-600">
             <button
               onClick={() => navigate('/admin')}
               className="text-blue-600 hover:text-blue-800 font-medium"
             >
               כניסת מנהל מערכת
             </button>
           </p>
         </div>
       </div>
     </main>
   </div>
 );
}

export default UserLogin;
