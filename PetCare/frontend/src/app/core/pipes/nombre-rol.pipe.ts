import { Pipe, PipeTransform } from '@angular/core';

/** Nombre legible de cada rol del sistema. */
const NOMBRES_ROL: Record<string, string> = {
  ADMIN: 'Administrador',
  CLIENTE: 'Cliente',
  VETERINARIO: 'Veterinario',
  PASEADOR: 'Paseador',
  PELUQUERO: 'Peluquero',
  ADIESTRADOR: 'Adiestrador',
  CUIDADOR: 'Cuidador',
};

/**
 * Muestra el rol con un nombre lindo: `VETERINARIO` → `Veterinario`.
 * Si el rol no está en el mapa, lo capitaliza (`OTRO` → `Otro`).
 */
@Pipe({ name: 'nombreRol' })
export class NombreRolPipe implements PipeTransform {
  transform(rol: string | null | undefined): string {
    if (!rol) return '';
    const normalizado = rol.toUpperCase();
    return NOMBRES_ROL[normalizado] ?? normalizado.charAt(0) + normalizado.slice(1).toLowerCase();
  }
}
