import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Carrito } from '../../../core/models';

/**
 * El carrito llega por el state de la navegación;
 * `history.state` lo conserva si se recarga la página.
 */
@Component({
  selector: 'app-compra-exitosa-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './compra-exitosa-page.component.html',
  styleUrl: './compra-exitosa-page.component.css',
})
export class CompraExitosaPageComponent {
  private readonly router = inject(Router);

  protected readonly carrito: Carrito | undefined =
    this.router.getCurrentNavigation()?.extras.state?.['carrito'] ?? history.state?.carrito;
}
