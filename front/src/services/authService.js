import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/users';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// יצירת instance של axios עם הגדרות בסיסיות
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// פונקציה להודעה על שינוי במצב ההתחברות
const notifyAuthChange = () => {
    window.dispatchEvent(new Event('auth-change'));
};

// הוספת interceptor לבקשות - להוספת טוקן
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// הוספת interceptors
api.interceptors.response.use(
    (response) => {
        // המרת תגובה מוצלחת לפורמט אחיד
        if (response.data) {
            return {
                status: 'success',
                data: response.data.data || response.data,
                message: response.data.message
            };
        }
        return response;
    },
    (error) => {
        // המרת שגיאות לפורמט אחיד
        if (error.response) {
            // השרת החזיר תשובה עם קוד שגיאה
            const errorResponse = {
                status: 'error',
                code: error.response.data?.code || 'SERVER_ERROR',
                message: error.response.data?.message || 'שגיאת שרת',
                details: error.response.data?.details || {}
            };

            if (error.response.status === 401) {
                // טיפול בשגיאת אימות
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                notifyAuthChange(); // הודעה על שינוי בהתחברות
                window.location.replace('/login');
            }

            return Promise.reject(errorResponse);
        } else if (error.request) {
            // הבקשה נשלחה אך לא התקבלה תשובה
            return Promise.reject({
                status: 'error',
                code: 'NETWORK_ERROR',
                message: 'בעיית תקשורת עם השרת'
            });
        }
        
        // שגיאה בהגדרת הבקשה
        return Promise.reject({
            status: 'error',
            code: 'REQUEST_ERROR',
            message: error.message || 'שגיאה בשליחת הבקשה'
        });
    }
);

const authService = {
    register: async (userData) => {
        try {
            console.log({userData});
            
            const response = await api.post('/register', userData);
            
            if (response.status === 'success' && response.data) {
                const { token, user } = response.data;
                
                if (token) {
                    localStorage.setItem(TOKEN_KEY, token);
                }
                if (user) {
                    localStorage.setItem(USER_KEY, JSON.stringify(user));
                }
                notifyAuthChange(); // הודעה על שינוי בהתחברות
            }
            
            return response;
        } catch (error) {
            console.error('Registration service error:', error);
            throw error;
        }
    },

    // התחברות
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            
            if (response.status === 'success') {
                const { token, user } = response.data;
                
                if (token) {
                    localStorage.setItem(TOKEN_KEY, token);
                }
                if (user) {
                    localStorage.setItem(USER_KEY, JSON.stringify(user));
                }
                notifyAuthChange(); // הודעה על שינוי בהתחברות

                return {
                    status: 'success',
                    data: user
                };
            }
            
            throw new Error('תגובת שרת לא תקינה');
            
        } catch (error) {
            if (error.response?.status === 401) {
                throw {
                    status: 'error',
                    code: 'INVALID_CREDENTIALS',
                    message: 'שם משתמש או סיסמה שגויים'
                };
            }

            throw {
                status: 'error',
                code: error.code || 'LOGIN_FAILED',
                message: error.message || 'שגיאה בתהליך ההתחברות',
                details: error.response?.data || error
            };
        }
    },

    // התנתקות
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            notifyAuthChange(); // הודעה על שינוי בהתחברות
            window.location.replace('/login');
        }
    },

    // בדיקה אם המשתמש מחובר
    isAuthenticated: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const user = localStorage.getItem(USER_KEY);
        return !!(token && user);
    },

    // קבלת המשתמש הנוכחי
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem(USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem(USER_KEY);
            notifyAuthChange(); // הודעה על שינוי בהתחברות במקרה של שגיאה
            return null;
        }
    },

    // קבלת הטוקן
    getToken: () => localStorage.getItem(TOKEN_KEY),

    // קבלת headers לבקשות
    getAuthHeaders: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};

export { authService, api as axiosInstance };