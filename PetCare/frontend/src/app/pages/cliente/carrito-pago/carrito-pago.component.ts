import { ChangeDetectionStrategy, Component,  inject,  input,  linkedSignal,  output,  signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carrito, Tarjeta } from '../../../core/models';
import {  PATRON_CVV,  PATRON_NUMERO_TARJETA,  PATRON_VENCIMIENTO,  tarjetaNoVencida } from '../../../core/tarjeta.validators';

@Component({
  selector: 'app-carrito-pago',
  imports: [ReactiveFormsModule],
  templateUrl: './carrito-pago.component.html',
  styleUrl: './carrito-pago.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoPagoComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly carrito = input.required<Carrito>();
  readonly tarjetas = input.required<Tarjeta[]>();
  readonly comprando = input(false);

  readonly confirmarCompra = output<Record<string, unknown>>();

  readonly mostrarNuevaTarjeta = signal(false);
  readonly idTarjetaGuardada = linkedSignal<Tarjeta[], number | ''>({
    source: this.tarjetas,
    computation: (cards) => (cards.length > 0 ? cards[0].idTarjeta : ''),
  });

  readonly tarjetaNueva = this.fb.group({
    titular: ['', [Validators.required, Validators.maxLength(60)]],
    numeroTarjeta: ['', [Validators.required, Validators.pattern(PATRON_NUMERO_TARJETA)]],
    vencimiento: ['', [Validators.required, Validators.pattern(PATRON_VENCIMIENTO), tarjetaNoVencida]],
    cvv: ['', [Validators.required, Validators.pattern(PATRON_CVV)]],
  });

  seleccionarTarjeta(id: number): void {
    this.idTarjetaGuardada.set(id);
    this.mostrarNuevaTarjeta.set(false);
  }

  toggleNuevaTarjeta(): void {
    this.mostrarNuevaTarjeta.update((v) => !v);
    this.idTarjetaGuardada.set('');
    this.tarjetaNueva.reset();
  }

  submitCompra(): void {
    const idTarjeta = this.idTarjetaGuardada();
    const usaTarjetaNueva = !idTarjeta && this.mostrarNuevaTarjeta();

    if (usaTarjetaNueva && this.tarjetaNueva.invalid) {
      this.tarjetaNueva.markAllAsTouched();
      return;
    }

    const body: Record<string, unknown> = { metodoPago: 'TARJETA' };

    if (idTarjeta) {
      body['idTarjetaGuardada'] = Number(idTarjeta);
    } else if (usaTarjetaNueva) {
      body['tarjetaNueva'] = this.tarjetaNueva.getRawValue();
    }

    this.confirmarCompra.emit(body);
  }
}