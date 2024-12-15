import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';
import { GOOGLE_MAPS_API_KEY, WEATHER_API_KEY, MARKER_ICONS, LIBRARIES, MAP_STYLES, DEFAULT_CENTER } from '../constant/index';
import mapImage from '../source/pic/mapp.png';

function LocationsMap() {
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showType, setShowType] = useState('all');
    const [weatherData, setWeatherData] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isPasswordProtected, setIsPasswordProtected] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    // Fetch weather data on component mount
    useEffect(() => {
        const fetchInitialWeatherData = async () => {
            try {
                // Use default location if geolocation fails
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, () => {
                        resolve({ coords: DEFAULT_CENTER });
                    }, { timeout: 10000 });
                });

                const lat = position.coords.latitude || DEFAULT_CENTER.lat;
                const lng = position.coords.longitude || DEFAULT_CENTER.lng;

                if (WEATHER_API_KEY) {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setWeatherData(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching initial weather data:', error);
            }
        };

        fetchInitialWeatherData();
    }, []);

    const handlePasswordSubmit = () => {
        if (passwordInput.trim() === 'victor22') {
            // Store password validation in localStorage
            localStorage.setItem('mapAccessGranted', 'true');
            
            // Refresh the page
            window.location.reload();
        } else {
            setError('סיסמה שגויה. אנא נסה שוב.');
        }
    };

    // Check for existing access on component mount
    useEffect(() => {
        const hasAccess = localStorage.getItem('mapAccessGranted') === 'true';
        setIsPasswordProtected(!hasAccess);
    }, []);

    const isGoodForOutdoorWorkout = useCallback((temp) => {
        if (!temp) return false;
        return temp >= 16 && temp <= 28;
    }, []);

    const getWorkoutRecommendation = useCallback((temp) => {
        if (!temp) return "טוען נתוני מזג אוויר...";
        if (temp < 16) return "קר מדי - מומלץ להתאמן בפנים";
        if (temp > 28) return "חם מדי - מומלץ להתאמן בפנים או מוקדם בבוקר";
        return "מזג האוויר מושלם לאימון בחוץ!";
    }, []);

    const getCurrentLocation = useCallback(() => {
        if (!isMapLoaded) return;

        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(location);
                    if (map) map.panTo(location);
                    setLoading(false);
                },
                (error) => {
                    console.error('שגיאה בקבלת מיקום:', error);
                    setError('לא הצלחנו לקבל את המיקום שלך');
                    setLoading(false);
                },
                { timeout: 10000, maximumAge: 60000 }
            );
        } else {
            setError('הדפדפן שלך לא תומך באיתור מיקום');
            setLoading(false);
        }
    }, [map, isMapLoaded]);

    const fetchWeatherData = useCallback(async (lat, lng) => {
        if (!WEATHER_API_KEY) {
            console.warn('Weather API key is missing');
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
            );
            if (!response.ok) {
                throw new Error('Weather API response was not ok');
            }
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            setError('שגיאה בטעינת נתוני מזג אוויר');
        }
    }, []);

    const searchNearbyPlaces = useCallback((location, type) => {
        if (!map || !window.google || !isMapLoaded || !location) return;

        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            location: location,
            radius: 5000,
            type: type === 'gyms' ? 'gym' : 'park'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                const formattedPlaces = results
                    .filter(place => place.geometry?.location)
                    .map(place => ({
                        id: place.place_id,
                        name: place.name,
                        location: {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        },
                        vicinity: place.vicinity,
                        rating: place.rating,
                        type: type === 'gyms' ? 'gym' : 'park'
                    }));

                setPlaces(prev => [...prev, ...formattedPlaces]);
            }
        });
    }, [map, isMapLoaded]);

    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setError('חסר מפתח Google Maps API');
            return;
        }
    }, []);

    useEffect(() => {
        if (userLocation && isMapLoaded) {
            fetchWeatherData(userLocation.lat, userLocation.lng);
        }
    }, [userLocation, fetchWeatherData, isMapLoaded]);

    useEffect(() => {
        if (isMapLoaded) {
            getCurrentLocation();
        }
    }, [getCurrentLocation, isMapLoaded]);

    useEffect(() => {
        if (userLocation && map && isMapLoaded) {
            setPlaces([]);
            if (showType === 'all' || showType === 'gyms') {
                searchNearbyPlaces(userLocation, 'gyms');
            }
            if (showType === 'all' || showType === 'parks') {
                searchNearbyPlaces(userLocation, 'park');
            }
        }
    }, [userLocation, map, showType, searchNearbyPlaces, isMapLoaded]);

    const handleMapLoad = useCallback((map) => {
        setMap(map);
        setIsMapLoaded(true);
    }, []);

    const InfoWindowContent = ({ place, weather }) => {
        if (!weather || !weather.main) return (
            <div className="p-3 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-2">{place.vicinity}</p>
                <p>טוען נתוני מזג אוויר...</p>
            </div>
        );

        return (
            <div className="p-3 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-2">{place.vicinity}</p>

                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">
                            {Math.round(weather.main.temp)}°C
                        </span>
                        <span className="text-4xl">
                            {weather.weather?.[0]?.main === 'Clear' ? '☀️' :
                                weather.weather?.[0]?.main === 'Clouds' ? '☁️' :
                                    weather.weather?.[0]?.main === 'Rain' ? '🌧️' : '⛅'}
                        </span>
                    </div>
                </div>

                {place.rating && (
                    <div className="flex items-center mb-3">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span>{place.rating}</span>
                    </div>
                )}

                <button
                    onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;
                        window.open(url, '_blank');
                    }}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    נווט למקום
                </button>
            </div>
        );
    };

    const WeatherDisplay = ({ weather }) => {
        if (!weather || !weather.main) return null;

        const isGoodForOutdoorWorkout = (temp) => {
            return temp >= 16 && temp <= 28;
        };

        const getWorkoutRecommendation = (temp) => {
            if (temp < 16) return "קר מדי - מומלץ להתאמן בפנים";
            if (temp > 28) return "חם מדי - מומלץ להתאמן בפנים או מוקדם בבוקר";
            return "מזג האוויר מושלם לאימון בחוץ!";
        };

        return (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">מזג האוויר הנוכחי</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
                        <p className="text-gray-600">לחות: {weather.main.humidity}%</p>
                    </div>
                    <div className="text-5xl">
                        {weather.weather[0].main === 'Clear' ? '☀️' :
                         weather.weather[0].main === 'Clouds' ? '☁️' :
                         weather.weather[0].main === 'Rain' ? '🌧️' : '⛅'}
                    </div>
                </div>
                <p className={`mt-4 p-3 rounded-lg ${
                    isGoodForOutdoorWorkout(weather.main.temp)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {getWorkoutRecommendation(weather.main.temp)}
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8" dir="rtl">
            <div className="container mx-auto">
                {/* Weather Display - Always Visible */}
                {weatherData && (
                    <div className="mb-6">
                        <WeatherDisplay weather={weatherData} />
                    </div>
                )}

                {/* Map Image with Overlay */}
                {isPasswordProtected && (
                    <div className="relative">
                        <div className="relative">
                            <img 
                                src={mapImage} 
                                alt="מפת אימונים" 
                                className="w-full object-cover rounded-lg shadow-lg opacity-70"
                            />
                            <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                            
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                                <h2 className="text-4xl font-bold mb-4">מפת אימונים</h2>
                                <p className="text-xl mb-6">מפה זו זמינה למנויים בלבד</p>
                                <button 
                                    onClick={() => setShowPasswordModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
                                >
                                    הירשם למנוי
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                            <h3 className="text-2xl font-bold mb-4 text-center">כניסה למנויים</h3>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}
                            <input 
                                type="password"
                                value={passwordInput}
                                onChange={(e) => {
                                    setPasswordInput(e.target.value);
                                    setError(null);  
                                }}
                                placeholder="הזן סיסמה"
                                className="w-full px-4 py-2 border rounded-lg mb-4"
                            />
                            <div className="flex space-x-2 rtl:space-x-reverse">
                                <button 
                                    onClick={handlePasswordSubmit}
                                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    אישור
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordInput('');
                                        setError(null);
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    ביטול
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Map Content - Rendered only when not password protected */}
                {!isPasswordProtected && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                        <h1 className="text-3xl font-bold text-center mb-8">מקומות אימון בסביבה</h1>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <button
                                onClick={() => setShowType('all')}
                                className={`px-6 py-2 rounded-full transition-all ${showType === 'all'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                הכל
                            </button>
                            <button
                                onClick={() => setShowType('gyms')}
                                className={`px-6 py-2 rounded-full transition-all ${showType === 'gyms'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                חדרי כושר
                            </button>
                            <button
                                onClick={() => setShowType('parks')}
                                className={`px-6 py-2 rounded-full transition-all ${showType === 'parks'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                פארקים
                            </button>
                            <button
                                onClick={getCurrentLocation}
                                disabled={loading}
                                className={`px-6 py-2 rounded-full transition-all ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                                    }`}
                            >
                                {loading ? 'מאתר...' : 'מצא את המיקום שלי'}
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <div className="rounded-lg overflow-hidden shadow-md">
                            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
                                <GoogleMap
                                    mapContainerStyle={MAP_STYLES}
                                    center={userLocation || DEFAULT_CENTER}
                                    zoom={14}
                                    onLoad={handleMapLoad}
                                    options={{
                                        zoomControl: true,
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: true
                                    }}
                                >
                                    {userLocation && (
                                        <Marker
                                            position={userLocation}
                                            icon={MARKER_ICONS.user}
                                            title="המיקום שלך"
                                        />
                                    )}
                                    {places?.map(place => (
                                        <Marker
                                            key={place.id}
                                            position={place.location}
                                            icon={MARKER_ICONS[place.type]}
                                            onClick={() => setSelectedPlace(place)}
                                        />
                                    ))}

                                    {selectedPlace && (
                                        <InfoWindow
                                            position={selectedPlace.location}
                                            onCloseClick={() => setSelectedPlace(null)}
                                        >
                                            <InfoWindowContent place={selectedPlace} weather={weatherData} />
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LocationsMap;