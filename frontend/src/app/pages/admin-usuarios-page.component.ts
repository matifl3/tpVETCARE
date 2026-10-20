import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../core/models';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-admin-usuarios-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Usuarios</h1>
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
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              @for (u of usuarios(); track u.idUsuario) {
                <tr>
                  <td>{{ u.idUsuario }}</td>
                  <td>{{ u.nombre }} {{ u.apellido }}</td>
                  <td>{{ u.email }}</td>
                  <td><span class="nav-role">{{ u.rol }}</span></td>
                  <td>{{ u.activo ? '✅' : '❌' }}</td>
                  <td>
                    <button class="btn-secondary btn-sm" (click)="toggleActivo(u)">
                      {{ u.activo ? 'Desactivar' : 'Activar' }}
                    </button>
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
export class AdminUsuariosPageComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  toggleActivo(user: Usuario): void {
    this.usuarioService.actualizar({ ...user, activo: !user.activo }).subscribe({
      next: () => {
        this.success.set(`Usuario ${user.email} ${user.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
