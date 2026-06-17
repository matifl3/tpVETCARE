import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import api from '../services/api'

const ROL_LABELS = {
  VETERINARIO: 'Veterinario',
  PASEADOR: 'Paseador',
  PELUQUERO: 'Peluquero',
  ADIESTRADOR: 'Adiestrador',
  CUIDADOR: 'Cuidador',
}

function PerfilProfesionalPage() {
  const { user } = useOutletContext()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.profesionales.buscarPorId(user.id)
      .then(setPerfil)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Perfil Profesional</h1>
        <Link to="/dashboard/profesional" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}

      {perfil && (
        <div className="admin-card" style={{ maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <h2 style={{ marginBottom: 8 }}>{perfil.nombre} {perfil.apellido}</h2>
          <p style={{ color: '#667eea', fontWeight: 600, marginBottom: 24 }}>
            {ROL_LABELS[perfil.rol] || perfil.rol}
          </p>

          <table className="admin-table">
            <tbody>
              <tr><td style={{ fontWeight: 600, width: 140 }}>Email</td><td>{perfil.email}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Teléfono</td><td>{perfil.telefono || '—'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Matrícula</td><td>{perfil.matricula || '—'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Experiencia</td><td>{perfil.experiencia || '—'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Estado</td><td><span className="nav-role">{perfil.estado}</span></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PerfilProfesionalPage