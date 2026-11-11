import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { SessionUser } from '../../../core/models';

/**
 * Pantalla para el profesional registrado cuya aprobación está pendiente
 * o fue rechazada.
 */
@Component({
    selector: 'app-solicitud-pendiente',
    imports: [RouterLink],
    templateUrl: './solicitud-pendiente-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './solicitud-pendiente-page.component.css'
})
export class SolicitudPendientePageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly user: SessionUser = this.auth.user()!;

  protected get esRechazado(): boolean {
    return this.user?.estado === 'RECHAZADO';
  }

  handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
