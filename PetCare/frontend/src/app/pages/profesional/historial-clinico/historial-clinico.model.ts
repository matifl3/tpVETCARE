/**
 * Tipos y valores iniciales compartidos por la ficha y las secciones del
 * historial clínico (vacunas y medicamentos).
 */

export interface FichaModel {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  peso: number | null;
  fechaNacimiento: string;
  observaciones: string;
  observacionesHistorial: string;
}

export interface VacunaForm {
  nombre: string;
  lote: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  observaciones: string;
}

export interface MedicamentoForm {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  fechaPrescripcion: string;
  indicaciones: string;
}

export const FICHA_VACIA: FichaModel = {
  nombre: '',
  especie: '',
  raza: '',
  sexo: '',
  peso: null,
  fechaNacimiento: '',
  observaciones: '',
  observacionesHistorial: '',
};

export const VACUNA_VACIA: VacunaForm = {
  nombre: '',
  lote: '',
  fechaAplicacion: '',
  fechaProximaDosis: '',
  observaciones: '',
};

export const MEDICAMENTO_VACIO: MedicamentoForm = {
  nombre: '',
  dosis: '',
  frecuencia: '',
  duracion: '',
  fechaPrescripcion: '',
  indicaciones: '',
};

/** Fecha de hoy en formato YYYY-MM-DD (mismo criterio que el formulario de mascotas). */
export function fechaHoy(): string {
  return new Date().toLocaleDateString('en-CA');
}
