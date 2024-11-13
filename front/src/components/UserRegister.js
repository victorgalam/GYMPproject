// src/components/UserRegister.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../service/UserService'; // שינוי שם הייבוא

function UserRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('הסיסמאות אינן תואמות');
      return;
    }
    
    setPasswordError('');
    setError('');
    setLoading(true);

    try {
      // קריאה לפונקציית ההרשמה מה-service
      const response = await userService.register({
        username,
        email,
        password
      });

      if (response.status === "success") {
        navigate('/gym-details');
      }
    } catch (err) {
      setError(err.message || 'אירעה שגיאה בתהליך ההרשמה');
    } finally {
      setLoading(false);
    }
  };

 return (
   <div className="min-h-screen bg-gray-50" dir="rtl">
     <main className="container mx-auto px-4 py-8">
       <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
         <div className="mb-6">
           <h2 className="text-2xl font-bold text-center text-gray-800">הרשמה למערכת</h2>
         </div>

         {/* הצגת שגיאות */}
         {error && (
           <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
             {error}
           </div>
         )}
         
         <form onSubmit={handleRegister} className="space-y-4">
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
               disabled={loading}
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
               disabled={loading}
             />
           </div>

           {/* אימות סיסמה */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               אימות סיסמה
             </label>
             <input
               type="password"
               placeholder="הכנס שוב את הסיסמה"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               required
               disabled={loading}
             />
           </div>

           {/* הודעת שגיאה לאי התאמת סיסמאות */}
           {passwordError && (
             <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
               {passwordError}
             </div>
           )}

           {/* אימייל */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               אימייל
             </label>
             <input
               type="email"
               placeholder="הכנס כתובת אימייל"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               required
               disabled={loading}
             />
           </div>

           {/* כפתור הרשמה */}
           <div className="mt-6">
             <button
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:bg-blue-300"
               disabled={loading}
             >
               {loading ? 'מבצע הרשמה...' : 'הרשם'}
             </button>
           </div>
         </form>

         {/* קישור להתחברות */}
         <div className="mt-4 text-center">
           <p className="text-sm text-gray-600">
             כבר יש לך חשבון?{' '}
             <button
               onClick={() => navigate('/login')}
               className="text-blue-600 hover:text-blue-800 font-medium"
               disabled={loading}
             >
               התחבר כאן
             </button>
           </p>
         </div>
       </div>
     </main>
   </div>
 );
}

export default UserRegister;