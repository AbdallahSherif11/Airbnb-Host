// src/app/utils/auth.utils.ts

const TOKEN_KEY = 'authToken';
const EMAIL_KEY = 'auth_email';

// Helper function to check if we are in a browser environment
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && !!window.localStorage;
};

export const setAuthToken = (token: string, email?: string): void => {
  try {
    if (!isBrowser()) return;

    // Test read/write capability
    const testKey = '__auth_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    localStorage.setItem(TOKEN_KEY, token);
    if (email) {
      localStorage.setItem(EMAIL_KEY, email);
    }
  } catch {
    // Silently fail
  }
};

export const getAuthToken = (): string | null => {
  try {
    if (!isBrowser()) return null;

    // Optional: test localStorage read access
    const testKey = '__auth_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getAuthEmail = (): string | null => {
  try {
    if (!isBrowser()) return null;
    return localStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
};

export const clearAuthToken = (): void => {
  try {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  } catch {
    // Silently fail
  }
};
