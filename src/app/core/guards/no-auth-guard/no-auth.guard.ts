// src/app/core/guards/no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuthToken } from '../../utils/auth.utils';

export const noAuthGuard: CanActivateFn = () => {
  return getAuthToken() ? inject(Router).parseUrl('/home') : true;
};