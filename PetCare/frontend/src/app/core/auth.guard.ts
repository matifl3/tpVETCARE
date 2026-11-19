import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;

  const usuarioActual = auth.user();
  if (usuarioActual) {
    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }
    const rolUsuario = usuarioActual.rol?.toUpperCase();
    const permitido = rolesPermitidos.some((rol) => rol.toUpperCase() === rolUsuario);
    if (!permitido) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  if (!auth.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  return auth.check().pipe(
    map((user) => {
      if (!rolesPermitidos || rolesPermitidos.length === 0) {
        return true;
      }
      const rolUsuario = user.rol?.toUpperCase();
      const permitido = rolesPermitidos.some((rol) => rol.toUpperCase() === rolUsuario);
      if (!permitido) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      auth.logout();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
