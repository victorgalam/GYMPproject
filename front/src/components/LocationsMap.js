
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// שימוש במפתח מקובץ .env
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
console.log("API key loaded:", !!GOOGLE_MAPS_API_KEY); // בדיקה שהמפתח נטען

// קבועים
const LIBRARIES = ['places'];
const MAP_STYLES = { height: "70vh", width: "100%" };
const DEFAULT_CENTER = { lat: 31.7683, lng: 35.2137 }; // מרכז ישראל

const MARKER_ICONS = {
    gym: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    park: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    user: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
};

function LocationsMap() {
    // סטייטים
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showType, setShowType] = useState('all');

    // קבלת מיקום המשתמש
    const getCurrentLocation = useCallback(() => {
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
                }
            );
        } else {
            setError('הדפדפן שלך לא תומך באיתור מיקום');
            setLoading(false);
        }
    }, [map]);

    // חיפוש מקומות בסביבה
    const searchNearbyPlaces = useCallback((location, type) => {
        if (!map || !window.google) return;

        const service = new window.google.maps.places.PlacesService(map);
        const request = {
            location: location,
            radius: 5000, // רדיוס של 5 ק"מ
            type: type === 'gyms' ? ['gym'] : ['park']
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const formattedPlaces = results.map(place => ({
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
    }, [map]);

    // אפקטים
    useEffect(() => {
        // בדיקת מפתח API
        if (!GOOGLE_MAPS_API_KEY) {
            setError('חסר מפתח Google Maps API');
        }
    }, []);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    useEffect(() => {
        if (userLocation && map) {
            setPlaces([]); // ניקוי מקומות קודמים
            if (showType === 'all' || showType === 'gyms') {
                searchNearbyPlaces(userLocation, 'gyms');
            }
            if (showType === 'all' || showType === 'parks') {
                searchNearbyPlaces(userLocation, 'park');
            }
        }
    }, [userLocation, map, showType, searchNearbyPlaces]);

    // בדיקת שגיאות
    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">שגיאת תצורה</h2>
                    <p>חסר מפתח Google Maps API</p>
                    <p className="text-sm mt-2">בדוק את קובץ .env</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8" dir="rtl">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-8">מקומות אימון בסביבה</h1>

                    {/* כפתורי סינון */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <button
                            onClick={() => setShowType('all')}
                            className={`px-6 py-2 rounded-full transition-all ${
                                showType === 'all' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            הכל
                        </button>
                        <button
                            onClick={() => setShowType('gyms')}
                            className={`px-6 py-2 rounded-full transition-all ${
                                showType === 'gyms' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            חדרי כושר
                        </button>
                        <button
                            onClick={() => setShowType('parks')}
                            className={`px-6 py-2 rounded-full transition-all ${
                                showType === 'parks' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            פארקים
                        </button>
                        <button
                            onClick={getCurrentLocation}
                            disabled={loading}
                            className={`px-6 py-2 rounded-full transition-all ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                            }`}
                        >
                            {loading ? 'מאתר...' : 'מצא את המיקום שלי'}
                        </button>
                    </div>

                    {/* הודעות שגיאה */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* המפה */}
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
                            <GoogleMap
                                mapContainerStyle={MAP_STYLES}
                                center={userLocation || DEFAULT_CENTER}
                                zoom={14}
                                onLoad={map => setMap(map)}
                                options={{
                                    zoomControl: true,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: true
                                }}
                            >
                                {/* סמן המיקום של המשתמש */}
                                {userLocation && (
                                    <Marker
                                        position={userLocation}
                                        icon={MARKER_ICONS.user}
                                        title="המיקום שלך"
                                    />
                                )}

                                {/* סמני המקומות */}
                                {places.map(place => (
                                    <Marker
                                        key={place.id}
                                        position={place.location}
                                        icon={MARKER_ICONS[place.type]}
                                        onClick={() => setSelectedPlace(place)}
                                    />
                                ))}

                                {/* חלון מידע למקום נבחר */}
                                {selectedPlace && (
                                    <InfoWindow
                                        position={selectedPlace.location}
                                        onCloseClick={() => setSelectedPlace(null)}
                                    >
                                        <div className="p-2 min-w-[200px]">
                                            <h3 className="font-bold text-lg mb-2">{selectedPlace.name}</h3>
                                            <p className="text-gray-600 mb-2">{selectedPlace.vicinity}</p>
                                            {selectedPlace.rating && (
                                                <div className="flex items-center mb-3">
                                                    <span className="text-yellow-400 mr-1">⭐</span>
                                                    <span>{selectedPlace.rating}</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.location.lat},${selectedPlace.location.lng}`;
                                                    window.open(url, '_blank');
                                                }}
                                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                            >
                                                נווט למקום
                                            </button>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationsMap;
