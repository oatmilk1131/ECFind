import React from 'react';
import './global.css';
import { AuthProvider } from './src/context/Auth';
import AppNavigator from './src/navigation/nav';
import { LocationProvider } from './src/LocationContext';

export default function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </LocationProvider>
  );
}