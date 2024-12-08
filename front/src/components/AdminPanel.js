import React, { useState, useEffect } from 'react';
import { api } from '../services/authService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    // פונקציה לאחזור משתמשים
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/', {
                headers: authService.getAuthHeaders()
            });

            if (response.status === 'success') {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
                setLoading(false);
            }
        } catch (error) {
            console.error('שגיאה בטעינת משתמשים:', error);
            setError('לא ניתן לטעון משתמשים. אנא נסה שוב מאוחר יותר.');
            setLoading(false);
        }
    };

    // פונקציה לחיפוש משתמשים
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
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
                setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error('שגיאה במחיקת משתמש:', error);
            alert('לא ניתן למחוק משתמש. אנא נסה שוב.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
                        <h1 className="text-3xl font-bold text-white text-center">
                            לוח ניהול משתמשים
                        </h1>
                    </div>

                    <div className="p-6">
                        <SearchBar onSearch={handleSearch} />

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                לא נמצאו משתמשים
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-4 w-2/5 text-center">שם משתמש</th>
                                            <th className="py-3 px-4 w-2/5 text-center">אימייל</th>
                                            <th className="py-3 px-4 w-1/5 text-center">פעולות</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-4 w-2/5 text-center">
                                                    <span className="truncate max-w-full block">{user.username}</span>
                                                </td>
                                                <td className="py-3 px-4 w-2/5 text-center">
                                                    <span className="truncate max-w-full block">{user.email}</span>
                                                </td>
                                                <td className="py-3 px-4 w-1/5 text-center">
                                                    <button 
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                                        title="מחק משתמש"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;