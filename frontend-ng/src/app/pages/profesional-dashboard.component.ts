import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SessionUser } from '../core/models';

const ROL_LABELS: Record<string, { icon: string; label: string }> = {
  VETERINARIO: { icon: '👨‍⚕️', label: 'Veterinario' },
  PASEADOR: { icon: '🐕', label: 'Paseador' },
  PELUQUERO: { icon: '✂️', label: 'Peluquero' },
  ADIESTRADOR: { icon: '🎯', label: 'Adiestrador' },
  CUIDADOR: { icon: '🏠', label: 'Cuidador' },
};

/** Equivalente a frontend/src/pages/ProfesionalDashboard.jsx */
@Component({
  selector: 'app-profesional-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <h1>Panel de {{ info.label }}</h1>
      <p>Bienvenido, {{ user.nombre }}. Gestioná tus turnos y pacientes desde acá.</p>

      <div class="card-grid">
        <a routerLink="/dashboard/profesional/mis-turnos" class="dash-card" style="text-decoration: none; color: inherit">
          <span class="dash-icon">📅</span>
          <h3>Mis Turnos</h3>
          <p>Revisá y gestioná tus turnos asignados.</p>
          <span class="dash-link">Ver más →</span>
        </a>
        <a routerLink="/dashboard/profesional/mis-pacientes" class="dash-card" style="text-decoration: none; color: inherit">
          <span class="dash-icon">🐾</span>
          <h3>Mis Pacientes</h3>
          <p>Revisá las mascotas a tu cargo.</p>
          <span class="dash-link">Ver más →</span>
        </a>
        <a routerLink="/dashboard/profesional/perfil" class="dash-card" style="text-decoration: none; color: inherit">
          <span class="dash-icon">👤</span>
          <h3>Perfil Profesional</h3>
          <p>Consultá tu matrícula, experiencia y datos.</p>
          <span class="dash-link">Ver más →</span>
        </a>
      </div>
    </div>
  `,
})
export class ProfesionalDashboardComponent {
  private readonly auth = inject(AuthService);

  protected readonly user: SessionUser = this.auth.user()!;
  protected readonly info = ROL_LABELS[this.user.rol] || { icon: '👤', label: this.user.rol };
}
