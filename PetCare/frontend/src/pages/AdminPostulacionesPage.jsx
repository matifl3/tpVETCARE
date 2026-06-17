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
      <h1>Postulaciones</h1>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      {postulaciones.length === 0 ? (
        <p style={{ color: '#777', marginTop: 24 }}>No hay postulaciones pendientes.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 24 }}>
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
                <tr key={p.idUsuario}>
                  <td>{p.idUsuario}</td>
                  <td>{p.nombre} {p.apellido}</td>
                  <td>{p.email}</td>
                  <td><span className="nav-role">{p.rol}</span></td>
                  <td>{p.matricula}</td>
                  <td>{p.experiencia}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ padding: '4px 12px', fontSize: 13 }}
                      onClick={() => aprobar(p.idUsuario)}>Aprobar</button>
                    <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 13, color: '#d32f2f', borderColor: '#d32f2f' }}
                      onClick={() => rechazar(p.idUsuario)}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default AdminPostulacionesPage