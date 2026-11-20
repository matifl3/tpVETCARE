import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { AdminMascotasPageComponent } from './pages/admin/mascotas/admin-mascotas-page.component';
import { AdminPostulacionesPageComponent } from './pages/admin/postulaciones/admin-postulaciones-page.component';
import { AdminProductosPageComponent } from './pages/admin/productos/admin-productos-page.component';
import { AdminReportesPageComponent } from './pages/admin/reportes/admin-reportes-page.component';
import { AdminTurnosPageComponent } from './pages/admin/turnos/admin-turnos-page.component';
import { AdminTurnosEstadisticasPageComponent } from './pages/admin/turnos/estadisticas/admin-turnos-estadisticas-page.component';
import { AdminUsuariosPageComponent } from './pages/admin/usuarios/admin-usuarios-page.component';
import { CompraExitosaPageComponent } from './pages/cliente/compra-exitosa/compra-exitosa-page.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { HomeComponent } from './pages/home/home.component';
import { HistorialClinicoProfesionalPageComponent } from './pages/profesional/historial-clinico/historial-clinico-profesional-page.component';
import { LoginComponent } from './pages/login/login.component';
import { MascotasPageComponent } from './pages/cliente/mascotas/mascotas-page.component';
import { MisPacientesProfesionalPageComponent } from './pages/profesional/mis-pacientes/mis-pacientes-profesional-page.component';
import { MisTurnosPageComponent } from './pages/cliente/mis-turnos/mis-turnos-page.component';
import { MisTurnosProfesionalPageComponent } from './pages/profesional/mis-turnos/mis-turnos-profesional-page.component';
import { PerfilProfesionalPageComponent } from './pages/profesional/perfil/perfil-profesional-page.component';
import { ProfesionalDashboardComponent } from './pages/profesional/inicio/profesional-dashboard.component';
import { ProfesionalesPageComponent } from './pages/cliente/profesionales/profesionales-page.component';
import { ReservarTurnoPageComponent } from './pages/cliente/reservar-turno/reservar-turno-page.component';
import { SeguimientoPageComponent } from './pages/seguimiento/seguimiento-page.component';
import { TarjetasPageComponent } from './pages/cliente/tarjetas/tarjetas-page.component';
import { TiendaPageComponent } from './pages/cliente/tienda/tienda-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { CarritoPageComponent } from './pages/cliente/carrito/carrito-page/carrito-page.component';
import { ROLES_PROFESIONALES } from './core/models';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'mascotas', component: MascotasPageComponent },
      { path: 'profesionales', component: ProfesionalesPageComponent },
      { path: 'profesionales/reservar/:idProfesional', component: ReservarTurnoPageComponent },
      { path: 'tienda', component: TiendaPageComponent },
      { path: 'carrito', component: CarritoPageComponent },
      { path: 'mis-turnos', component: MisTurnosPageComponent },
      { path: 'mascotas/:idMascota/seguimiento', component: SeguimientoPageComponent },
      { path: 'tarjetas', component: TarjetasPageComponent },
      { path: 'compra-exitosa', component: CompraExitosaPageComponent },
      { path: 'admin/usuarios', component: AdminUsuariosPageComponent,  data: { roles: ['ADMIN'] } },
      { path: 'admin/postulaciones', component: AdminPostulacionesPageComponent, data: { roles: ['ADMIN'] } },
      { path: 'admin/mascotas', component: AdminMascotasPageComponent, data: { roles: ['ADMIN'] } },
      { path: 'admin/turnos', component: AdminTurnosPageComponent, data: { roles: ['ADMIN'] } },
      { path: 'admin/turnos/estadisticas', component: AdminTurnosEstadisticasPageComponent, data: { roles: ['ADMIN'] } },
      { path: 'admin/productos', component: AdminProductosPageComponent, data: { roles: ['ADMIN'] } },
      { path: 'admin/reportes', component: AdminReportesPageComponent, data: { roles: ['ADMIN'] } },
      { path: 'profesional', component: ProfesionalDashboardComponent, data: { roles: ROLES_PROFESIONALES } },
      { path: 'profesional/mis-turnos', component: MisTurnosProfesionalPageComponent, data: { roles: ROLES_PROFESIONALES } },
      { path: 'profesional/mis-pacientes', component: MisPacientesProfesionalPageComponent, data: { roles: ROLES_PROFESIONALES } },
      { path: 'profesional/mis-pacientes/:idMascota/historial', component: HistorialClinicoProfesionalPageComponent, data: { roles: ROLES_PROFESIONALES } },
      { path: 'profesional/perfil', component: PerfilProfesionalPageComponent, data: { roles: ROLES_PROFESIONALES } },
    ],
  },
  { path: '**', redirectTo: '' },
];
