import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

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

  /** Sigue la signal global: el dashboard se actualiza si cambia el usuario. */
  protected readonly user = computed(() => this.auth.user()!);

  protected readonly esAdmin = computed(() => this.user().rol === 'ADMIN');
  protected readonly esCliente = computed(() => this.user().rol === 'CLIENTE');
  protected readonly esProfesional = computed(() =>
    ROLES_PROFESIONALES.includes(this.user().rol),
  );
}
