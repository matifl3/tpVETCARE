import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function MisTurnosPage() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.turnos.misTurnos()
      .then(setTurnos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Mis Turnos</h1>
      <p style={{ marginBottom: 24 }}>Turnos y reservas activas.</p>

      {error && <div className="alert alert-error show">{error}</div>}

      {turnos.length === 0 ? (
        <p style={{ color: '#777' }}>No tenés turnos registrados.</p>
      ) : (
        <div className="card-grid">
          {turnos.map((t) => (
            <div key={t.id} className="dash-card">
              <span className="dash-icon">📅</span>
              <h3>{t.nombreProfesional || `Profesional #${t.id_profesional}`}</h3>
              <p><strong>Mascota:</strong> {t.nombreMascota || `#${t.id_mascota}`}</p>
              <p><strong>Fecha:</strong> {t.fecha}</p>
              {t.horas && <p><strong>Horas:</strong> {t.horas}</p>}
              {t.precio != null && <p><strong>Precio:</strong> ${t.precio?.toFixed(2)}</p>}
              <p><span className={`nav-role`} style={{ background: t.estadoTurno === 'CONFIRMADO' ? '#388e3c' : '#d32f2f' }}>{t.estadoTurno}</span></p>
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default MisTurnosPage