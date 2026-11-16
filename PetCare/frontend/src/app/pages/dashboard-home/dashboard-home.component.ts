import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ROLES_PROFESIONALES, esRolProfesional, SessionUser } from '../../core/models';

/** Inicio del panel: accesos según el rol del usuario. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-dashboard-home',
    imports: [RouterLink],
    templateUrl: './dashboard-home.component.html',
    styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  private readonly auth = inject(AuthService);

  protected readonly user: SessionUser = this.auth.user()!;
  protected readonly rolesProfesionales = ROLES_PROFESIONALES;
  protected readonly esRolProfesional = esRolProfesional;
}
