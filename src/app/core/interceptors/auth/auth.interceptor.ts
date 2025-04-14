import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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

  // 2. Only proceed if localStorage is available and has items
  if (isLocalStorageAvailable() && window.localStorage.length > 0) {
    const token = window.localStorage.getItem('authToken');
    
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