import { Link, useOutletContext } from 'react-router-dom'

const ROL_LABELS = {
  VETERINARIO: { icon: '👨‍⚕️', label: 'Veterinario' },
  PASEADOR: { icon: '🐕', label: 'Paseador' },
  PELUQUERO: { icon: '✂️', label: 'Peluquero' },
  ADIESTRADOR: { icon: '🎯', label: 'Adiestrador' },
  CUIDADOR: { icon: '🏠', label: 'Cuidador' },
}

function ProfesionalDashboard() {
  const { user } = useOutletContext()
  const info = ROL_LABELS[user.rol] || { icon: '👤', label: user.rol }

  return (
    <div className="dashboard">
      <h1>Panel de {info.label}</h1>
      <p>Bienvenido, {user.nombre}. Gestioná tus turnos y pacientes desde acá.</p>

      <div className="card-grid">
        <Link to="/dashboard/profesional/mis-turnos" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="dash-icon">📅</span>
          <h3>Mis Turnos</h3>
          <p>Revisá y gestioná tus turnos asignados.</p>
          <span className="dash-link">Ver más →</span>
        </Link>
        <Link to="/dashboard/profesional/mis-pacientes" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="dash-icon">🐾</span>
          <h3>Mis Pacientes</h3>
          <p>Revisá las mascotas a tu cargo.</p>
          <span className="dash-link">Ver más →</span>
        </Link>
        <Link to="/dashboard/profesional/perfil" className="dash-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="dash-icon">👤</span>
          <h3>Perfil Profesional</h3>
          <p>Consultá tu matrícula, experiencia y datos.</p>
          <span className="dash-link">Ver más →</span>
        </Link>
      </div>
    </div>
  )
}

export default ProfesionalDashboard