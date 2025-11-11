import React, { createContext, useContext, useState } from 'react';
import { loadUsers, authenticateUser, registerUser } from '../utils/dataService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const logIn = (userData) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(userData);
      setIsLoading(false);
    }, 500);
  };

  const logOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logIn, logOut, authenticateUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
