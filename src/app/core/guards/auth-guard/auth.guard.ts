import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuthToken } from '../../utils/auth.utils';

export const authGuard: CanActivateFn = () => {
  return getAuthToken() ? true : inject(Router).parseUrl('/auth/login');
};