const database = require('../data/database.json');

export const loadDatabase = () => database;

export const loadCredentials = () => database.credentials ?? { users: [] };
const ensureCredentialUsers = () => {
  if (!database.credentials) database.credentials = { users: [] };
  if (!Array.isArray(database.credentials.users)) database.credentials.users = [];
  return database.credentials.users;
};

export const loadUsers = () => database.users ?? { users: [] };
const ensureUserProfiles = () => {
  if (!database.users) database.users = { users: [] };
  if (!Array.isArray(database.users.users)) database.users.users = [];
  return database.users.users;
};

export const loadEvacuationSites = () => database.evacuationSites ?? { sites: [] };

const ensureEvacuationSites = () => {
  if (!database.evacuationSites) {
    database.evacuationSites = { sites: [] };
  }
  if (!Array.isArray(database.evacuationSites.sites)) {
    database.evacuationSites.sites = [];
  }
  return database.evacuationSites.sites;
};

export const loadSiteManagers = () => database.siteManagers ?? { managers: [] };

const ensureSiteManagers = () => {
  if (!database.siteManagers) database.siteManagers = { managers: [] };
  if (!Array.isArray(database.siteManagers.managers)) database.siteManagers.managers = [];
  return database.siteManagers.managers;
};

export const loadDevelopers = () => database.developers ?? { developers: [] };

export const loadSiteManagerRequests = () => database.siteManagerRequests ?? { requests: [] };

const ensureSiteManagerRequests = () => {
  if (!database.siteManagerRequests) database.siteManagerRequests = { requests: [] };
  if (!Array.isArray(database.siteManagerRequests.requests)) {
    database.siteManagerRequests.requests = [];
  }
  return database.siteManagerRequests.requests;
};

export const setUserRole = (userId, role) => {
  const credentialUsers = ensureCredentialUsers();
  const profileUsers = ensureUserProfiles();
  const updatedAt = new Date().toISOString();

  const updateRole = (list) => {
    const index = list.findIndex((user) => user.id === userId);
    if (index >= 0) {
      list[index] = { ...list[index], role, updatedAt };
      return list[index];
    }
    return null;
  };

  const credentialUser = updateRole(credentialUsers);
  const profileUser = updateRole(profileUsers);

  return { credentialUser, profileUser };
};

export const loadEvacuationSiteById = (siteId) => {
  return ensureEvacuationSites().find((site) => site.id === siteId);
};

export const upsertEvacuationSite = (sitePartial = {}) => {
  const sites = ensureEvacuationSites();
  const nextId = sites.length ? Math.max(...sites.map((s) => s.id ?? 0)) + 1 : 1;
  const targetId = sitePartial.id ?? nextId;
  const index = sites.findIndex((site) => site.id === targetId);

  const existing = index >= 0 ? sites[index] : {};
  const merged = {
    ...existing,
    ...sitePartial,
  };

  const resolvedMax = Number(
    merged.maxCapacity ??
      merged.capacity ??
      existing.maxCapacity ??
      existing.capacity ??
      0
  );
  if (!('maxCapacity' in merged)) merged.maxCapacity = resolvedMax;
  if (!('capacity' in merged)) merged.capacity = resolvedMax;

  const resolvedSlots =
    merged.slotsAvailable ?? existing.slotsAvailable ?? resolvedMax;

  merged.slotsAvailable = Number.isNaN(Number(resolvedSlots))
    ? resolvedMax
    : resolvedSlots;
  merged.lastUpdated = merged.lastUpdated ?? new Date().toISOString();
  merged.id = targetId;
  merged.images = Array.isArray(merged.images) ? merged.images : [];
  if (!('createdBy' in merged)) {
    merged.createdBy = existing.createdBy ?? null;
  }

  if (index >= 0) {
    sites[index] = merged;
  } else {
    sites.push(merged);
  }

  return merged;
};

export const deleteEvacuationSite = (siteId) => {
  const sites = ensureEvacuationSites();
  const index = sites.findIndex((site) => site.id === siteId);
  if (index < 0) return false;
  sites.splice(index, 1);

  const managers = ensureSiteManagers();
  managers.forEach((manager) => {
    if (manager.siteId === siteId) {
      manager.siteId = null;
      manager.status = 'inactive';
    }
  });
  return true;
};

export const updateSiteSlots = (siteId, slotsAvailable) => {
  const value =
    typeof slotsAvailable === 'number'
      ? slotsAvailable
      : Number.parseInt(slotsAvailable, 10);
  return upsertEvacuationSite({
    id: siteId,
    slotsAvailable: Number.isNaN(value) ? 0 : value,
    lastUpdated: new Date().toISOString(),
  });
};

export const updateSiteImages = (siteId, images = []) => {
  const sanitized = images.filter(Boolean);
  return upsertEvacuationSite({
    id: siteId,
    images: sanitized,
    lastUpdated: new Date().toISOString(),
  });
};

export const updateSiteStatus = (siteId, status) => {
  if (!['active', 'standby'].includes(status)) {
    throw new Error('Invalid status');
  }
  return upsertEvacuationSite({
    id: siteId,
    status,
    lastUpdated: new Date().toISOString(),
  });
};

export const createSiteManagerRequest = ({
  userId,
  username,
  fullName,
  contactNumber,
  reason,
}) => {
  if (!userId) throw new Error('User ID is required');
  const requests = ensureSiteManagerRequests();
  const existingPending = requests.find(
    (req) => req.userId === userId && req.status === 'pending'
  );
  if (existingPending) {
    return existingPending;
  }

  const newRequest = {
    id: requests.length ? Math.max(...requests.map((r) => r.id ?? 0)) + 1 : 1,
    userId,
    username,
    fullName,
    contactNumber,
    reason,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  return newRequest;
};

export const updateSiteManagerRequestStatus = (requestId, status) => {
  const allowed = ['approved', 'declined', 'pending'];
  if (!allowed.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const requests = ensureSiteManagerRequests();
  const index = requests.findIndex((req) => req.id === requestId);
  if (index < 0) {
    throw new Error('Request not found');
  }
  const request = requests[index];
  request.status = status;
  request.updatedAt = new Date().toISOString();

  if (status === 'approved') {
    setUserRole(request.userId, 'manager');
  }

  return request;
};

export const registerUser = ({ fullName, username, contactNumber, password }) => {
  if (!fullName || !username || !password) {
    throw new Error('Missing required fields: name, username, password');
  }
  const credentialUsers = ensureCredentialUsers();
  const profiles = ensureUserProfiles();

  const existing = credentialUsers.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
  if (existing) {
    throw new Error('Username already exists');
  }

  const nextId = credentialUsers.length
    ? Math.max(...credentialUsers.map((u) => u.id ?? 0)) + 1
    : 1;
  const profile = {
    id: nextId,
    username,
    email: `${username}@example.com`,
    fullName,
    role: 'user',
    phone: contactNumber ?? '',
    createdAt: new Date().toISOString(),
  };
  const credential = {
    id: nextId,
    username,
    password,
    email: profile.email,
    role: 'user',
  };

  profiles.push(profile);
  credentialUsers.push(credential);

  return { profile, credential };
};

export const authenticateUser = (username, password) => {
  const { users } = loadCredentials();
  return users.find(
    (user) =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.password === password
  );
};
