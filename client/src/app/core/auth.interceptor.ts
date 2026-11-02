import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const withToken = (req: HttpRequest<unknown>, token: string | null) => token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isAuthCall = req.url.includes('/auth/');
  return next(withToken(req, auth.token())).pipe(
    catchError((err: HttpErrorResponse) => {
      // An expired access token is refreshed once, then the original request is retried.
      if (err.status !== 401 || isAuthCall || !auth.token()) return throwError(() => err);
      return auth.refresh().pipe(switchMap(ok => {
        if (!ok) { auth.expire(); return throwError(() => err); }
        return next(withToken(req, auth.token()));
      }));
    })
  );
};
