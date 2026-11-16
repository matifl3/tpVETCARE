import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

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

  private readonly user = computed(() => this.auth.user()!);

  protected readonly esRechazado = computed(() => this.user().estado === 'RECHAZADO');

  handleLogout(): void {
  this.auth.cerrarSesion();
}
}
