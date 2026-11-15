import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito } from '../../../../core/models';

@Component({
  selector: 'app-carrito-historial',
  imports: [DatePipe, RouterLink],
  templateUrl: './carrito-historial.component.html',
  styleUrl: './carrito-historial.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoHistorialComponent {
  readonly historial = input.required<Carrito[]>();
}