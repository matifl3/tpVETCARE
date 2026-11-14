import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { NombreRolPipe } from '../../core/pipes/nombre-rol.pipe';
import { SolicitudPendientePageComponent } from '../../pages/profesional/solicitud-pendiente/solicitud-pendiente-page.component';

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

/**
 * Layout de /dashboard. El usuario viene de la signal global y la sesión
 * la verifica el authGuard antes de activar la ruta.
 */
@Component({
    selector: 'app-dashboard',
    imports: [RouterOutlet, RouterLink, NombreRolPipe, SolicitudPendientePageComponent],
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** El layout sigue la signal del usuario: si cambia, se refleja solo. */
  protected readonly user = computed(() => this.auth.user()!);

  protected readonly esProfesionalNoAprobado = computed(
    () => ROLES_PROFESIONALES.includes(this.user().rol) && !this.user().aprobado,
  );

  handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
