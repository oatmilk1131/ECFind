import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { authenticate, usernameExists, addUser } = useDatabase();
  const [currentUser, setCurrentUser] = useState(null);

  const logIn = useCallback(
    async ({ username, password }) => {
      const trimmedUsername = username?.trim();
      if (!trimmedUsername || !password) {
        throw new Error('Please enter both username and password.');
      }

      const user = authenticate(trimmedUsername, password);
      if (!user) {
        throw new Error('Invalid username or password.');
      }

      setCurrentUser(user);
      return user;
    },
    [authenticate]
  );

  const signOut = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const signUp = useCallback(
    async ({ name, username, password, contactNumber, role = 'resident' }) => {
      if (!name || !username || !password || !contactNumber) {
        throw new Error('Please complete all fields before signing up.');
      }

      if (usernameExists(username)) {
        throw new Error('That username is already taken.');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        username: username.trim(),
        password,
        contactNumber: contactNumber.trim(),
        role,
      };

      addUser(newUser);
      setCurrentUser(newUser);
      return newUser;
    },
    [addUser, usernameExists]
  );

  const value = useMemo(
    () => ({
      currentUser,
      userToken: currentUser ? `token-${currentUser.id}` : null,
      logIn,
      signOut,
      signUp,
    }),
    [currentUser, logIn, signOut, signUp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);