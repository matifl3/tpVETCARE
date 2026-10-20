import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Mascota, SessionUser } from '../core/models';
import { MascotaService } from '../services/mascota.service';

@Component({
  selector: 'app-mis-pacientes-profesional-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Mis Pacientes</h1>
          <a routerLink="/dashboard/profesional" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        @if (mascotas().length === 0) {
          <div class="admin-card">
            <p style="color: #777; text-align: center; padding: 32px">No tenés pacientes asignados.</p>
          </div>
        } @else {
          <div class="admin-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Raza</th>
                  <th>Sexo</th>
                  @if (user.rol === 'ADIESTRADOR') {
                    <th>Acción</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (m of mascotas(); track m.idMascota) {
                  <tr>
                    <td>{{ m.idMascota }}</td>
                    <td>{{ m.nombre }}</td>
                    <td>{{ m.especie }}</td>
                    <td>{{ m.raza || '—' }}</td>
                    <td>{{ m.sexo || '—' }}</td>
                    @if (user.rol === 'ADIESTRADOR') {
                      <td>
                        <a
                          [routerLink]="['/dashboard/mascotas', m.idMascota, 'seguimiento']"
                          class="btn-primary btn-sm"
                          style="text-decoration: none"
                        >
                          Seguimiento
                        </a>
                      </td>
                    }
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
export class MisPacientesProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly mascotaService = inject(MascotaService);

  protected readonly user: SessionUser = this.auth.user()!;

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.mascotaService.atendidasPor(this.user.id).subscribe({
      next: (data) => {
        this.mascotas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
