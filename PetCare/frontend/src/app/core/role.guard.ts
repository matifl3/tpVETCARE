import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guardia de rol.
 * Se aplica después de `authGuard` y lee los roles permitidos desde
 * `route.data['roles']`. Si el usuario no tiene el rol, vuelve al home del
 * dashboard (que muestra las tarjetas de su propio rol).
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.user();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const roles = route.data['roles'] as readonly string[] | undefined;
  if (!roles || roles.includes(user.rol)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
