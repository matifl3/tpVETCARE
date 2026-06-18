import { useOutletContext } from 'react-router-dom'
import { Link } from 'react-router-dom'

function DashboardHome() {
  const { user } = useOutletContext()

  return (
    <div className="dashboard">
      <h1>{user.rol === 'ADMIN' ? 'Panel de Administración' : `¡Bienvenido, ${user.nombre}!`}</h1>
      <p>{user.rol === 'ADMIN' ? `Bienvenido, ${user.nombre}. Gestioná la plataforma PetCare.` : 'Gestioná tus mascotas, turnos y más desde tu panel.'}</p>

      {user.rol === 'DUENIO' && (
        <div className="card-grid">
          <Link to="/dashboard/mascotas" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">🐕</span>
            <h3>Mis Mascotas</h3>
            <p>Registrá y administrá las mascotas a tu cargo.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/profesionales" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">👨‍⚕️</span>
            <h3>Profesionales</h3>
            <p>Buscá profesionales y solicitá turnos.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/tienda" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">🛒</span>
            <h3>Tienda</h3>
            <p>Comprá productos para tu mascota.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/carrito" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">🛍️</span>
            <h3>Carrito</h3>
            <p>Revisá y confirmá tus compras.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/tarjetas" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">💳</span>
            <h3>Métodos de pago</h3>
            <p>Administrá tus tarjetas y medios de pago.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/mis-turnos" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">📅</span>
            <h3>Mis Turnos</h3>
            <p>Revisá tus turnos y reservas activas.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/paseos/mis-paseos-cliente" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">📍</span>
            <h3>Mis Paseos en Vivo</h3>
            <p>Seguí en tiempo real los paseos de tus mascotas.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
        </div>
      )}

      {user.rol === 'ADMIN' && (
        <div className="card-grid">
          <Link to="/dashboard/admin/usuarios" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">👥</span>
            <h3>Usuarios</h3>
            <p>Gestioná todos los usuarios registrados.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/admin/postulaciones" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">📋</span>
            <h3>Postulaciones {user.pendientes > 0 && <span className="nav-role">{user.pendientes} pendientes</span>}</h3>
            <p>Revisá y aprobá solicitudes de profesionales.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/admin/mascotas" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">🐾</span>
            <h3>Mascotas</h3>
            <p>Administrá las mascotas registradas.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/admin/turnos" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">📅</span>
            <h3>Turnos</h3>
            <p>Visualizá todos los turnos.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/admin/productos" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">🛒</span>
            <h3>Productos</h3>
            <p>Administrá el catálogo de productos.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
          <Link to="/dashboard/admin/reportes" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">📊</span>
            <h3>Reportes</h3>
            <p>Visualizá estadísticas y ganancias.</p>
            <span className="dash-link">Ver más →</span>
          </Link>
        </div>
      )}

      {['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'].includes(user.rol) && (
        <div className="card-grid">
          <Link to="/dashboard/profesional" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="dash-icon">📅</span>
            <h3>Panel Profesional</h3>
            <p>Gestioná tus turnos, pacientes y perfil.</p>
            <span className="dash-link">Ir al panel →</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default DashboardHome