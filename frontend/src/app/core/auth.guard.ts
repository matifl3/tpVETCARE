import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Guardia de rutas privadas.
 * - Sin token → al login.
 * - Con token pero sin usuario cargado (ej: se recargó la página) → valida el token con /api/auth/me.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.user()) {
    return true;
  }
  if (!auth.getToken()) {
    return router.createUrlTree(['/login']);
  }

  return auth.check().pipe(
    map(() => true),
    catchError(() => {
      auth.logout();
      return of(router.createUrlTree(['/login']));
    })
  );
};
