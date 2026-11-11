import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SessionUser } from '../../core/models';

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

/** Inicio del panel: accesos según el rol del usuario. */
@Component({
    selector: 'app-dashboard-home',
    imports: [RouterLink],
    templateUrl: './dashboard-home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  private readonly auth = inject(AuthService);

  protected readonly user: SessionUser = this.auth.user()!;
  protected readonly rolesProfesionales = ROLES_PROFESIONALES;
}
