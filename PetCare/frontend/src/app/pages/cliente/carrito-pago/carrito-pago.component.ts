import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form, maxLength, pattern, required, validate, FormRoot } from '@angular/forms/signals';
import { Carrito, Tarjeta } from '../../../core/models';
import { PATRON_CVV, PATRON_NUMERO_TARJETA, PATRON_VENCIMIENTO } from '../../../core/tarjeta.validators';

interface TarjetaNuevaModel {
  titular: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

@Component({
  selector: 'app-carrito-pago',
  imports: [FormField, FormRoot],
  templateUrl: './carrito-pago.component.html',
  styleUrl: './carrito-pago.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoPagoComponent {
  readonly carrito = input.required<Carrito>();
  readonly tarjetas = input.required<Tarjeta[]>();
  readonly comprando = input(false);

  readonly confirmarCompra = output<Record<string, unknown>>();

  readonly mostrarNuevaTarjeta = signal(false);

  private readonly tarjetaSeleccionada = signal<number | '' | null>(null);

  readonly idTarjetaGuardada = computed<number | ''>(() => {
    const elegida = this.tarjetaSeleccionada();
    if (elegida !== null) return elegida; 

    const cards = this.tarjetas();
    return cards.length > 0 ? cards[0].idTarjeta : ''; 
  });

  readonly usaTarjetaNueva = computed(
    () => this.mostrarNuevaTarjeta() || this.tarjetas().length === 0
  );

  readonly totalPagar = computed(() => {
    const c = this.carrito();
    if (typeof c.total === 'number') return c.total;
    const totalItems = (c.items ?? []).reduce((acc, item) => acc + (item.subtotal ?? 0), 0);
    const totalTurnos = (c.turnos ?? []).reduce((acc, turno) => acc + (turno.precio ?? 0), 0);
    return totalItems + totalTurnos;
  });

  private readonly tarjetaVacia: TarjetaNuevaModel = {
    titular: '',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: '',
  };

  readonly tarjetaModel = signal<TarjetaNuevaModel>({ ...this.tarjetaVacia });

  readonly formularioTarjeta = form(
    this.tarjetaModel,
    (campos) => {
      required(campos.titular, { message: 'Ingresá el nombre del titular.',
        when: () => this.usaTarjetaNueva() });
      maxLength(campos.titular, 60, { message: 'El titular no puede superar los 60 caracteres.' });

      required(campos.numeroTarjeta, { message: 'Ingresá el número de tarjeta.',
        when: () => this.usaTarjetaNueva() });
      pattern(campos.numeroTarjeta, PATRON_NUMERO_TARJETA, { message: 'Ingresá un número de tarjeta válido.' });

      required(campos.vencimiento, { message: 'Ingresá la fecha de vencimiento.',
        when: () => this.usaTarjetaNueva() });
      pattern(campos.vencimiento, PATRON_VENCIMIENTO, { message: 'Usá el formato MM/AA.' });
      validate(campos.vencimiento, ({ value }) => {
        const valor = value();
        if (!valor || !PATRON_VENCIMIENTO.test(valor)) return undefined;
        return this.estaVencida(valor)
          ? { kind: 'vencida', message: 'La tarjeta está vencida.' }
          : undefined;
      });

      required(campos.cvv, { message: 'Ingresá el código de seguridad.',
        when: () => this.usaTarjetaNueva() });
      pattern(campos.cvv, PATRON_CVV, { message: 'El CVV debe tener 3 o 4 dígitos.' });
    },
    {
      submission: {
        action: async (campos) => {
          const body: Record<string, unknown> = { metodoPago: 'TARJETA' };
          const idTarjeta = this.idTarjetaGuardada();

          if (idTarjeta && !this.usaTarjetaNueva()) {
            body['idTarjetaGuardada'] = Number(idTarjeta);
          } else {
            body['tarjetaNueva'] = campos().value();
          }

          this.confirmarCompra.emit(body);
        },
      },
    }
  );

  seleccionarTarjeta(id: number): void {
    this.tarjetaSeleccionada.set(id);
    this.mostrarNuevaTarjeta.set(false);
    this.limpiarFormularioTarjeta();
  }

  toggleNuevaTarjeta(): void {
    const abrir = !this.mostrarNuevaTarjeta();
    this.mostrarNuevaTarjeta.set(abrir);
    this.limpiarFormularioTarjeta();

    if (abrir) {
      this.tarjetaSeleccionada.set('');
    } else if (this.tarjetas().length > 0) {
      this.tarjetaSeleccionada.set(null);
    }
  }

  private limpiarFormularioTarjeta(): void {
    this.tarjetaModel.set({ ...this.tarjetaVacia });
    this.formularioTarjeta().reset();
  }

  private estaVencida(vencimiento: string): boolean {
    const [mesStr, anioStr] = vencimiento.split('/');
    const mes = Number(mesStr);
    const anio = 2000 + Number(anioStr);
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;

    return anio < anioActual || (anio === anioActual && mes < mesActual);
  }
}