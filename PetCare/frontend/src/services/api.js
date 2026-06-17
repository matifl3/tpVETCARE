const API_URL = import.meta.env.VITE_API_URL || ''

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  }

  if (!config.body) delete config.body

  const res = await fetch(url, config)

  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Error en la solicitud')
  }

  return data
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  postWithParams: (endpoint, params) => {
    const qs = new URLSearchParams(params).toString()
    return request(`${endpoint}?${qs}`, { method: 'POST' })
  },
  putWithParams: (endpoint, params) => {
    const qs = new URLSearchParams(params).toString()
    return request(`${endpoint}?${qs}`, { method: 'PUT' })
  },
  deleteWithParams: (endpoint, params) => {
    const qs = new URLSearchParams(params).toString()
    return request(`${endpoint}?${qs}`, { method: 'DELETE' })
  },

  auth: {
    login: (email, password) => api.post('/api/auth/login', { email, password }),
    registro: (data) => api.post('/api/auth/registro', data),
    me: () => api.get('/api/auth/me'),
    logout: () => fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' }),
  },

  mascotas: {
    misMascotas: () => api.get('/api/mascotas/mias'),
    listarTodos: () => api.get('/api/mascotas'),
    crear: (data) => api.post('/api/mascotas/mias', data),
    actualizar: (id, data) => api.put(`/api/mascotas/${id}`, data),
    eliminar: (id) => api.delete(`/api/mascotas/${id}`),
    buscarPorId: (id) => api.get(`/api/mascotas/${id}`),
  },

  productos: {
    listar: () => api.get('/api/productos'),
    porCategoria: (cat) => api.get(`/api/productos/categoria/${encodeURIComponent(cat)}`),
    buscarPorId: (id) => api.get(`/api/productos/${id}`),
    buscarPorNombre: (nombre) => api.get(`/api/productos/nombre/${encodeURIComponent(nombre)}`),
    crear: (data) => api.post('/api/productos', data),
    actualizar: (id, data) => api.put(`/api/productos/${id}`, data),
    eliminar: (id) => api.delete(`/api/productos/${id}`),
  },

  carrito: {
    obtener: () => api.get('/api/carrito'),
    agregar: (idProducto, cantidad) => api.postWithParams('/api/carrito/agregar', { idProducto, cantidad }),
    eliminar: (idProducto) => api.deleteWithParams('/api/carrito/eliminar', { idProducto }),
    modificar: (idProducto, cantidad) => api.putWithParams('/api/carrito/modificar', { idProducto, cantidad }),
    agregarTurno: (data) => api.post('/api/carrito/agregar-turno', data),
    eliminarTurno: (idCarritoTurno) => api.delete(`/api/carrito/eliminar-turno/${idCarritoTurno}`),
    comprar: (data) => api.post('/api/carrito/comprar', data),
    historial: () => api.get('/api/carrito/historial'),
  },

  turnos: {
    misTurnos: () => api.get('/api/turnos/mis-turnos'),
    listarTodos: () => api.get('/api/turnos'),
    solicitar: (data) => api.post('/api/turnos/solicitar', data),
    disponibilidad: (idProfesional, fecha) =>
      api.get(`/api/turnos/disponibilidad/${idProfesional}?fecha=${fecha}`),
  },

  tarjetas: {
    listar: () => api.get('/api/tarjetas'),
    agregar: (data) => api.post('/api/tarjetas/agregar', data),
    eliminar: (id) => api.delete(`/api/tarjetas/eliminar/${id}`),
  },

  profesionales: {
    listar: () => api.get('/api/profesionales'),
    porRol: (rol) => api.get(`/api/profesionales/rol/${rol}`),
    buscarPorId: (id) => api.get(`/api/profesionales/${id}`),
    pendientes: () => api.get('/api/profesionales/pendientes'),
    aprobar: (id) => api.put(`/api/profesionales/${id}/aprobar`),
    rechazar: (id) => api.put(`/api/profesionales/${id}/rechazar`),
  },

  usuarios: {
    listar: () => api.get('/api/usuarios'),
    buscarPorId: (id) => api.get(`/api/usuarios/buscar/${id}`),
    actualizar: (data) => api.put('/api/usuarios/actualizar', data),
    eliminar: (id) => api.delete(`/api/usuarios/eliminar/${id}`),
  },

  reportes: {
    ventas: (fechaInicio, fechaFin) =>
      api.get(`/api/carrito/reportes/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
    ganancias: (anio, mes) =>
      api.get(`/api/carrito/reportes/ganancias?anio=${anio}&mes=${mes}`),
    productosMasVendidos: (anio, mes) =>
      api.get(`/api/carrito/reportes/productos-mas-vendidos?anio=${anio}&mes=${mes}`),
  },
}

export default api
