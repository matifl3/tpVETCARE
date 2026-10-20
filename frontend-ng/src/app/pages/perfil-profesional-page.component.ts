import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Profesional } from '../core/models';
import { ProfesionalService } from '../services/profesional.service';

const ROL_LABELS: Record<string, string> = {
  VETERINARIO: 'Veterinario',
  PASEADOR: 'Paseador',
  PELUQUERO: 'Peluquero',
  ADIESTRADOR: 'Adiestrador',
  CUIDADOR: 'Cuidador',
};

/** Equivalente a frontend/src/pages/PerfilProfesionalPage.jsx */
@Component({
  selector: 'app-perfil-profesional-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Perfil Profesional</h1>
          <a routerLink="/dashboard/profesional" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        @if (perfil(); as perfil) {
          <div class="admin-card" style="max-width: 500px">
            <div style="font-size: 48px; margin-bottom: 16px">👤</div>
            <h2 style="margin-bottom: 8px">{{ perfil.nombre }} {{ perfil.apellido }}</h2>
            <p style="color: #667eea; font-weight: 600; margin-bottom: 24px">
              {{ rolLabels[perfil.rol] || perfil.rol }}
            </p>

            <table class="admin-table">
              <tbody>
                <tr><td style="font-weight: 600; width: 140px">Email</td><td>{{ perfil.email }}</td></tr>
                <tr><td style="font-weight: 600">Teléfono</td><td>{{ perfil.telefono || '—' }}</td></tr>
                <tr><td style="font-weight: 600">Matrícula</td><td>{{ perfil.matricula || '—' }}</td></tr>
                <tr><td style="font-weight: 600">Experiencia</td><td>{{ perfil.experiencia || '—' }}</td></tr>
                <tr><td style="font-weight: 600">Estado</td><td><span class="nav-role">{{ perfil.estado }}</span></td></tr>
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
})
export class PerfilProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly profesionalService = inject(ProfesionalService);

  protected readonly rolLabels = ROL_LABELS;

  readonly perfil = signal<Profesional | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.profesionalService.buscarPorId(this.auth.user()!.id).subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
