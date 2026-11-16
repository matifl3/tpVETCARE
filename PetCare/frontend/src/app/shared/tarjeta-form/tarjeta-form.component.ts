

import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  PATRON_CVV,
  PATRON_NUMERO_TARJETA,
  PATRON_VENCIMIENTO,
  tarjetaNoVencida,
} from '../../core/tarjeta.validators';

/** Crea el formulario de una tarjeta. Lo usan Métodos de Pago y el carrito. */
export function crearFormTarjeta(fb: NonNullableFormBuilder) {
  return fb.group({
    titular: ['', [Validators.required, Validators.maxLength(60)]],
    numeroTarjeta: ['', [Validators.required, Validators.pattern(PATRON_NUMERO_TARJETA)]],
    vencimiento: ['', [Validators.required, Validators.pattern(PATRON_VENCIMIENTO), tarjetaNoVencida]],
    cvv: ['', [Validators.required, Validators.pattern(PATRON_CVV)]],
  });
}

/** El tipo del formulario que devuelve crearFormTarjeta. */
export type TarjetaFormGroup = ReturnType<typeof crearFormTarjeta>;

/**
 * Campos de una tarjeta con sus mensajes de error.
 * El componente padre crea el formulario y se lo pasa con [form].
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tarjeta-form',
  imports: [ReactiveFormsModule],
  templateUrl: './tarjeta-form.component.html',
  styleUrl: './tarjeta-form.component.css',
})
export class TarjetaFormComponent {
  readonly form = input.required<TarjetaFormGroup>();
}