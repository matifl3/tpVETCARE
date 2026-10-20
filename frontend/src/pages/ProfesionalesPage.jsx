import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function ProfesionalesPage() {
  const [profesionales, setProfesionales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroRol, setFiltroRol] = useState('')

  const ROLES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR']

  const cargar = (rol) => {
    setLoading(true)
    const promesa = rol ? api.profesionales.porRol(rol) : api.profesionales.listar()
    promesa
      .then(setProfesionales)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const handleFiltrar = (rol) => {
    setFiltroRol(rol)
    cargar(rol)
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Profesionales</h1>
      <p style={{ marginBottom: 24 }}>Buscá profesionales para el cuidado de tus mascotas.</p>

      {error && <div className="alert alert-error show">{error}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className={`btn-${filtroRol === '' ? 'primary' : 'secondary'}`} onClick={() => handleFiltrar('')}>
          Todos
        </button>
        {ROLES.map((r) => (
          <button key={r} className={`btn-${filtroRol === r ? 'primary' : 'secondary'}`} onClick={() => handleFiltrar(r)}>
            {r.charAt(0) + r.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {profesionales.length === 0 ? (
        <p style={{ color: '#777' }}>No se encontraron profesionales.</p>
      ) : (
        <div className="card-grid">
          {profesionales.map((p) => (
            <div key={p.id} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="dash-icon">👨‍⚕️</span>
                <h3>{p.nombre} {p.apellido}</h3>
                <p><strong>Rol:</strong> {p.rol?.charAt(0) + p.rol?.slice(1).toLowerCase()}</p>
                {p.matricula && <p><strong>Matrícula:</strong> {p.matricula}</p>}
                {p.experiencia && <p><strong>Experiencia:</strong> {p.experiencia}</p>}
                {p.precioBase != null && <p style={{ fontSize: 16, fontWeight: 700, color: '#667eea', marginTop: 8 }}>
                  Desde ${p.precioBase?.toFixed(2)}
                </p>}
              </div>
              <Link to={`/dashboard/profesionales/reservar/${p.id}`} className="btn-primary" style={{ marginTop: 12, textAlign: 'center' }}>
                Reservar turno
              </Link>
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default ProfesionalesPage