import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

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
   // States
   const [map, setMap] = useState(null);
   const [places, setPlaces] = useState([]);
   const [selectedPlace, setSelectedPlace] = useState(null);
   const [userLocation, setUserLocation] = useState(null);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);
   const [showType, setShowType] = useState('all');
   const [weatherData, setWeatherData] = useState(null);

   // פונקציה לבדיקת תנאי מזג אוויר לאימון בחוץ
   // עדכון פונקציית isGoodForOutdoorWorkout
const isGoodForOutdoorWorkout = (temp) => {
    if (!temp) return false;
    return temp >= 16 && temp <= 28;
};

// עדכון פונקציית getWorkoutRecommendation
const getWorkoutRecommendation = (temp) => {
    if (!temp) return "טוען נתוני מזג אוויר...";
    if (temp < 16) return "קר מדי - מומלץ להתאמן בפנים";
    if (temp > 28) return "חם מדי - מומלץ להתאמן בפנים או מוקדם בבוקר";
    return "מזג האוויר מושלם לאימון בחוץ!";
};

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

   // פונקציה לקבלת נתוני מזג אוויר
   const fetchWeatherData = useCallback(async (lat, lng) => {
       try {
           const response = await fetch(
               `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
           );
           const data = await response.json();
           setWeatherData(data);
       } catch (error) {
           console.error('Error fetching weather:', error);
       }
   }, []);

   // חיפוש מקומות בסביבה
   const searchNearbyPlaces = useCallback((location, type) => {
       if (!map || !window.google) return;

       const service = new window.google.maps.places.PlacesService(map);
       const request = {
           location: location,
           radius: 5000,
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

   // Effects
   useEffect(() => {
       if (userLocation) {
           fetchWeatherData(userLocation.lat, userLocation.lng);
       }
   }, [userLocation, fetchWeatherData]);

   useEffect(() => {
       if (!GOOGLE_MAPS_API_KEY) {
           setError('חסר מפתח Google Maps API');
       }
   }, []);

   useEffect(() => {
       getCurrentLocation();
   }, [getCurrentLocation]);

   useEffect(() => {
       if (userLocation && map) {
           setPlaces([]);
           if (showType === 'all' || showType === 'gyms') {
               searchNearbyPlaces(userLocation, 'gyms');
           }
           if (showType === 'all' || showType === 'parks') {
               searchNearbyPlaces(userLocation, 'park');
           }
       }
   }, [userLocation, map, showType, searchNearbyPlaces]);

   // תצוגת שגיאה אם אין מפתח API
   if (!GOOGLE_MAPS_API_KEY) {
       return (
           <div className="min-h-screen bg-gray-50 flex items-center justify-center">
               <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                   <h2 className="text-xl font-bold mb-2">שגיאת תצורה</h2>
                   <p>חסר מפתח Google Maps API</p>
               </div>
           </div>
       );
   }

   // תוכן חלון המידע
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

// WeatherDisplay component
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
                    {weather.weather?.[0]?.main === 'Clear' ? '☀️' :
                     weather.weather?.[0]?.main === 'Clouds' ? '☁️' :
                     weather.weather?.[0]?.main === 'Rain' ? '🌧️' : '⛅'}
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
                               {userLocation && (
                                   <Marker
                                       position={userLocation}
                                       icon={MARKER_ICONS.user}
                                       title="המיקום שלך"
                                   />
                               )}

                               {places.map(place => (
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
                                       <InfoWindowContent place={selectedPlace} />
                                   </InfoWindow>
                               )}
                           </GoogleMap>
                       </LoadScript>
                   </div>

                   {/* תצוגת מזג אוויר */}
                   {weatherData && (
                       <div className="mt-6 p-4 bg-white rounded-lg shadow">
                           <h2 className="text-xl font-bold mb-4">מזג האוויר הנוכחי</h2>
                           <div className="flex items-center justify-between">
                               <div>
                                   <p className="text-3xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                                   <p className="text-gray-600">לחות: {weatherData.main.humidity}%</p>
                               </div>
                               <div className="text-5xl">
                                   {weatherData.weather[0].main === 'Clear' ? '☀️' :
                                    weatherData.weather[0].main === 'Clouds' ? '☁️' :
                                    weatherData.weather[0].main === 'Rain' ? '🌧️' : '⛅'}
                               </div>
                           </div>
                           <p className={`mt-4 p-3 rounded-lg ${
                               isGoodForOutdoorWorkout(weatherData.main.temp)
                                   ? 'bg-green-100 text-green-800'
                                   : 'bg-yellow-100 text-yellow-800'
                           }`}>
                               {getWorkoutRecommendation(weatherData.main.temp)}
                           </p>


                           {selectedPlace && (
            <InfoWindow
                position={selectedPlace.location}
                onCloseClick={() => setSelectedPlace(null)}
            >
                <InfoWindowContent 
                    place={selectedPlace} 
                    weather={weatherData} 
                />
            </InfoWindow>
        )}
                       </div>
                   )}
               </div>
           </div>
       </div>
   );
}

export default LocationsMap;