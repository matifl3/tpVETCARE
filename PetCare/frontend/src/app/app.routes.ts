import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import {
  ROLES_ADMIN,
  ROLES_CLIENTE,
  ROLES_HISTORIAL,
  ROLES_PROFESIONALES,
  ROLES_SEGUIMIENTO,
} from './core/roles';

/**
 * Todas las pantallas usan `loadComponent`: el chunk se descarga recién
 * cuando el usuario navega a la ruta.
 *
 * Las rutas privadas combinan `authGuard` + `roleGuard`. El orden importa:
 * `authGuard` resuelve la sesión (incluido /api/auth/me al recargar) y recién
 * después `roleGuard` valida el rol contra `data.roles`.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard-home/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent,
          ),
      },
      {
        path: 'mascotas',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/mascotas/mascotas-page.component').then(
            (m) => m.MascotasPageComponent,
          ),
      },
      {
        path: 'profesionales',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/profesionales/profesionales-page.component').then(
            (m) => m.ProfesionalesPageComponent,
          ),
      },
      {
        path: 'profesionales/reservar/:idProfesional',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/reservar-turno/reservar-turno-page.component').then(
            (m) => m.ReservarTurnoPageComponent,
          ),
      },
      {
        path: 'tienda',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/tienda/tienda-page.component').then((m) => m.TiendaPageComponent),
      },
      {
        path: 'carrito',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/carrito/carrito-page.component').then(
            (m) => m.CarritoPageComponent,
          ),
      },
      {
        path: 'mis-turnos',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/mis-turnos/mis-turnos-page.component').then(
            (m) => m.MisTurnosPageComponent,
          ),
      },
      {
        path: 'mascotas/:idMascota/seguimiento',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_SEGUIMIENTO },
        loadComponent: () =>
          import('./pages/seguimiento/seguimiento-page.component').then(
            (m) => m.SeguimientoPageComponent,
          ),
      },
      {
        path: 'tarjetas',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/tarjetas/tarjetas-page.component').then(
            (m) => m.TarjetasPageComponent,
          ),
      },
      {
        path: 'compra-exitosa',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_CLIENTE },
        loadComponent: () =>
          import('./pages/cliente/compra-exitosa/compra-exitosa-page.component').then(
            (m) => m.CompraExitosaPageComponent,
          ),
      },
      {
        path: 'admin/usuarios',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import('./pages/admin/usuarios/admin-usuarios-page.component').then(
            (m) => m.AdminUsuariosPageComponent,
          ),
      },
      {
        path: 'admin/postulaciones',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import('./pages/admin/postulaciones/admin-postulaciones-page.component').then(
            (m) => m.AdminPostulacionesPageComponent,
          ),
      },
      {
        path: 'admin/mascotas',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import('./pages/admin/mascotas/admin-mascotas-page.component').then(
            (m) => m.AdminMascotasPageComponent,
          ),
      },
      {
        path: 'admin/turnos',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import('./pages/admin/turnos/admin-turnos-page.component').then(
            (m) => m.AdminTurnosPageComponent,
          ),
      },
      {
        path: 'admin/turnos/estadisticas',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import(
            './pages/admin/turnos/estadisticas/admin-turnos-estadisticas-page.component'
          ).then((m) => m.AdminTurnosEstadisticasPageComponent),
      },
      {
        path: 'admin/productos',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import('./pages/admin/productos/admin-productos-page.component').then(
            (m) => m.AdminProductosPageComponent,
          ),
      },
      {
        path: 'admin/reportes',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_ADMIN },
        loadComponent: () =>
          import('./pages/admin/reportes/admin-reportes-page.component').then(
            (m) => m.AdminReportesPageComponent,
          ),
      },
      {
        path: 'profesional',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_PROFESIONALES },
        loadComponent: () =>
          import('./pages/profesional/inicio/profesional-dashboard.component').then(
            (m) => m.ProfesionalDashboardComponent,
          ),
      },
      {
        path: 'profesional/mis-turnos',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_PROFESIONALES },
        loadComponent: () =>
          import('./pages/profesional/mis-turnos/mis-turnos-profesional-page.component').then(
            (m) => m.MisTurnosProfesionalPageComponent,
          ),
      },
      {
        path: 'profesional/mis-pacientes',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_PROFESIONALES },
        loadComponent: () =>
          import(
            './pages/profesional/mis-pacientes/mis-pacientes-profesional-page.component'
          ).then((m) => m.MisPacientesProfesionalPageComponent),
      },
      {
        path: 'profesional/mis-pacientes/:idMascota/historial',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_HISTORIAL },
        loadComponent: () =>
          import(
            './pages/profesional/historial-clinico/historial-clinico-profesional-page.component'
          ).then((m) => m.HistorialClinicoProfesionalPageComponent),
      },
      {
        path: 'profesional/perfil',
        canActivate: [authGuard, roleGuard],
        data: { roles: ROLES_PROFESIONALES },
        loadComponent: () =>
          import('./pages/profesional/perfil/perfil-profesional-page.component').then(
            (m) => m.PerfilProfesionalPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
