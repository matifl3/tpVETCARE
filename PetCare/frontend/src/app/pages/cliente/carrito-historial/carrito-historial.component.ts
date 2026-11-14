import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Carrito } from '../../../core/models';

@Component({
  selector: 'app-carrito-historial',
  templateUrl: './carrito-historial.component.html',
  styleUrl: './carrito-historial.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoHistorialComponent {
  readonly historial = input.required<Carrito[]>();
}