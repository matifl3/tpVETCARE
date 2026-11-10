// Modelos compartidos por toda la app.
// Inferidos de los DTO del backend (Spring Boot). El índice de propiedades
// tolera campos extra que devuelva el backend.

/** Usuario de la sesión: respuesta de /api/auth/me y /api/auth/login. */
export interface SessionUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  aprobado: boolean;
  estado?: string;
  pendientes?: number;
  [key: string]: any;
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
  [key: string]: any;
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
  [key: string]: any;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  activo?: boolean;
  [key: string]: any;
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
  [key: string]: any;
}

export interface CarritoProducto {
  id: number;
  idProducto: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  [key: string]: any;
}

export interface CarritoTurno {
  id: number;
  idProfesional: number;
  nombreProfesional: string;
  rolProfesional?: string;
  idMascota: number;
  nombreMascota: string;
  fecha: string;
  horas?: number;
  precio?: number;
  [key: string]: any;
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
  [key: string]: any;
}

export interface Tarjeta {
  idTarjeta: number;
  ultimosDigitos: string;
  titular: string;
  vencimiento: string;
  activo?: boolean;
  [key: string]: any;
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
  [key: string]: any;
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
  [key: string]: any;
}

/** Seguimiento completo de entrenamiento de una mascota. */
export interface Seguimiento {
  id: number;
  fechaCreacion?: string;
  activo?: boolean;
  idMascota: number;
  nombreMascota?: string;
  registros?: RegistroProgreso[];
  [key: string]: any;
}

/** Reporte de ganancias mensuales. */
export interface GananciaMensual {
  anio: number;
  mes: number;
  cantidadVentas: number;
  gananciaTotal: number;
  [key: string]: any;
}

/** Reporte de productos más vendidos. */
export interface ProductoMasVendido {
  idProducto: number;
  nombreProducto: string;
  categoria?: string;
  cantidadVendida: number;
  gananciaTotal: number;
  [key: string]: any;
}

/** Reporte de ventas por rango de fechas (forma libre según filtros). */
export interface ReporteVenta {
  [key: string]: any;
}
