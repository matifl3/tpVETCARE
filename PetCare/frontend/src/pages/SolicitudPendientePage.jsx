import { Link } from 'react-router-dom'
import api from '../services/api'

function SolicitudPendientePage({ user }) {
  const esRechazado = user?.estado === 'RECHAZADO'

  const handleLogout = async () => {
    await api.auth.logout()
    window.location.href = '/login'
  }

  return (
    <div className="dashboard" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>
        {esRechazado ? '❌' : '⏳'}
      </div>
      <h1 style={{ marginBottom: 16 }}>
        {esRechazado ? 'Solicitud rechazada' : 'Solicitud en revisión'}
      </h1>
      <p style={{ color: '#777', fontSize: 16, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
        {esRechazado
          ? 'Tu solicitud de registro como profesional fue rechazada. Contactá con soporte para más información.'
          : 'Tu solicitud de registro como profesional está siendo revisada por el administrador. Te notificaremos cuando sea aprobada.'}
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link to="/" className="btn-secondary">Volver al inicio</Link>
        <button className="btn-secondary" style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
          onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  )
}

export default SolicitudPendientePage