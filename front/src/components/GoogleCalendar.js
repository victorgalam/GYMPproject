import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';

// פונקציה להוספת אירוע חד פעמי
export const addToGoogleCalendar = async (exerciseDetails) => {
    try {
        const token = localStorage.getItem('google_access_token');
        if (!token) {
            throw new Error('Google Calendar token not found');
        }

        // Format dates properly for Google Calendar
        const startDateTime = new Date(exerciseDetails.startDateTime);
        const endDateTime = new Date(exerciseDetails.endDateTime);

        // Create event body
        const event = {
            summary: exerciseDetails.summary,
            description: exerciseDetails.description,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'Asia/Jerusalem'
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'Asia/Jerusalem'
            }
        };

        // Make API request
        const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to add event to Google Calendar');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

// פונקציה להוספת אירוע מחזורי
export const addRecurringToGoogleCalendar = async (exerciseDetails, recurrence) => {
    try {
        const token = localStorage.getItem('google_access_token');
        if (!token) {
            throw new Error('Google Calendar token not found');
        }

        // Format dates
        const startDateTime = new Date(exerciseDetails.startDateTime);
        const endDateTime = new Date(exerciseDetails.endDateTime);

        // Create recurring event
        const event = {
            summary: exerciseDetails.summary,
            description: exerciseDetails.description,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'Asia/Jerusalem'
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'Asia/Jerusalem'
            },
            recurrence: recurrence.recurrence
        };

        const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to add recurring event to Google Calendar');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating recurring event:', error);
        throw error;
    }
};

const CalendarComponent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [calendarUrl, setCalendarUrl] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log('Token Response:', tokenResponse);
                localStorage.setItem('google_access_token', tokenResponse.access_token);

                // בדיקת תקינות הטוקן
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                if (!userInfo.ok) {
                    throw new Error('שגיאה בקבלת פרטי משתמש');
                }

                const userData = await userInfo.json();
                setUserEmail(userData.email);
                setIsAuthenticated(true);

                const embeddedCalendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userData.email)}&ctz=Asia/Jerusalem&mode=WEEK&showPrint=0&showTabs=1&showCalendars=1&showTz=1&height=600`;
                setCalendarUrl(embeddedCalendarUrl);
            } catch (error) {
                console.error('Login error:', error);
                localStorage.removeItem('google_access_token');
                setIsAuthenticated(false);
                alert('שגיאה בהתחברות. נא לנסות שוב.');
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            alert('ההתחברות נכשלה. נא לנסות שוב.');
        },
        scope: CALENDAR_SCOPE,
        flow: 'implicit'
    });

    // בדיקת תוקף הטוקן בטעינת הקומפוננטה
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('google_access_token');
            if (token) {
                try {
                    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Token invalid');
                    }

                    const userData = await response.json();
                    setUserEmail(userData.email);
                    setIsAuthenticated(true);

                    const embeddedCalendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userData.email)}&ctz=Asia/Jerusalem&mode=WEEK&showPrint=0&showTabs=1&showCalendars=1&showTz=1&height=600`;
                    setCalendarUrl(embeddedCalendarUrl);
                } catch (error) {
                    console.error('Token validation error:', error);
                    localStorage.removeItem('google_access_token');
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuth();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md">
            {!isAuthenticated ? (
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-center">היומן שלי</h2>
                    <div className="flex justify-center items-center h-64">
                        <button
                            onClick={() => login()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                            <span>התחבר עם Google</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex">
                    <div className="flex-1">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">יומן אימונים</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">{userEmail}</span>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('google_access_token');
                                        setIsAuthenticated(false);
                                        setCalendarUrl('');
                                        setUserEmail('');
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    התנתק
                                </button>
                            </div>
                        </div>
                        <div className="calendar-container" style={{ height: 'calc(100vh - 80px)' }}>
                            {calendarUrl && (
                                <iframe
                                    src={calendarUrl}
                                    style={{
                                        border: 0,
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    frameBorder="0"
                                    scrolling="no"
                                    title="Google Calendar"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const GoogleCalendar = () => (
    <CalendarComponent />
);

export default GoogleCalendar;
