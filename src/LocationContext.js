import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const LocationContext = createContext(null);

const FALLBACK_COORDS = {
  coords: { latitude: 14.649102416560252, longitude: 121.04385011188928 },
  mocked: true,
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const requestPermission = async () => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        // optional: use fallback coords so UI can continue
        setLocation(FALLBACK_COORDS);
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      setLocation(current);
    } catch (e) {
      console.warn('Location error', e);
      setError('Failed to get location');
      // fallback to a safe default so app isn't stuck
      setLocation(FALLBACK_COORDS);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // Provide an object so callers can access location, error and retry
  return (
    <LocationContext.Provider value={{ location, error, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

export default function PlaceholderScreen() {
  return null;
}

