import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import api from '../services/api'

function MisTurnosProfesionalPage() {
  const { user } = useOutletContext()
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.turnos.porProfesional(user.id)
      .then(setTurnos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Mis Turnos</h1>
        <Link to="/dashboard/profesional" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}

      {turnos.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: '#777', textAlign: 'center', padding: 32 }}>No tenés turnos asignados.</p>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mascota</th>
                <th>Fecha</th>
                <th>Horas</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.nombreMascota || '—'}</td>
                  <td>{t.fecha || '—'}</td>
                  <td>{t.horas || '—'}</td>
                  <td>{t.precio ? `$${t.precio.toFixed(2)}` : '—'}</td>
                  <td><span className="nav-role">{t.estadoTurno || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MisTurnosProfesionalPage