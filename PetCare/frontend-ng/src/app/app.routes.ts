import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { DashboardComponent } from './layout/dashboard.component';
import { AdminMascotasPageComponent } from './pages/admin-mascotas-page.component';
import { AdminPostulacionesPageComponent } from './pages/admin-postulaciones-page.component';
import { AdminProductosPageComponent } from './pages/admin-productos-page.component';
import { AdminReportesPageComponent } from './pages/admin-reportes-page.component';
import { AdminTurnosPageComponent } from './pages/admin-turnos-page.component';
import { AdminUsuariosPageComponent } from './pages/admin-usuarios-page.component';
import { CarritoPageComponent } from './pages/carrito-page.component';
import { CompraExitosaPageComponent } from './pages/compra-exitosa-page.component';
import { DashboardHomeComponent } from './pages/dashboard-home.component';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { MascotasPageComponent } from './pages/mascotas-page.component';
import { MisPacientesProfesionalPageComponent } from './pages/mis-pacientes-profesional-page.component';
import { MisTurnosPageComponent } from './pages/mis-turnos-page.component';
import { MisTurnosProfesionalPageComponent } from './pages/mis-turnos-profesional-page.component';
import { PerfilProfesionalPageComponent } from './pages/perfil-profesional-page.component';
import { ProfesionalDashboardComponent } from './pages/profesional-dashboard.component';
import { ProfesionalesPageComponent } from './pages/profesionales-page.component';
import { ReservarTurnoPageComponent } from './pages/reservar-turno-page.component';
import { SeguimientoPageComponent } from './pages/seguimiento-page.component';
import { TarjetasPageComponent } from './pages/tarjetas-page.component';
import { TiendaPageComponent } from './pages/tienda-page.component';

// Espejo de las rutas de frontend/src/App.jsx
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
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
      { path: 'admin/usuarios', component: AdminUsuariosPageComponent },
      { path: 'admin/postulaciones', component: AdminPostulacionesPageComponent },
      { path: 'admin/mascotas', component: AdminMascotasPageComponent },
      { path: 'admin/turnos', component: AdminTurnosPageComponent },
      { path: 'admin/productos', component: AdminProductosPageComponent },
      { path: 'admin/reportes', component: AdminReportesPageComponent },
      { path: 'profesional', component: ProfesionalDashboardComponent },
      { path: 'profesional/mis-turnos', component: MisTurnosProfesionalPageComponent },
      { path: 'profesional/mis-pacientes', component: MisPacientesProfesionalPageComponent },
      { path: 'profesional/perfil', component: PerfilProfesionalPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
