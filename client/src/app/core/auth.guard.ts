import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/login']);

/** UI convenience only. The API enforces the same permissions independently. */
export const permissionGuard = (...permissions: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  return auth.can(...permissions) || inject(Router).createUrlTree(['/dashboard']);
};

/** Public pages: signed-in users skip straight to their dashboard. */
export const guestGuard: CanActivateFn = () => !inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/dashboard']);
