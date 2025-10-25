import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const authContext = {
    logIn: () => setUserToken('dummy-token'),
    signOut: () => setUserToken(null),
    signUp: () => setUserToken('dummy-token'),
    userToken,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);