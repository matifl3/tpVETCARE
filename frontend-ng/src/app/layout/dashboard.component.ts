import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SessionUser } from '../core/models';
import { SolicitudPendientePageComponent } from '../pages/solicitud-pendiente-page.component';

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

/**
 * Layout de /dashboard — equivalente a frontend/src/pages/Dashboard.jsx.
 * El usuario viene de la signal global (antes: outlet context) y la sesión
 * la verifica el authGuard antes de activar la ruta.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SolicitudPendientePageComponent],
  template: `
    <div>
      <nav class="navbar">
        <div class="container">
          <a routerLink="/dashboard" class="logo">
            <span class="logo-icon">🐾</span>
            <h1>PetCare</h1>
          </a>
          <div class="nav-links">
            <span class="nav-user">👤 {{ user.nombre }}</span>
            <span class="nav-role">{{ user.rol }}</span>
            <button (click)="handleLogout()" class="btn-secondary">Cerrar sesión</button>
          </div>
        </div>
      </nav>
      @if (esProfesionalNoAprobado) {
        <app-solicitud-pendiente />
      } @else {
        <router-outlet />
      }
    </div>
  `,
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user: SessionUser = this.auth.user()!;

  protected get esProfesionalNoAprobado(): boolean {
    return ROLES_PROFESIONALES.includes(this.user.rol) && !this.user.aprobado;
  }

  handleLogout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
