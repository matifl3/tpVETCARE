import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Turno } from '../core/models';
import { TurnoService } from '../services/turno.service';

@Component({
  selector: 'app-mis-turnos-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <h1>Mis Turnos</h1>
        <p style="margin-bottom: 24px">Turnos y reservas activas.</p>

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        @if (turnos().length === 0) {
          <p style="color: #777">No tenés turnos registrados.</p>
        } @else {
          <div class="card-grid">
            @for (t of turnos(); track t.id) {
              <div class="dash-card">
                <span class="dash-icon">📅</span>
                <h3>{{ t.nombreProfesional || 'Profesional #' + t.id_profesional }}</h3>
                <p><strong>Mascota:</strong> {{ t.nombreMascota || '#' + t.id_mascota }}</p>
                <p><strong>Fecha:</strong> {{ t.fecha }}</p>
                @if (t.horas) {
                  <p><strong>Horas:</strong> {{ t.horas }}</p>
                }
                @if (t.precio != null) {
                  <p><strong>Precio:</strong> \${{ t.precio.toFixed(2) }}</p>
                }
                <p>
                  <span class="nav-role" [style.background]="t.estadoTurno === 'CONFIRMADO' ? '#388e3c' : '#d32f2f'">{{ t.estadoTurno }}</span>
                </p>
              </div>
            }
          </div>
        }

        <a routerLink="/dashboard" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver al Dashboard</a>
      </div>
    }
  `,
})
export class MisTurnosPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.turnoService.misTurnos().subscribe({
      next: (data) => {
        this.turnos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
