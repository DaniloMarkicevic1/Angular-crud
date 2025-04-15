import { CanActivateFn } from '@angular/router';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { LogoutService } from './logout.service';

export const authGuard: CanActivateFn = (route, state) => {
  const logoutService = inject(LogoutService)
  const token = localStorage.getItem(environment.authCookieName)

  if (!token) {
    logoutService.onLogout()
    return false
  };

  return true;
};
