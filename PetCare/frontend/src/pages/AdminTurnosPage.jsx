import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminTurnosPage() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.turnos.listarTodos()
      .then(setTurnos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Turnos</h1>
      {error && <div className="alert alert-error show">{error}</div>}

      <div style={{ overflowX: 'auto', marginTop: 24 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profesional</th>
              <th>Mascota</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nombreProfesional || '—'}</td>
                <td>{t.nombreMascota || '—'}</td>
                <td>{t.fecha || '—'}</td>
                <td><span className="nav-role">{t.estadoTurno || '—'}</span></td>
                <td>{t.activo ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default AdminTurnosPage