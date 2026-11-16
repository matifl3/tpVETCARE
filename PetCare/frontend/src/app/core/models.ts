// Modelos compartidos por toda la app.
// Inferidos de los DTO del backend (Spring Boot).

/** Usuario de la sesión: respuesta de /api/auth/me y /api/auth/login. */
export interface SessionUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  aprobado: boolean;
  estado?: string;
  pendientes?: number;
}

/** Usuario del sistema (GET /api/usuarios, etc.). */
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string | null;
  rol: string;
  activo: boolean;
}

export interface Mascota {
  idMascota: number;
  nombre: string;
  especie: string;
  raza?: string | null;
  sexo?: string | null;
  peso?: number | null;
  fechaNacimiento?: string | null;
  observaciones?: string | null;
  activo?: boolean;
  idUsuario?: number | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  activo?: boolean;
}

export interface Turno {
  id: number;
  fecha: string;
  id_mascota?: number;
  id_profesional?: number;
  idMascota?: number;
  idProfesional?: number;
  nombreProfesional?: string;
  nombreMascota?: string;
  estadoTurno: string;
  horas?: number;
  precio?: number;
  activo?: boolean;
}

/** Cantidad de turnos de un período del gráfico (GET /api/turnos/estadisticas). */
export interface TurnoPeriodo {
  /** Clave técnica del período: "2026-06", "2026-06-12" o "2026-W24". */
  periodo: string;
  /** Etiqueta lista para mostrar: "Jun 2026", "12/06" o "Sem 24". */
  etiqueta: string;
  cantidad: number;
}

/** Servicio (rol del profesional) dentro del ranking de más solicitados. */
export interface ServicioRanking {
  servicio: string;
  cantidad: number;
  porcentaje: number;
}

/** Totales del período consultado. Los cancelados no forman parte de total. */
export interface ResumenTurnos {
  total: number;
  confirmados: number;
  cancelados: number;
  proximos: number;
  servicioTop: string;
}

/** Respuesta completa del panel de estadísticas de turnos. */
export interface EstadisticasTurnos {
  desde: string;
  hasta: string;
  agrupacion: string;
  resumen: ResumenTurnos;
  porPeriodo: TurnoPeriodo[];
  rankingServicios: ServicioRanking[];
}

export interface CarritoProducto {
  id: number;
  idProducto: number;
  nombre?: string;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CarritoTurno {
  id: number;
  idProfesional: number;
  nombreProfesional: string;
  rolProfesional?: string;
  servicio?: string;
  idMascota: number;
  nombreMascota: string;
  fecha: string;
  horas?: number;
  precio?: number;
}

export interface Carrito {
  id: number;
  idUsuario?: number;
  estado: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  items?: CarritoProducto[];
  turnos?: CarritoTurno[];
  total: number;
  metodoPago?: string;
}

export interface Tarjeta {
  idTarjeta: number;
  ultimosDigitos: string;
  titular: string;
  vencimiento: string;
  activo?: boolean;
}

export interface Profesional {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: string;
  activo?: boolean;
  matricula?: string;
  experiencia?: string;
  estado?: string;
  precioBase?: number;
  precioHora?: number;
}

/** Registro individual de progreso (sesión de adiestramiento). */
export interface RegistroProgreso {
  id: number;
  fecha: string;
  descripcion?: string;
  tecnicas?: string;
  observaciones?: string;
  evaluacion?: string;
  idProfesional?: number;
  nombreProfesional?: string;
}

/** Seguimiento completo de entrenamiento de una mascota. */
export interface Seguimiento {
  id: number;
  fechaCreacion?: string;
  activo?: boolean;
  idMascota: number;
  nombreMascota?: string;
  registros?: RegistroProgreso[];
}

/** Vacuna registrada en el historial clínico de una mascota. */
export interface Vacuna {
  id: number;
  nombre: string;
  fechaAplicacion?: string | null;
  fechaProximaDosis?: string | null;
  lote?: string | null;
  observaciones?: string | null;
  idProfesional?: number;
  nombreProfesional?: string | null;
}

/** Medicamento recetado en el historial clínico de una mascota. */
export interface Medicamento {
  id: number;
  nombre: string;
  dosis?: string | null;
  frecuencia?: string | null;
  duracion?: string | null;
  fechaPrescripcion?: string | null;
  indicaciones?: string | null;
  activo?: boolean;
  idProfesional?: number;
  nombreProfesional?: string | null;
}

/** Historial clínico completo de una mascota. */
export interface HistorialClinico {
  id: number;
  fechaCreacion?: string | null;
  activo?: boolean;
  observaciones?: string | null;
  idMascota: number;
  nombreMascota?: string | null;
  vacunas?: Vacuna[];
  medicamentos?: Medicamento[];
}

/** Reporte de ganancias mensuales. */
export interface GananciaMensual {
  anio: number;
  mes: number;
  cantidadVentas: number;
  gananciaTotal: number;
}

/** Reporte de productos más vendidos. */
export interface ProductoMasVendido {
  idProducto: number;
  nombreProducto: string;
  categoria?: string;
  cantidadVendida: number;
  gananciaTotal: number;
}

/** Reporte de ventas por rango de fechas. */
export interface ReporteVenta {
  id: number;
  idUsuario?: number;
  nombreUsuario?: string;
  emailUsuario?: string;
  estado?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  items?: CarritoProducto[];
  turnos?: CarritoTurno[];
  total: number;
  metodoPago?: string;
}

/** Respuesta simple del backend con un mensaje de confirmación. */
export interface MensajeResponse {
  mensaje?: string;
}

/** Respuesta de GET /api/turnos/disponibilidad/:idProfesional. */
export interface DisponibilidadTurno {
  disponible: boolean;
  fecha?: string;
  idProfesional?: number;
  mensaje?: string;
}