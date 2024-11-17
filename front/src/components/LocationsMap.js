import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// הגדרת הספריות כקבוע מחוץ לקומפוננטה למניעת טעינה מחדש
const LIBRARIES = ['places'];
const GOOGLE_MAP_SERVICE_KEY = 'AIzaSyCwQtPxiF-P43WXmrcOHqQn1ULmzp25Qw';

const DEFAULT_CENTER = {
    lat: 32.0853,
    lng: 34.7818
};

const MAP_STYLES = {
    height: "70vh",
    width: "100%"
};

const MARKER_ICONS = {
    gym: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: { width: 30, height: 30 }
    },
    park: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: { width: 30, height: 30 }
    },
    user: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: { width: 40, height: 40 }
    }
};

const LocationsMap = () => {
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [showType, setShowType] = useState('all');
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placesLoading, setPlacesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);

    const mapOptions = useMemo(() => ({
        zoom: 14,
        center: userLocation || DEFAULT_CENTER,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    }), [userLocation]);

    const getCurrentLocation = useCallback(() => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('הדפדפן שלך לא תומך באיתור מיקום');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(location);
                if (map) {
                    map.panTo(location);
                }
                setLoading(false);
            },
            (error) => {
                console.error("שגיאה בקבלת המיקום:", error);
                setError('לא הצלחנו לאתר את המיקום שלך');
                setLoading(false);
            }
        );
    }, [map]);

    const searchPlaces = useCallback(async (location, type) => {
        if (!map || !window.google?.maps?.places) {
            console.error('Map or Places service not available');
            return;
        }

        setPlacesLoading(true);
        const service = new window.google.maps.places.PlacesService(map);
        
        const request = {
            location: location,
            radius: '5000',
            type: type === 'gym' ? ['gym'] : ['park']
        };

        try {
            const results = await new Promise((resolve, reject) => {
                service.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results);
                    } else {
                        reject(new Error(`Places search failed with status: ${status}`));
                    }
                });
            });

            const formattedPlaces = results.map(place => ({
                id: place.place_id,
                name: place.name,
                location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                rating: place.rating,
                vicinity: place.vicinity,
                type: type
            }));

            setPlaces(prev => {
                if (showType === 'all') {
                    const existingIds = new Set(prev.filter(p => p.type !== type).map(p => p.id));
                    return [...prev.filter(p => p.type !== type), ...formattedPlaces.filter(p => !existingIds.has(p.id))];
                }
                return formattedPlaces;
            });
        } catch (error) {
            console.error('Error searching places:', error);
            setError('אירעה שגיאה בחיפוש מקומות');
        } finally {
            setPlacesLoading(false);
        }
    }, [map, showType]);

    const getPlaceDetails = useCallback(async (placeId) => {
        if (!map || !window.google?.maps?.places) return;

        const service = new window.google.maps.places.PlacesService(map);
        
        try {
            const place = await new Promise((resolve, reject) => {
                service.getDetails({
                    placeId: placeId,
                    fields: [
                        'name',
                        'formatted_address',
                        'formatted_phone_number',
                        'opening_hours',
                        'website',
                        'rating',
                        'reviews',
                        'photos'
                    ]
                }, (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        resolve(result);
                    } else {
                        reject(new Error(`Place details failed with status: ${status}`));
                    }
                });
            });

            setSelectedPlace(prev => ({
                ...prev,
                details: {
                    address: place.formatted_address,
                    phone: place.formatted_phone_number,
                    hours: place.opening_hours?.weekday_text,
                    website: place.website,
                    rating: place.rating,
                    reviews: place.reviews,
                    photos: place.photos
                }
            }));
        } catch (error) {
            console.error('Error getting place details:', error);
        }
    }, [map]);

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
        setMapsLoaded(true);
    }, []);

    const handleTypeChange = useCallback((newType) => {
        setShowType(newType);
        setPlaces([]);
        setSelectedPlace(null);
    }, []);

    useEffect(() => {
        if (!map || !userLocation || !mapsLoaded) return;

        try {
            if (showType === 'all' || showType === 'gyms') {
                searchPlaces(userLocation, 'gym');
            }
            if (showType === 'all' || showType === 'parks') {
                searchPlaces(userLocation, 'park');
            }
        } catch (e) {
            console.error('Error searching places:', e);
            setError('אירעה שגיאה בחיפוש מקומות');
        }
    }, [map, userLocation, showType, searchPlaces, mapsLoaded]);

    useEffect(() => {
        getCurrentLocation();
        
        return () => {
            setMap(null);
            setMapsLoaded(false);
        };
    }, [getCurrentLocation]);

    const renderMap = () => (
        <GoogleMap
            mapContainerStyle={MAP_STYLES}
            options={mapOptions}
            onLoad={onMapLoad}
        >
            {mapsLoaded && window.google && (
                <>
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                ...MARKER_ICONS.user,
                                scaledSize: new window.google.maps.Size(
                                    MARKER_ICONS.user.scaledSize.width,
                                    MARKER_ICONS.user.scaledSize.height
                                )
                            }}
                        />
                    )}

                    {places.map(place => (
                        <Marker
                            key={place.id}
                            position={place.location}
                            onClick={() => {
                                setSelectedPlace(place);
                                getPlaceDetails(place.id);
                            }}
                            icon={{
                                ...MARKER_ICONS[place.type],
                                scaledSize: new window.google.maps.Size(
                                    MARKER_ICONS[place.type].scaledSize.width,
                                    MARKER_ICONS[place.type].scaledSize.height
                                )
                            }}
                        />
                    ))}

                    {selectedPlace && (
                        <InfoWindow
                            position={selectedPlace.location}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
                                {selectedPlace.rating && (
                                    <div className="flex items-center mt-1">
                                        <span className="text-yellow-400">
                                            {'★'.repeat(Math.floor(selectedPlace.rating))}
                                            {'☆'.repeat(5 - Math.floor(selectedPlace.rating))}
                                        </span>
                                        <span className="text-sm text-gray-600 mr-2">
                                            ({selectedPlace.rating})
                                        </span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mt-1">{selectedPlace.vicinity}</p>

                                {selectedPlace.details && (
                                    <>
                                        {selectedPlace.details.hours && (
                                            <div className="mt-2">
                                                <h4 className="font-semibold text-sm">שעות פעילות:</h4>
                                                <ul className="text-sm text-gray-600">
                                                    {selectedPlace.details.hours.map((hour, index) => (
                                                        <li key={index}>{hour}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {selectedPlace.details.phone && (
                                            <p className="text-sm mt-2">
                                                <span className="font-semibold">טלפון: </span>
                                                <a
                                                    href={`tel:${selectedPlace.details.phone}`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    {selectedPlace.details.phone}
                                                </a>
                                            </p>
                                        )}

                                        {selectedPlace.details.website && (
                                            <a
                                                href={selectedPlace.details.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 text-sm mt-2 block"
                                            >
                                                לאתר האינטרנט
                                            </a>
                                        )}

                                        <button
                                            onClick={() => {
                                                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.location.lat},${selectedPlace.location.lng}`;
                                                window.open(url, '_blank');
                                            }}
                                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition duration-200"
                                        >
                                            נווט למקום
                                        </button>
                                    </>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </>
            )}
        </GoogleMap>
    );

    if (!GOOGLE_MAP_SERVICE_KEY) {
        return <div className="text-center p-4">Missing Google Maps API key</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center mb-4">מפת מקומות</h1>

                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <div className="flex space-x-4 space-x-reverse">
                            {['all', 'gyms', 'parks'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleTypeChange(type)}
                                    className={`px-4 py-2 rounded-full ${
                                        showType === type 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {type === 'all' ? 'הכל' : type === 'gyms' ? 'חדרי כושר' : 'פארקים'}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={getCurrentLocation}
                            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'מאתר מיקום...' : 'מצא את המיקום שלי'}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-center mb-4">
                            {error}
                        </div>
                    )}

                    <LoadScript
                        googleMapsApiKey={GOOGLE_MAP_SERVICE_KEY}
                        libraries={LIBRARIES}
                    >
                        {renderMap()}
                    </LoadScript>

                    {placesLoading && (
                        <div className="text-center mt-4">
                            מחפש מקומות בסביבה...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationsMap;