import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const cargar = () => {
    setLoading(true)
    api.usuarios.listar()
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const toggleActivo = async (user) => {
    try {
      await api.usuarios.actualizar({ ...user, activo: !user.activo })
      setSuccess(`Usuario ${user.email} ${user.activo ? 'desactivado' : 'activado'}`)
      cargar()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Usuarios</h1>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <div style={{ overflowX: 'auto', marginTop: 24 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.idUsuario}>
                <td>{u.idUsuario}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>
                <td><span className="nav-role">{u.rol}</span></td>
                <td>{u.activo ? '✅' : '❌'}</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 13 }}
                    onClick={() => toggleActivo(u)}>
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default AdminUsuariosPage