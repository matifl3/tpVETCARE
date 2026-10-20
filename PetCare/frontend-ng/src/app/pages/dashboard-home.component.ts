import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SessionUser } from '../core/models';

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

/**
 * Equivalente a frontend/src/pages/DashboardHome.jsx.
 * El usuario se lee de la signal global (antes: useOutletContext).
 */
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <h1>{{ user.rol === 'ADMIN' ? 'Panel de Administración' : '¡Bienvenido, ' + user.nombre + '!' }}</h1>
      <p>
        {{
          user.rol === 'ADMIN'
            ? 'Bienvenido, ' + user.nombre + '. Gestioná la plataforma PetCare.'
            : 'Gestioná tus mascotas, turnos y más desde tu panel.'
        }}
      </p>

      @if (user.rol === 'CLIENTE') {
        <div class="card-grid">
          <a routerLink="/dashboard/mascotas" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">🐕</span>
            <h3>Mis Mascotas</h3>
            <p>Registrá y administrá las mascotas a tu cargo.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/profesionales" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">👨‍⚕️</span>
            <h3>Profesionales</h3>
            <p>Buscá profesionales y solicitá turnos.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/tienda" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">🛒</span>
            <h3>Tienda</h3>
            <p>Comprá productos para tu mascota.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/carrito" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">🛍️</span>
            <h3>Carrito</h3>
            <p>Revisá y confirmá tus compras.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/tarjetas" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">💳</span>
            <h3>Métodos de pago</h3>
            <p>Administrá tus tarjetas y medios de pago.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/mis-turnos" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">📅</span>
            <h3>Mis Turnos</h3>
            <p>Revisá tus turnos y reservas activas.</p>
            <span class="dash-link">Ver más →</span>
          </a>
        </div>
      }

      @if (user.rol === 'ADMIN') {
        <div class="card-grid">
          <a routerLink="/dashboard/admin/usuarios" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">👥</span>
            <h3>Usuarios</h3>
            <p>Gestioná todos los usuarios registrados.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/admin/postulaciones" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">📋</span>
            <h3>
              Postulaciones
              @if (user.pendientes) {
                <span class="nav-role">{{ user.pendientes }} pendientes</span>
              }
            </h3>
            <p>Revisá y aprobá solicitudes de profesionales.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/admin/mascotas" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">🐾</span>
            <h3>Mascotas</h3>
            <p>Administrá las mascotas registradas.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/admin/turnos" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">📅</span>
            <h3>Turnos</h3>
            <p>Visualizá todos los turnos.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/admin/productos" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">🛒</span>
            <h3>Productos</h3>
            <p>Administrá el catálogo de productos.</p>
            <span class="dash-link">Ver más →</span>
          </a>
          <a routerLink="/dashboard/admin/reportes" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">📊</span>
            <h3>Reportes</h3>
            <p>Visualizá estadísticas y ganancias.</p>
            <span class="dash-link">Ver más →</span>
          </a>
        </div>
      }

      @if (rolesProfesionales.includes(user.rol)) {
        <div class="card-grid">
          <a routerLink="/dashboard/profesional" class="dash-card" style="text-decoration: none; color: inherit">
            <span class="dash-icon">📅</span>
            <h3>Panel Profesional</h3>
            <p>Gestioná tus turnos, pacientes y perfil.</p>
            <span class="dash-link">Ir al panel →</span>
          </a>
        </div>
      }
    </div>
  `,
})
export class DashboardHomeComponent {
  private readonly auth = inject(AuthService);

  protected readonly user: SessionUser = this.auth.user()!;
  protected readonly rolesProfesionales = ROLES_PROFESIONALES;
}
