import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Formatos que acepta el backend (TarjetaRequestDTO). */
export const PATRON_NUMERO_TARJETA = /^\d{13,19}$/;
export const PATRON_VENCIMIENTO = /^(0[1-9]|1[0-2])\/\d{2}$/;
export const PATRON_CVV = /^\d{3,4}$/;

/** El vencimiento (MM/AA) no puede ser anterior al mes actual. */
export function tarjetaNoVencida(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value ?? '';
  if (!PATRON_VENCIMIENTO.test(valor)) return null; // el formato lo controla Validators.pattern

  const [mes, anio] = valor.split('/').map(Number);
  const hoy = new Date();
  const anioActual = hoy.getFullYear() % 100;
  const mesActual = hoy.getMonth() + 1;

  const vencida = anio < anioActual || (anio === anioActual && mes < mesActual);
  return vencida ? { tarjetaVencida: true } : null;
}