import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SessionUser } from '../../core/models';
import { SolicitudPendientePageComponent } from '../../pages/profesional/solicitud-pendiente/solicitud-pendiente-page.component';

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

/**
 * Layout de /dashboard. El usuario viene de la signal global y la sesión
 * la verifica el authGuard antes de activar la ruta.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SolicitudPendientePageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user: SessionUser = this.auth.user()!;

  protected get esProfesionalNoAprobado(): boolean {
    return ROLES_PROFESIONALES.includes(this.user.rol) && !this.user.aprobado;
  }

  handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
