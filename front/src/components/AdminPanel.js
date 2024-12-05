import React, { useState, useEffect } from 'react';
import { api } from '../services/authService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // פונקציה לאחזור משתמשים
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/', {
                headers: authService.getAuthHeaders()
            });

            if (response.status === 'success') {
                setUsers(response.data.users);
                setLoading(false);
            }
        } catch (error) {
            console.error('שגיאה בטעינת משתמשים:', error);
            console.error('Full error details:', JSON.stringify(error, null, 2));
            
            // More specific error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server responded with error:', error.response.data);
                setError(error.response.data.message || 'שגיאה בטעינת משתמשים');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                setError('לא ניתן להתחבר לשרת');
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', error.message);
                setError('שגיאה פנימית');
            }
            
            setLoading(false);
        }
    };

    // פונקציה למחיקת משתמש
    const handleDeleteUser = async (userId) => {
        try {
            const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?');
            
            if (confirmDelete) {
                await api.delete(`/${userId}`, {
                    headers: authService.getAuthHeaders()
                });

                // עדכון רשימת המשתמשים לאחר מחיקה
                setUsers(users.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error('שגיאה במחיקת משתמש:', error);
            console.error('Full error details:', JSON.stringify(error, null, 2));
            
            // More specific error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server responded with error:', error.response.data);
                alert(error.response.data.message || 'לא ניתן למחוק את המשתמש');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                alert('לא ניתן להתחבר לשרת');
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', error.message);
                alert('שגיאה פנימית');
            }
        }
    };

    // טעינת משתמשים בעת טעינת הרכיב
    useEffect(() => {
        // בדיקת הרשאות מנהל
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchUsers();
    }, [navigate]);

    // הצגת מצב טעינה
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">טוען משתמשים...</div>
            </div>
        );
    }

    // הצגת שגיאה
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">ניהול משתמשים</h1>
            
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-right">שם משתמש</th>
                            <th className="px-4 py-3 text-right">אימייל</th>
                            <th className="px-4 py-3 text-right">תפקיד</th>
                            <th className="px-4 py-3 text-right">פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-3">{user.username}</td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">{user.role}</td>
                                <td className="px-4 py-3">
                                    <button 
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        מחק
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;