import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Reproduce la manejo de errores del `request()` original de React:
 * `data?.error || data?.message || statusText || 'Error en la solicitud'`.
 * Todos los observables fallan con `Error` (usar `err.message` en los componentes).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const body = err.error;
      let msg = '';
      if (typeof body === 'object' && body !== null) {
        msg = body.error || body.message || '';
      } else if (typeof body === 'string' && body.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(body);
          msg = parsed.error || parsed.message || '';
        } catch {
          msg = '';
        }
      }
      const message = msg || err.statusText || 'Error en la solicitud';
      return throwError(() => new Error(message));
    })
  );
