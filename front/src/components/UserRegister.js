import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function UserRegister() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        general: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();

    // וולידציה של שדה בודד
    const validateField = (name, value) => {
        switch (name) {
            case 'username':
                if (value.length < 3) {
                    return 'שם משתמש חייב להכיל לפחות 3 תווים';
                }
                if (!/^[A-Za-z0-9_-]*$/.test(value)) {
                    return 'שם משתמש יכול להכיל רק אותיות באנגלית, מספרים, מקף ותחתון';
                }
                return '';
            
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'כתובת אימייל לא תקינה';
                }
                return '';
            
            case 'password':
                if (value.length < 8) {
                    return 'סיסמה חייבת להכיל לפחות 8 תווים';
                }
                if (!/(?=.*[A-Z])/.test(value)) {
                    return 'סיסמה חייבת להכיל לפחות אות גדולה אחת';
                }
                if (!/(?=.*[0-9])/.test(value)) {
                    return 'סיסמה חייבת להכיל לפחות ספרה אחת';
                }
                if (!/(?=.*[!@#$%^&*])/.test(value)) {
                    return 'סיסמה חייבת להכיל לפחות תו מיוחד אחד (!@#$%^&*)';
                }
                return '';
            
            case 'confirmPassword':
                if (value !== formData.password) {
                    return 'הסיסמאות אינן תואמות';
                }
                return '';
            
            default:
                return '';
        }
    };

    // וולידציה של כל הטופס
    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            newErrors[field] = validateField(field, formData[field]);
        });
        setErrors(prev => ({...prev, ...newErrors}));
        return !Object.values(newErrors).some(error => error);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // וולידציה בזמן אמת רק אם השדה כבר נגע
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, formData[name])
        }));
    };

    const clearGeneralError = useCallback(() => {
        setErrors(prev => ({ ...prev, general: '' }));
    }, []);

    useEffect(() => {
        if (errors.general) {
            clearGeneralError();
        }
    }, [errors.general, clearGeneralError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, general: '' }));
        setIsLoading(true);

        // סימון כל השדות כנגועים
        const allTouched = Object.keys(formData).reduce((acc, key) => ({
            ...acc,
            [key]: true
        }), {});
        setTouched(allTouched);

        // וולידציה של כל הטופס
        if (!validateForm()) {
            setIsLoading(false);
            setErrors(prev => ({
                ...prev,
                general: 'אנא תקן את השגיאות בטופס'
            }));
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authService.register(registerData);
            
            console.log('Server response:', response); // לבדיקת התגובה מהשרת

            if (response && response.status === 'success') {
                navigate('/personal-details');
            } else {
                throw {
                    code: response?.code || 'UNKNOWN_ERROR',
                    message: response?.message || 'שגיאה בהרשמה'
                };
            }
        } catch (error) {
            console.error('Registration error details:', {
                error: error,
                message: error.message,
                code: error.code,
                response: error.response,
                data: error.response?.data
            });

            // טיפול בשגיאות ספציפיות
            if (error.response) {
                // שגיאות מהשרת עם קוד תגובה
                const serverError = error.response.data;
                
                switch (serverError.code) {
                    case 'EMAIL_EXISTS':
                        setErrors(prev => ({
                            ...prev,
                            email: 'כתובת האימייל כבר קיימת במערכת'
                        }));
                        break;
                    
                    case 'USERNAME_EXISTS':
                        setErrors(prev => ({
                            ...prev,
                            username: 'שם המשתמש כבר תפוס'
                        }));
                        break;
                    
                    case 'VALIDATION_ERROR':
                        // טיפול בשגיאות ולידציה מהשרת
                        const validationErrors = serverError.details || {};
                        setErrors(prev => ({
                            ...prev,
                            email: validationErrors.email || prev.email,
                            username: validationErrors.username || prev.username,
                            password: validationErrors.password || prev.password,
                            general: validationErrors.general || ''
                        }));
                        break;
                    
                    default:
                        // שגיאה כללית מהשרת
                        setErrors(prev => ({
                            ...prev,
                            general: serverError.message || 'שגיאה בתהליך ההרשמה'
                        }));
                }
            } else if (error.request) {
                // שגיאת רשת - הבקשה נשלחה אך לא התקבלה תשובה
                setErrors(prev => ({
                    ...prev,
                    general: 'בעיית תקשורת עם השרת, אנא נסה שוב'
                }));
            } else {
                // שגיאה בהגדרת הבקשה
                setErrors(prev => ({
                    ...prev,
                    general: 'שגיאה בתהליך ההרשמה, אנא נסה שוב'
                }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">הרשמה למערכת</h2>
                    
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                שם משתמש
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.username && errors.username 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                required
                                minLength={3}
                            />
                            {touched.username && errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
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
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.email && errors.email 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                required
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
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
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.password && errors.password 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                required
                                minLength={8}
                            />
                            {touched.password && errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
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
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.confirmPassword && errors.confirmPassword 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                required
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">דרישות הסיסמה:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• לפחות 8 תווים</li>
                                <li>• לפחות אות גדולה אחת באנגלית</li>
                                <li>• לפחות ספרה אחת</li>
                                <li>• לפחות תו מיוחד אחד (!@#$%^&*)</li>
                            </ul>
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
                                type="button"
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