import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { SessionUser } from '../../../core/models';

/**
 * Pantalla para el profesional registrado cuya aprobación está pendiente
 * o fue rechazada.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-solicitud-pendiente',
    imports: [RouterLink],
    templateUrl: './solicitud-pendiente-page.component.html',
    styleUrl: './solicitud-pendiente-page.component.css'
})
export class SolicitudPendientePageComponent {
  private readonly auth = inject(AuthService);

  private readonly user: SessionUser = this.auth.user()!;

  protected get esRechazado(): boolean {
    return this.user?.estado === 'RECHAZADO';
  }

  handleLogout(): void {
  this.auth.cerrarSesion();
}
}
