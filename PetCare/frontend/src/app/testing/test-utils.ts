// Utilidades compartidas por los tests (.spec.ts). No forma parte del build de la app.
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '../core/auth.interceptor';
import { errorInterceptor } from '../core/error.interceptor';
import { SessionUser } from '../core/models';

/** Usuario cliente logueado de ejemplo. */
export const USUARIO_CLIENTE: SessionUser = {
  id: 1,
  nombre: 'Ana',
  email: 'ana@test.com',
  rol: 'CLIENTE',
  aprobado: true,
};

/** Profesional aprobado de ejemplo. */
export const USUARIO_PROFESIONAL: SessionUser = {
  id: 2,
  nombre: 'Juan',
  email: 'juan@test.com',
  rol: 'VETERINARIO',
  aprobado: true,
  estado: 'APROBADO',
};

/** Administrador de ejemplo. */
export const USUARIO_ADMIN: SessionUser = {
  id: 3,
  nombre: 'Admin',
  email: 'admin@test.com',
  rol: 'ADMIN',
  aprobado: true,
  pendientes: 0,
};

/**
 * Providers que necesita cualquier componente en un test:
 * HttpClient con los mismos interceptores que la app (sin backend real:
 * las respuestas se simulan con HttpTestingController) y el Router.
 */
export function providersDePrueba(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(withXhr(), withInterceptors([errorInterceptor, authInterceptor])),
    provideHttpClientTesting(),
    // Ruta comodín: si un componente navega (ej: a /login) el router de prueba no tira error.
    provideRouter([{ path: '**', children: [] }]),
  ];
}
