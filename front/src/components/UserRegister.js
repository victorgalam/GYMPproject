import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../service/UserService';

function UserRegister() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // בדיקת תקינות הטופס
        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            setIsLoading(false);
            return;
        }

        try {
            // שליחת נתוני ההרשמה ללא confirmPassword
            const { confirmPassword, ...registerData } = formData;
            const response = await userService.register(registerData);

            if (response.status === 'success') {
                console.log('Registration successful');
                navigate('/login'); // או לכל דף אחר שתרצה
            } else {
                setError(response.message || 'שגיאה בהרשמה');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'שגיאה בתהליך ההרשמה');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">הרשמה למערכת</h2>
                    
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                שם משתמש
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                                minLength={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                אימייל
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                סיסמה
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                אימות סיסמה
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'מבצע הרשמה...' : 'הירשם'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            כבר יש לך חשבון?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
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