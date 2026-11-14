import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { NombreRolPipe } from '../../../core/pipes/nombre-rol.pipe';

@Component({
    selector: 'app-profesional-dashboard',
    imports: [RouterLink, NombreRolPipe],
    templateUrl: './profesional-dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './profesional-dashboard.component.css'
})
export class ProfesionalDashboardComponent {
  private readonly auth = inject(AuthService);

  /** Sigue la signal global para que el panel refleje los cambios del usuario. */
  protected readonly user = computed(() => this.auth.user()!);
}
