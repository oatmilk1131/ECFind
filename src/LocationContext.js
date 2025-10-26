import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let current = await Location.getCurrentPositionAsync({});
      setLocation(current);
    })();
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export default function PlaceholderScreen() {
  return null;
}

