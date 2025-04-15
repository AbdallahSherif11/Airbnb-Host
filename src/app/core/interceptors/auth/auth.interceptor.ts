// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { getAuthToken } from '../../utils/auth.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAuthToken();
  return token 
    ? next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
    : next(req);
};