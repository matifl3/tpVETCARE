import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Carrito } from '../core/models';

/**
 * El carrito llega por el state de la navegación;
 * `history.state` lo conserva si se recarga la página.
 */
@Component({
  selector: 'app-compra-exitosa-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard" style="text-align: center">
      <div style="font-size: 80px; margin-bottom: 16px">✅</div>
      <h1>¡Gracias por tu compra!</h1>
      <p style="color: #777; margin-bottom: 32px">Tu compra se realizó con éxito.</p>

      @if (carrito; as carrito) {
        <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; text-align: left; max-width: 500px; margin: 0 auto 32px">
          <h3 style="margin-bottom: 16px">Resumen de compra</h3>
          <p><strong>Compra #{{ carrito.id }}</strong></p>
          <p>Estado: {{ carrito.estado }}</p>
          <p>Fecha: {{ carrito.fechaCreacion }}</p>
          @if (carrito.metodoPago) {
            <p>Método de pago: {{ carrito.metodoPago }}</p>
          }
          <p style="font-size: 20px; font-weight: 700; color: #667eea; margin-top: 12px">Total: \${{ carrito.total.toFixed(2) }}</p>

          @if (carrito.turnos?.length) {
            <div style="margin-top: 16px">
              <h4>Turnos reservados</h4>
              @for (t of carrito.turnos; track t.id) {
                <div style="background: #f0f0ff; padding: 12px; border-radius: 8px; margin-top: 8px">
                  <p><strong>Profesional:</strong> {{ t.nombreProfesional }}</p>
                  <p><strong>Mascota:</strong> {{ t.nombreMascota }}</p>
                  <p><strong>Fecha:</strong> {{ t.fecha }}</p>
                  @if ((t.horas ?? 0) > 1) {
                    <p><strong>Horas:</strong> {{ t.horas }}</p>
                  }
                  <p><strong>Precio:</strong> \${{ t.precio?.toFixed(2) }}</p>
                </div>
              }
            </div>
          }

          @if (carrito.items?.length) {
            <div style="margin-top: 16px">
              <h4>Productos</h4>
              @for (item of carrito.items; track item.id) {
                <p style="font-size: 14px">{{ item.productoNombre }} × {{ item.cantidad }} — \${{ item.subtotal.toFixed(2) }}</p>
              }
            </div>
          }
        </div>
      }

      <div style="display: flex; gap: 16px; justify-content: center">
        <a routerLink="/dashboard" class="btn-primary">Volver al Dashboard</a>
        <a routerLink="/dashboard/mis-turnos" class="btn-secondary">Ver mis turnos</a>
      </div>
    </div>
  `,
})
export class CompraExitosaPageComponent {
  private readonly router = inject(Router);

  protected readonly carrito: Carrito | undefined =
    this.router.getCurrentNavigation()?.extras.state?.['carrito'] ?? history.state?.carrito;
}
