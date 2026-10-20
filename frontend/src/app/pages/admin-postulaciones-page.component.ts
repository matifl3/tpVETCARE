import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profesional } from '../core/models';
import { ProfesionalService } from '../services/profesional.service';

@Component({
  selector: 'app-admin-postulaciones-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Postulaciones</h1>
          <a routerLink="/dashboard" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver al Dashboard</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        @if (postulaciones().length === 0) {
          <div class="admin-card">
            <p style="color: #777; text-align: center; padding: 32px">No hay postulaciones pendientes.</p>
          </div>
        } @else {
          <div class="admin-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Matrícula</th>
                  <th>Experiencia</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                @for (p of postulaciones(); track p.id) {
                  <tr>
                    <td>{{ p.id }}</td>
                    <td>{{ p.nombre }} {{ p.apellido }}</td>
                    <td>{{ p.email }}</td>
                    <td><span class="nav-role">{{ p.rol }}</span></td>
                    <td>{{ p.matricula || '—' }}</td>
                    <td>{{ p.experiencia || '—' }}</td>
                    <td>
                      <div class="actions">
                        <button class="btn-primary btn-sm" [disabled]="procesando() === p.id" (click)="aprobar(p.id)">
                          {{ procesando() === p.id ? '...' : 'Aprobar' }}
                        </button>
                        <button
                          class="btn-secondary btn-sm"
                          style="color: #d32f2f; border-color: #d32f2f"
                          [disabled]="procesando() === p.id"
                          (click)="rechazar(p.id)"
                        >
                          {{ procesando() === p.id ? '...' : 'Rechazar' }}
                        </button>
                      </div>
                    </td>
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
export class AdminPostulacionesPageComponent implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  readonly postulaciones = signal<Profesional[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly procesando = signal<number | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.profesionalService.pendientes().subscribe({
      next: (data) => {
        this.postulaciones.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  aprobar(id: number): void {
    this.resolver(id, 'aprobar', 'Profesional aprobado correctamente');
  }

  rechazar(id: number): void {
    this.resolver(id, 'rechazar', 'Profesional rechazado correctamente');
  }

  private resolver(id: number, accion: 'aprobar' | 'rechazar', mensajeDefault: string): void {
    this.error.set('');
    this.success.set('');
    this.procesando.set(id);
    this.profesionalService[accion](id).subscribe({
      next: (res) => {
        this.success.set(res?.['mensaje'] || mensajeDefault);
        this.postulaciones.update((prev) => prev.filter((p) => p.id !== id));
        this.procesando.set(null);
      },
      error: (err) => {
        this.error.set(err.message);
        this.procesando.set(null);
      },
    });
  }
}
