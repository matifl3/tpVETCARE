import { useState, useEffect } from 'react'
import { useNavigate, Link, Outlet } from 'react-router-dom'
import api from '../services/api'
import SolicitudPendientePage from './SolicitudPendientePage'

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR']

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/auth/me')
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        navigate('/login')
      })
  }, [navigate])

  const handleLogout = async () => {
    await api.auth.logout()
    navigate('/login')
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>
  if (!user) return null

  const esProfesionalNoAprobado = ROLES_PROFESIONALES.includes(user.rol) && !user.aprobado

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">🐾</span>
            <h1>PetCare</h1>
          </Link>
          <div className="nav-links">
            <span className="nav-user">👤 {user.nombre}</span>
            <span className="nav-role">{user.rol}</span>
            <button onClick={handleLogout} className="btn-secondary">Cerrar sesión</button>
          </div>
        </div>
      </nav>
      {esProfesionalNoAprobado ? (
        <SolicitudPendientePage user={user} />
      ) : (
        <Outlet context={{ user }} />
      )}
    </div>
  )
}

export default Dashboard