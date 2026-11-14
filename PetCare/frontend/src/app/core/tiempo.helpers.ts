import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, timer } from 'rxjs';

/**
 * Emite una sola vez después de `ms` milisegundos.
 *
 * Reemplaza a `setTimeout` para esperas de mensajes o navegación: si el
 * componente se destruye antes de que se cumpla el tiempo, el timer se
 * cancela solo y la acción pendiente nunca se ejecuta.
 */
export function despuesDe(ms: number, destroyRef: DestroyRef): Observable<0> {
  return timer(ms).pipe(takeUntilDestroyed(destroyRef));
}
