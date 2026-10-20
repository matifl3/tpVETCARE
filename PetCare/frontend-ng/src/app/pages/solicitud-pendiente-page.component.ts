import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SessionUser } from '../core/models';

/**
 * Equivalente a frontend/src/pages/SolicitudPendientePage.jsx (profesional
 * registrado cuya aprobación está pendiente o fue rechazada).
 */
@Component({
  selector: 'app-solicitud-pendiente',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard" style="text-align: center; padding-top: 80px">
      <div style="font-size: 80px; margin-bottom: 24px">
        {{ esRechazado ? '❌' : '⏳' }}
      </div>
      <h1 style="margin-bottom: 16px">
        {{ esRechazado ? 'Solicitud rechazada' : 'Solicitud en revisión' }}
      </h1>
      <p style="color: #777; font-size: 16px; max-width: 480px; margin: 0 auto 32px; line-height: 1.6">
        {{
          esRechazado
            ? 'Tu solicitud de registro como profesional fue rechazada. Contactá con soporte para más información.'
            : 'Tu solicitud de registro como profesional está siendo revisada por el administrador. Te notificaremos cuando sea aprobada.'
        }}
      </p>
      <div style="display: flex; gap: 16px; justify-content: center">
        <a routerLink="/" class="btn-secondary">Volver al inicio</a>
        <button
          class="btn-secondary"
          style="color: #d32f2f; border-color: #d32f2f"
          (click)="handleLogout()"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  `,
})
export class SolicitudPendientePageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly user: SessionUser = this.auth.user()!;

  protected get esRechazado(): boolean {
    return this.user?.estado === 'RECHAZADO';
  }

  handleLogout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
