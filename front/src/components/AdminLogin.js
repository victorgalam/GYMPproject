// src/components/AdminLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/authService';
import { authService } from '../service/authService';

const AdminLogin = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/login', credentials);
            const { token, role } = response.data.data;
            
            // שמירת הטוקן והרול
            authService.setToken(token);
            authService.setUserRole(role);
            
            // הפעלת קולבק אם קיים
            if (onLoginSuccess) {
                onLoginSuccess({ token, role });
            }
            
            // ניווט לדף המנהל
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'שגיאה בהתחברות');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        כניסת מנהל
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        גישה מוגבלת למנהלי המערכת בלבד
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="admin-username" className="sr-only">
                                שם משתמש מנהל
                            </label>
                            <input
                                id="admin-username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    username: e.target.value
                                })}
                                placeholder="שם משתמש מנהל"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="admin-password" className="sr-only">
                                סיסמה
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    password: e.target.value
                                })}
                                placeholder="סיסמה"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            התחבר כמנהל
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;