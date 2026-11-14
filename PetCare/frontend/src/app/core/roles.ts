/**
 * Roles del sistema y agrupaciones que usan las rutas y los guards.
 * Centralizados para que la matriz de permisos viva en un solo lugar.
 */

export const ROL_ADMIN = 'ADMIN';
export const ROL_CLIENTE = 'CLIENTE';

export const ROLES_PROFESIONALES = [
  'VETERINARIO',
  'PASEADOR',
  'PELUQUERO',
  'ADIESTRADOR',
  'CUIDADOR',
] as const;

/** Pantallas exclusivas del cliente (mascotas, tienda, carrito, turnos propios). */
export const ROLES_CLIENTE = [ROL_CLIENTE] as const;

/** Backoffice de administración. */
export const ROLES_ADMIN = [ROL_ADMIN] as const;

/** Seguimiento: lo ven el dueño de la mascota y quien lo entrena. */
export const ROLES_SEGUIMIENTO = [ROL_CLIENTE, 'ADIESTRADOR', ROL_ADMIN] as const;

/** Historial clínico: lo edita el veterinario y lo supervisa el admin. */
export const ROLES_HISTORIAL = ['VETERINARIO', ROL_ADMIN] as const;
