import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { esRolProfesional } from '../../core/models';

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

  protected readonly user = this.auth.user;
  protected readonly esAdmin = computed(() => this.user()?.rol === 'ADMIN');
  protected readonly esCliente = computed(() => this.user()?.rol === 'CLIENTE');
  protected readonly esProfesional = computed(() => {
    const rol = this.user()?.rol;
    return rol !== undefined && esRolProfesional(rol);
  });
}
