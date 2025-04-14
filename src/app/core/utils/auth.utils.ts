import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * Safely checks if authToken exists with all possible protections:
 * 1. SSR safety (isPlatformBrowser)
 * 2. Window undefined check
 * 3. localStorage existence check
 * 4. Read/write capability test
 * 5. Private browsing protection
 */
export const getAuthToken = (): string | null => {
  try {
    // 1. Angular SSR platform check
    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) return null;

    // 2. Window and localStorage existence check
    if (typeof window === 'undefined' || !window.localStorage) return null;

    // 3. Read/write capability test
    const testKey = '__auth_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);

    // 4. Only read if storage has items
    return window.localStorage.length > 0 
      ? window.localStorage.getItem('authToken')
      : null;
  } catch {
    // 5. Fail gracefully for all exceptions (private browsing, security restrictions)
    return null;
  }
};