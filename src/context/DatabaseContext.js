import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import initialData from '../data/database.json';

const DatabaseContext = createContext();

const normaliseString = (value) => value?.toString().trim().toLowerCase() ?? '';

export const DatabaseProvider = ({ children }) => {
  const [database, setDatabase] = useState(initialData);

  const addUser = useCallback((user) => {
    setDatabase((prev) => ({
      ...prev,
      users: [...prev.users, user],
      developers:
        user.role === 'developer'
          ? [...prev.developers, { id: `dev-${user.id}`, userId: user.id, title: 'Developer' }]
          : prev.developers,
      siteManagers:
        user.role === 'manager'
          ? [...prev.siteManagers, { id: `manager-${user.id}`, userId: user.id, siteId: null, assignedAt: null }]
          : prev.siteManagers,
    }));
  }, []);

  const updateUser = useCallback((userId, updates) => {
    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
    }));
  }, []);

  const addEvacSite = useCallback((site) => {
    setDatabase((prev) => ({
      ...prev,
      evacSites: [...prev.evacSites, site],
    }));
  }, []);

  const updateEvacSite = useCallback((siteId, updates) => {
    setDatabase((prev) => ({
      ...prev,
      evacSites: prev.evacSites.map((site) => (site.id === siteId ? { ...site, ...updates } : site)),
    }));
  }, []);

  const removeEvacSite = useCallback((siteId) => {
    setDatabase((prev) => ({
      ...prev,
      evacSites: prev.evacSites.filter((site) => site.id !== siteId),
      siteManagers: prev.siteManagers.map((manager) =>
        manager.siteId === siteId ? { ...manager, siteId: null } : manager
      ),
    }));
  }, []);

  const authenticate = useCallback(
    (username, password) => {
      const match = database.users.find(
        (user) => normaliseString(user.username) === normaliseString(username) && user.password === password
      );
      return match ?? null;
    },
    [database.users]
  );

  const usernameExists = useCallback(
    (username) => database.users.some((user) => normaliseString(user.username) === normaliseString(username)),
    [database.users]
  );

  const assignManagerToSite = useCallback((managerId, siteId) => {
    setDatabase((prev) => ({
      ...prev,
      siteManagers: prev.siteManagers.map((manager) =>
        manager.id === managerId ? { ...manager, siteId, assignedAt: new Date().toISOString() } : manager
      ),
    }));
  }, []);

  const removeSiteManager = useCallback((managerId) => {
    setDatabase((prev) => ({
      ...prev,
      siteManagers: prev.siteManagers.filter((manager) => manager.id !== managerId),
    }));
  }, []);

  const removePendingRegistration = useCallback((pendingId) => {
    setDatabase((prev) => ({
      ...prev,
      pendingRegistrations: prev.pendingRegistrations.filter((req) => req.id !== pendingId),
    }));
  }, []);

  const value = useMemo(() => {
    const siteManagers = database.siteManagers.map((manager) => {
      const user = database.users.find((u) => u.id === manager.userId);
      const site = database.evacSites.find((s) => s.id === manager.siteId);
      return {
        ...manager,
        user,
        site,
      };
    });

    const developers = database.developers.map((developer) => {
      const user = database.users.find((u) => u.id === developer.userId);
      return {
        ...developer,
        user,
      };
    });

    return {
      raw: database,
      users: database.users,
      evacSites: database.evacSites,
      siteManagers,
      developers,
      pendingRegistrations: database.pendingRegistrations,
      addUser,
      updateUser,
      addEvacSite,
      updateEvacSite,
      removeEvacSite,
      assignManagerToSite,
      removeSiteManager,
      removePendingRegistration,
      authenticate,
      usernameExists,
    };
  }, [
    database,
    addUser,
    updateUser,
    addEvacSite,
    updateEvacSite,
    removeEvacSite,
    assignManagerToSite,
    removeSiteManager,
    removePendingRegistration,
    authenticate,
    usernameExists,
  ]);

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
