import React from 'react';
import './global.css';
import { AuthProvider } from './src/context/Auth';
import AppNavigator from './src/navigation/nav';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}