import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminPostulacionesPage() {
  const [postulaciones, setPostulaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const cargar = () => {
    setLoading(true)
    api.profesionales.pendientes()
      .then(setPostulaciones)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const aprobar = async (id) => {
    try {
      await api.profesionales.aprobar(id)
      setSuccess('Profesional aprobado exitosamente')
      cargar()
    } catch (err) { setError(err.message) }
  }

  const rechazar = async (id) => {
    try {
      await api.profesionales.rechazar(id)
      setSuccess('Profesional rechazado')
      cargar()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Postulaciones</h1>
        <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver al Dashboard</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      {postulaciones.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: '#777', textAlign: 'center', padding: 32 }}>No hay postulaciones pendientes.</p>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Matrícula</th>
                <th>Experiencia</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {postulaciones.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre} {p.apellido}</td>
                  <td>{p.email}</td>
                  <td><span className="nav-role">{p.rol}</span></td>
                  <td>{p.matricula || '—'}</td>
                  <td>{p.experiencia || '—'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-primary btn-sm"
                        onClick={() => aprobar(p.id)}>Aprobar</button>
                      <button className="btn-secondary btn-sm"
                        style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                        onClick={() => rechazar(p.id)}>Rechazar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPostulacionesPage