import { DestroyRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { despuesDe } from './tiempo.helpers';

describe('despuesDe', () => {
  /** DestroyRef mínimo para probar la cancelación sin un componente real. */
  function destroyRefFalso(): { destroyRef: DestroyRef; destruir: () => void } {
    let alDestruir: (() => void) | undefined;
    const destroyRef = {
      onDestroy: (cb: () => void) => {
        alDestruir = cb;
        return () => undefined;
      },
    } as unknown as DestroyRef;
    return { destroyRef, destruir: () => alDestruir?.() };
  }

  it('emite una vez pasados los milisegundos', fakeAsync(() => {
    const { destroyRef } = destroyRefFalso();
    let emisiones = 0;

    despuesDe(1000, destroyRef).subscribe(() => emisiones++);

    tick(999);
    expect(emisiones).toBe(0);
    tick(1);
    expect(emisiones).toBe(1);
  }));

  it('no emite si el componente se destruye antes', fakeAsync(() => {
    const { destroyRef, destruir } = destroyRefFalso();
    let emitio = false;

    despuesDe(1000, destroyRef).subscribe(() => (emitio = true));
    destruir();
    tick(1000);

    expect(emitio).toBeFalse();
  }));
});
