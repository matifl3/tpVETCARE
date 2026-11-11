import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { SessionUser } from '../../../core/models';

const ROL_LABELS: Record<string, { icon: string; label: string }> = {
  VETERINARIO: { icon: '👨‍⚕️', label: 'Veterinario' },
  PASEADOR: { icon: '🐕', label: 'Paseador' },
  PELUQUERO: { icon: '✂️', label: 'Peluquero' },
  ADIESTRADOR: { icon: '🎯', label: 'Adiestrador' },
  CUIDADOR: { icon: '🏠', label: 'Cuidador' },
};

@Component({
    selector: 'app-profesional-dashboard',
    imports: [RouterLink],
    templateUrl: './profesional-dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './profesional-dashboard.component.css'
})
export class ProfesionalDashboardComponent {
  private readonly auth = inject(AuthService);

  protected readonly user: SessionUser = this.auth.user()!;
  protected readonly info = ROL_LABELS[this.user.rol] || { icon: '👤', label: this.user.rol };
}
