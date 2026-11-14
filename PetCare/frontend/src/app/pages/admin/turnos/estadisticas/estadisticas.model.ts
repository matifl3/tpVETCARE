/** Tipos y catálogos del panel de estadísticas de turnos. */

/** Atajos de período: al elegirlos también se ajusta la agrupación. */
export interface Preset {
  id: string;
  label: string;
  agrupacion: string | null;
}

export interface Agrupacion {
  id: string;
  label: string;
}

export interface RangoFechas {
  desde: string;
  hasta: string;
}

export const PRESETS: Preset[] = [
  { id: '30d', label: 'Últimos 30 días', agrupacion: 'DIA' },
  { id: '6m', label: 'Últimos 6 meses', agrupacion: 'SEMANA' },
  { id: '12m', label: 'Últimos 12 meses', agrupacion: 'MES' },
  { id: 'prox30d', label: 'Próximos 30 días', agrupacion: 'DIA' },
  { id: 'prox12m', label: 'Próximos 12 meses', agrupacion: 'MES' },
  { id: 'anio', label: 'Este año', agrupacion: 'MES' },
  { id: 'custom', label: 'Personalizado', agrupacion: null },
];

export const AGRUPACIONES: Agrupacion[] = [
  { id: 'DIA', label: 'Día' },
  { id: 'SEMANA', label: 'Semana' },
  { id: 'MES', label: 'Mes' },
];
