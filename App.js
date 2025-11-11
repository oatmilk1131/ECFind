import React from 'react';
import './global.css';
import { DatabaseProvider } from './src/context/DatabaseContext';
import { AuthProvider } from './src/context/Auth';
import AppNavigator from './src/navigation/nav';
import { LocationProvider } from './src/LocationContext';

export default function App() {
  return (
    <DatabaseProvider>
      <LocationProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </LocationProvider>
    </DatabaseProvider>
  );
}