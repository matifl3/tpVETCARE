import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function MisPaseosClientePage() {
  const [paseos, setPaseos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.paseos.paseosDelCliente()
      .then(setPaseos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Mis Paseos en Vivo</h1>
      <p style={{ marginBottom: 24 }}>Seguí en tiempo real los paseos de tus mascotas.</p>

      {error && <div className="alert alert-error show">{error}</div>}

      {paseos.length === 0 ? (
        <p style={{ color: '#777' }}>No tenés paseos activos. Cuando un paseador inicie un paseo, lo verás acá.</p>
      ) : (
        <div className="card-grid">
          {paseos.map((p) => (
            <div key={p.idPaseo} className="dash-card">
              <span className="dash-icon">📍</span>
              <h3>{p.nombreMascota}</h3>
              <p><strong>Paseador:</strong> {p.nombrePaseador}</p>
              <p><strong>Estado:</strong> <span className={`nav-role`} style={{ background: p.estado === 'EN_CURSO' ? '#388e3c' : '#777' }}>{p.estado === 'EN_CURSO' ? 'En Curso' : 'Finalizado'}</span></p>
              {p.fechaInicio && <p><strong>Inicio:</strong> {new Date(p.fechaInicio).toLocaleString()}</p>}
              {p.estado === 'EN_CURSO' && (
                <Link to={`/dashboard/seguir-paseo/${p.idPaseo}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' }}>
                  Seguir en Vivo
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default MisPaseosClientePage