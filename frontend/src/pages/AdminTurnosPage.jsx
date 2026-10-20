import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminTurnosPage() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.turnos.listarTodos()
      .then(setTurnos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar este turno?')) return
    setError('')
    setSuccess('')
    try {
      await api.turnos.cancelar(id)
      setSuccess('Turno cancelado correctamente')
      setTurnos((prev) => prev.map(t => t.id === id ? { ...t, estadoTurno: 'CANCELADO', activo: false } : t))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Turnos</h1>
        <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver al Dashboard</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profesional</th>
              <th>Mascota</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Activo</th>
              <th>Acción</th>
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
                <td>
                  {t.activo && (
                    <button className="btn-secondary btn-sm"
                      style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                      onClick={() => handleCancelar(t.id)}>
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTurnosPage