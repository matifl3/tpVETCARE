import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Turno } from '../core/models';
import { TurnoService } from '../services/turno.service';

@Component({
  selector: 'app-admin-turnos-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Turnos</h1>
          <a routerLink="/dashboard" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver al Dashboard</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        <div class="admin-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Profesional</th>
                <th>Mascota</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Activo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              @for (t of turnos(); track t.id) {
                <tr>
                  <td>{{ t.id }}</td>
                  <td>{{ t.nombreProfesional || '—' }}</td>
                  <td>{{ t.nombreMascota || '—' }}</td>
                  <td>{{ t.fecha || '—' }}</td>
                  <td><span class="nav-role">{{ t.estadoTurno || '—' }}</span></td>
                  <td>{{ t.activo ? '✅' : '❌' }}</td>
                  <td>
                    @if (t.activo) {
                      <button
                        class="btn-secondary btn-sm"
                        style="color: #d32f2f; border-color: #d32f2f"
                        (click)="handleCancelar(t.id)"
                      >
                        Cancelar
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
})
export class AdminTurnosPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');

  ngOnInit(): void {
    this.turnoService.listarTodos().subscribe({
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

  handleCancelar(id: number): void {
    if (!confirm('¿Cancelar este turno?')) return;
    this.error.set('');
    this.success.set('');
    this.turnoService.cancelar(id).subscribe({
      next: () => {
        this.success.set('Turno cancelado correctamente');
        this.turnos.update((prev) =>
          prev.map((t) => (t.id === id ? { ...t, estadoTurno: 'CANCELADO', activo: false } : t)),
        );
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
