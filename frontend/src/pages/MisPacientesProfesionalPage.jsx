import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import api from '../services/api'

function MisPacientesProfesionalPage() {
  const { user } = useOutletContext()
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.mascotas.atendidasPor(user.id)
      .then(setMascotas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Mis Pacientes</h1>
        <Link to="/dashboard/profesional" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}

      {mascotas.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: '#777', textAlign: 'center', padding: 32 }}>No tenés pacientes asignados.</p>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Raza</th>
                <th>Sexo</th>
                {user.rol === 'ADIESTRADOR' && <th>Acción</th>}
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
                  {user.rol === 'ADIESTRADOR' && (
                    <td>
                      <Link to={`/dashboard/mascotas/${m.idMascota}/seguimiento`} className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        Seguimiento
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MisPacientesProfesionalPage