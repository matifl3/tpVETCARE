import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Turno } from '../core/models';
import { TurnoService } from '../services/turno.service';

@Component({
  selector: 'app-mis-turnos-profesional-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Mis Turnos</h1>
          <a routerLink="/dashboard/profesional" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        @if (turnos().length === 0) {
          <div class="admin-card">
            <p style="color: #777; text-align: center; padding: 32px">No tenés turnos asignados.</p>
          </div>
        } @else {
          <div class="admin-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mascota</th>
                  <th>Fecha</th>
                  <th>Horas</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (t of turnos(); track t.id) {
                  <tr>
                    <td>{{ t.id }}</td>
                    <td>{{ t.nombreMascota || '—' }}</td>
                    <td>{{ t.fecha || '—' }}</td>
                    <td>{{ t.horas || '—' }}</td>
                    <td>{{ t.precio ? '$' + t.precio.toFixed(2) : '—' }}</td>
                    <td><span class="nav-role">{{ t.estadoTurno || '—' }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
})
export class MisTurnosProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.turnoService.porProfesional(this.auth.user()!.id).subscribe({
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
