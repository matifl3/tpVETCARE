import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Carrito } from '../../../core/models';

@Component({
  selector: 'app-carrito-items',
  imports: [RouterLink],
  templateUrl: './carrito-items.component.html',
  styleUrl: './carrito-items.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoItemsComponent {
  readonly carrito = input.required<Carrito>();
  readonly disabled = input(false);

  readonly modificarCantidad = output<{ idProducto: number; cantidad: number }>();
  readonly eliminarProducto = output<number>();
  readonly eliminarTurno = output<number>();
  readonly verHistorial = output<void>();

  onCambiarCantidad(idProducto: number, cantidad: number): void {
    if (cantidad < 1) return;
    this.modificarCantidad.emit({ idProducto, cantidad });
  }
}