import { isPlatformBrowser } from '@angular/common';

// Remove the inject(PLATFORM_ID) approach and use direct platform checks
export const getAuthToken = (): string | null => {
  try {
    // 1. Basic browser environment checks
    if (typeof window === 'undefined' || !window.localStorage) return null;

    // 2. Read/write capability test
    const testKey = '__auth_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);

    // 3. Get the token directly
    return window.localStorage.getItem('authToken');
  } catch {
    // 4. Fail gracefully for all exceptions
    return null;
  }
};

export const clearAuthToken = (): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem('authToken');
  } catch {
    // Silently fail
  }
};

// Add this new function to set the token
export const setAuthToken = (token: string): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem('authToken', token);
  } catch {
    // Silently fail
  }
};