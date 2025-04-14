// src/app/core/guards/no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  // 1. Check if localStorage is available
  const isLocalStorageAvailable = (): boolean => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // 2. Get token safely
  let token: string | null = null;
  if (isLocalStorageAvailable() && window.localStorage.length > 0) {
    token = window.localStorage.getItem('authToken');
  }

  // 3. Redirect if token exists
  if (token) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};