import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { esRolProfesional, SessionUser } from '../../core/models';
import { NombreRolPipe } from '../../core/pipes/nombre-rol.pipe';
import { SolicitudPendientePageComponent } from '../../pages/profesional/solicitud-pendiente/solicitud-pendiente-page.component';

/**
 * Layout de /dashboard. El usuario viene de la signal global y la sesión
 * la verifica el authGuard antes de activar la ruta.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-dashboard',
    imports: [RouterOutlet, RouterLink, NombreRolPipe, SolicitudPendientePageComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);

  /** El layout sigue la signal del usuario: si cambia, se refleja solo. */
  protected readonly user = computed(() => this.auth.user()!);

  protected readonly esProfesionalNoAprobado = computed(
    () => esRolProfesional(this.user().rol) && !this.user().aprobado,
  );

  handleLogout(): void {
  this.auth.cerrarSesion();
}
}
