import { FormControl } from '@angular/forms';
import { tarjetaNoVencida } from './tarjeta.validators';

/** Arma un vencimiento MM/AA sumando meses a la fecha de hoy. */
function vencimientoDentroDe(meses: number): string {
  const fecha = new Date();
  fecha.setDate(1);
  fecha.setMonth(fecha.getMonth() + meses);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = String(fecha.getFullYear() % 100).padStart(2, '0');
  return `${mes}/${anio}`;
}

describe('tarjetaNoVencida', () => {
  it('una tarjeta que vence el mes pasado está vencida', () => {
    const control = new FormControl(vencimientoDentroDe(-1));
    expect(tarjetaNoVencida(control)).toEqual({ tarjetaVencida: true });
  });

  it('una tarjeta que vence este mes todavía sirve', () => {
    const control = new FormControl(vencimientoDentroDe(0));
    expect(tarjetaNoVencida(control)).toBeNull();
  });

  it('una tarjeta que vence en el futuro sirve', () => {
    const control = new FormControl(vencimientoDentroDe(24));
    expect(tarjetaNoVencida(control)).toBeNull();
  });

  it('si el formato está mal no opina (eso lo controla el pattern)', () => {
    expect(tarjetaNoVencida(new FormControl('13/99'))).toBeNull();
    expect(tarjetaNoVencida(new FormControl(''))).toBeNull();
  });
});