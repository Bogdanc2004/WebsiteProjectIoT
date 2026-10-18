// Authentication service for Planta.
// Handles PBKDF2 password hashing, session cookies, and AWS Lambda storage.

const AWS_USERS_URL = "https://smkqi64yworqw6lfwuywsvsk2q0hdixk.lambda-url.eu-central-1.on.aws/";

const COOKIE_NAME = 'session_id';
const COOKIE_EXPIRY_DAYS = 7;
const SESSIONS_STORE_KEY = 'planta_sessions_store';
const LEGACY_AUTH_KEY = 'planta_auth';

// In-memory cache for fast access without polluting localStorage
let usersMemoryCache = null;
let usersCacheTimestamp = 0;
const CACHE_TTL_MS = 10_000;

// Cookie utilities

export function getCookie(name = COOKIE_NAME) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name, value, days = COOKIE_EXPIRY_DAYS) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name = COOKIE_NAME) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

// PBKDF2 hashing and cryptographic utilities

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Generates a random hexadecimal string of the specified byte length.
export function generateRandomHex(byteCount = 16) {
  const array = new Uint8Array(byteCount);
  window.crypto.getRandomValues(array);
  return bytesToHex(array);
}

// Derives a PBKDF2 key hash using HMAC-SHA256 and salt.
export async function hashPasswordPBKDF2(password, saltHex, iterations = 100000) {
  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = hexToBytes(saltHex);
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  return bytesToHex(new Uint8Array(derivedBits));
}

// AWS Lambda and S3 storage layer

// Loads users from AWS S3 via Lambda with local fallback.
async function loadUsersDb(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && usersMemoryCache && now - usersCacheTimestamp < CACHE_TTL_MS) {
    return usersMemoryCache;
  }

  try {
    const res = await fetch(AWS_USERS_URL);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        usersMemoryCache = data;
        usersCacheTimestamp = now;
        try { localStorage.setItem('planta_users_db', JSON.stringify(data)); } catch {}
        return usersMemoryCache;
      }
    }
  } catch (err) {
    console.warn('[Planta Auth] Failed to fetch users from AWS Lambda:', err);
  }

  // Fallback to local storage
  try {
    const local = localStorage.getItem('planta_users_db');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        usersMemoryCache = parsed;
        usersCacheTimestamp = now;
        return parsed;
      }
    }
  } catch {}

  return usersMemoryCache || [];
}

// Saves users to AWS S3 via Lambda with local backup.
async function saveUsersDb(users) {
  usersMemoryCache = users;
  usersCacheTimestamp = Date.now();

  try {
    localStorage.setItem('planta_users_db', JSON.stringify(users));
  } catch {}

  try {
    const res = await fetch(AWS_USERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users)
    });

    if (!res.ok) {
      let serverError = '';
      try {
        const json = await res.json();
        if (json?.error) serverError = json.error;
      } catch {}

      console.error('[Planta Auth] AWS Lambda Error:', serverError || `HTTP ${res.status}`);
      throw new Error(serverError || `AWS Lambda returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('[Planta Auth] Failed to save users to AWS Lambda:', err);
    throw err;
  }
}

function loadSessionsStore() {
  try {
    const raw = localStorage.getItem(SESSIONS_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSessionsStore(sessions) {
  localStorage.setItem(SESSIONS_STORE_KEY, JSON.stringify(sessions));
}

function createSession(user) {
  const sessionId = generateRandomHex(32);
  const sessions = loadSessionsStore();
  const now = Date.now();

  sessions[sessionId] = {
    userId: user.id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    createdAt: now,
    expiresAt: now + COOKIE_EXPIRY_DAYS * 864e5,
  };

  saveSessionsStore(sessions);
  setCookie(COOKIE_NAME, sessionId, COOKIE_EXPIRY_DAYS);
  return sessionId;
}

function invalidateCurrentSession() {
  const sessionId = getCookie(COOKIE_NAME);
  if (sessionId) {
    const sessions = loadSessionsStore();
    delete sessions[sessionId];
    saveSessionsStore(sessions);
  }
  deleteCookie(COOKIE_NAME);
  localStorage.removeItem(LEGACY_AUTH_KEY);
}

// Public authentication API

// Returns the active user from the session cookie without exposing credentials.
export function getCurrentUser() {
  const sessionId = getCookie(COOKIE_NAME);

  if (!sessionId) {
    return null;
  }

  const sessions = loadSessionsStore();
  const session = sessions[sessionId];

  if (!session) {
    deleteCookie(COOKIE_NAME);
    return null;
  }

  // Check if session has expired
  if (session.expiresAt && Date.now() > session.expiresAt) {
    delete sessions[sessionId];
    saveSessionsStore(sessions);
    deleteCookie(COOKIE_NAME);
    return null;
  }

  return session.user || {
    id: session.userId,
    email: '',
    name: 'User',
    createdAt: session.createdAt,
  };
}

// Registers a new user with PBKDF2 password hashing and saves to AWS S3.
export async function signup(name, email, password) {
  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    throw new Error('All fields are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  if (!cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address');
  }

  const users = await loadUsersDb(true);
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  // Generate 128-bit cryptographic salt
  const salt = generateRandomHex(16);
  const iterations = 100000;

  // PBKDF2 password hashing with salt
  const passwordHash = await hashPasswordPBKDF2(password, salt, iterations);

  const newUser = {
    id: 'user-' + Date.now(),
    email: cleanEmail,
    name: cleanName,
    salt,
    passwordHash,
    iterations,
    createdAt: Date.now(),
  };

  users.push(newUser);
  await saveUsersDb(users);

  // Set session cookie and create active session
  createSession(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    createdAt: newUser.createdAt,
  };
}

// Authenticates credentials against PBKDF2 hash and creates a session cookie.
export async function login(email, password) {
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }

  const users = await loadUsersDb(true);
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    throw new Error('Invalid email or password. Please sign up if you do not have an account.');
  }

  // Verify password using stored salt and iterations
  const candidateHash = await hashPasswordPBKDF2(
    password,
    user.salt,
    user.iterations || 100000
  );

  if (candidateHash !== user.passwordHash) {
    throw new Error('Invalid email or password');
  }

  // Create session cookie
  createSession(user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

// Logs out the user and clears the session cookie.
export async function logout() {
  await new Promise(r => setTimeout(r, 100));
  invalidateCurrentSession();
}

// Deletes an account from AWS S3 and ends the current session.
export async function deleteAccount(userIdOrEmail) {
  const current = getCurrentUser();
  const target = userIdOrEmail || current?.id;
  if (!target) return;

  const users = await loadUsersDb(true);
  const filtered = users.filter(u => u.id !== target && u.email.toLowerCase() !== String(target).toLowerCase());
  await saveUsersDb(filtered);

  if (!userIdOrEmail || target === current?.id || target === current?.email) {
    invalidateCurrentSession();
  }
}

// Clears all local auth cache, session data, and cookies.
export function clearAllAuthData() {
  usersMemoryCache = null;
  localStorage.removeItem(SESSIONS_STORE_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  localStorage.removeItem('planta_users_db');
  deleteCookie(COOKIE_NAME);
}

// Expose on window for browser console testing
if (typeof window !== 'undefined') {
  window.deleteAccount = deleteAccount;
  window.clearAllAuthData = clearAllAuthData;
}
