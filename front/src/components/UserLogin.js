// src/components/UserLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/UserService';
function UserLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login({ username, password });
            
            if (response.status === 'success') {
                const user = authService.getCurrentUser();
                console.log('Login successful:', user);

                // Check if user is admin
                if (user.role === 'admin') {
                    navigate('/admin/panel');
                    return;
                }

                try {
                    // Check if user has personal details (only for regular users)
                    const personalDetailsResponse = await userService.getMyPersonalDetails();
                    
                    if (!personalDetailsResponse.data) {
                        // No personal details - redirect to personal details page
                        navigate('/personal-details');
                    } else {
                        // Has personal details - redirect to dashboard
                        navigate('/dashboard');
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        // 404 means no personal details found
                        navigate('/personal-details');
                    } else {
                        console.error('Error checking personal details:', error);
                        navigate('/dashboard'); // Default to dashboard if check fails
                    }
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // טיפול בשגיאות ספציפיות
            if (error.status === 'error' && error.message) {
                setError(error.message);
            } else if (error.response?.status === 401) {
                setError('שם משתמש או סיסמה לא נכונים');
            } else if (error.response?.status === 429) {
                setError('יותר מדי ניסיונות התחברות. אנא נסה שוב מאוחר יותר');
            } else {
                setError(error.message || 'שגיאה בהתחברות. אנא נסה שוב.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // אם המשתמש כבר מחובר, נעביר אותו לדף הבית
    if (authService.isAuthenticated()) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            התחברות למערכת
                        </h2>
                    </div>

                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                שם משתמש
                            </label>
                            <input
                                type="text"
                                placeholder="הכנס שם משתמש"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                סיסמה
                            </label>
                            <input
                                type="password"
                                placeholder="הכנס סיסמה"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className={`w-full flex justify-center items-center ${
                                    isLoading 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-medium py-3 px-4 rounded-md transition duration-200`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        מתחבר...
                                    </>
                                ) : (
                                    'התחבר'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            אין לך חשבון?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                                disabled={isLoading}
                            >
                                הירשם כאן
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserLogin;