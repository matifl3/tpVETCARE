import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from '../core/models';
import { MascotaService } from '../services/mascota.service';

@Component({
  selector: 'app-admin-mascotas-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Mascotas</h1>
          <a routerLink="/dashboard" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver al Dashboard</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        <div class="admin-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Raza</th>
                <th>Sexo</th>
                <th>Cliente ID</th>
                <th>Activo</th>
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
                  <td>{{ m.idUsuario }}</td>
                  <td>{{ m.activo ? '✅' : '❌' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
})
export class AdminMascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.mascotaService.listarTodos().subscribe({
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
