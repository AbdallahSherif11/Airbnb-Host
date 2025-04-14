// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. First check if localStorage is available
  const isLocalStorageAvailable = (): boolean => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // 2. Only proceed if localStorage is available and has items
  if (isLocalStorageAvailable() && localStorage.length > 0) {
    const token = localStorage.getItem('authToken');
    
    // 3. If token exists, add it to the request
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  }

  // 4. Continue with the original request if no token
  return next(req);
};