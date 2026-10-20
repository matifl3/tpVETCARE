import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminMascotasPage() {
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.mascotas.listarTodos()
      .then(setMascotas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Mascotas</h1>
        <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver al Dashboard</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Sexo</th>
              <th>Cliente ID</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((m) => (
              <tr key={m.idMascota}>
                <td>{m.idMascota}</td>
                <td>{m.nombre}</td>
                <td>{m.especie}</td>
                <td>{m.raza || '—'}</td>
                <td>{m.sexo || '—'}</td>
                <td>{m.idUsuario}</td>
                <td>{m.activo ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminMascotasPage