import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '',
    rol: 'CLIENTE', matricula: '', experiencia: '',
  })
  const [mostrarProfesional, setMostrarProfesional] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.auth.login(loginForm.email, loginForm.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = { ...regForm }
      if (data.rol === 'CLIENTE') {
        delete data.matricula
        delete data.experiencia
      }
      const json = await api.auth.registro(data)
      setSuccess(json.mensaje || 'Registro exitoso')
      setRegForm({ nombre: '', apellido: '', email: '', telefono: '', password: '', rol: 'CLIENTE', matricula: '', experiencia: '' })
      setMostrarProfesional(false)
      setTimeout(() => setTab('login'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">🐾</span>
            <h1>PetCare</h1>
          </Link>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🐾</span>
              <h1>PetCare</h1>
            </div>
            <p className="subtitulo">Accedé a tu cuenta o registrate</p>
          </div>

          {error && <div className="alert alert-error show">{error}</div>}
          {success && <div className="alert alert-success show">{success}</div>}

          <div className="tab-buttons">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); setSuccess('') }}>Iniciar Sesión</button>
            <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); setSuccess('') }}>Registrarse</button>
          </div>

          {tab === 'login' && (
            <div className="form-container active">
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="tu@correo.com" required value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <input type="password" placeholder="••••••••" required value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
                <p className="form-footer">
                  ¿No tenés cuenta?{' '}
                  <span className="link" onClick={() => setTab('register')}>Registrate</span>
                </p>
              </form>
            </div>
          )}

          {tab === 'register' && (
            <div className="form-container active">
              <form onSubmit={handleRegistro}>
                <div className="input-group">
                  <label>Nombre</label>
                  <input type="text" placeholder="Juan" required value={regForm.nombre}
                    onChange={(e) => setRegForm({ ...regForm, nombre: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Apellido</label>
                  <input type="text" placeholder="Pérez" required value={regForm.apellido}
                    onChange={(e) => setRegForm({ ...regForm, apellido: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="tu@correo.com" required value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Teléfono</label>
                  <input type="tel" placeholder="11 1234-5678" required value={regForm.telefono}
                    onChange={(e) => setRegForm({ ...regForm, telefono: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" minLength={6} required value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
                </div>

                <p className="form-footer">
                  Te estás registrando como <strong>Cliente</strong>.{' '}
                  <span className="link" onClick={() => setMostrarProfesional(!mostrarProfesional)}>
                    {mostrarProfesional ? 'Soy cliente' : '¿Sos profesional?'}
                  </span>
                </p>

                {mostrarProfesional && (
                  <div>
                    <div className="role-selector">
                      <label className="role-label">Rol profesional</label>
                      <div className="role-options">
                        {['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'].map((r) => (
                          <label key={r} className="role-card">
                            <input type="radio" name="rolProfesional" value={r} checked={regForm.rol === r}
                              onChange={() => setRegForm({ ...regForm, rol: r })} />
                            <div className="role-content">
                              <span className="role-text">{r.charAt(0) + r.slice(1).toLowerCase()}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Matrícula / N° de registro</label>
                      <input type="text" placeholder="Ingresá tu matrícula" value={regForm.matricula}
                        onChange={(e) => setRegForm({ ...regForm, matricula: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label>Experiencia</label>
                      <input type="text" placeholder="Ej: 3 años como veterinario" value={regForm.experiencia}
                        onChange={(e) => setRegForm({ ...regForm, experiencia: e.target.value })} />
                    </div>
                    <div className="register-note">
                      💡 <strong>Importante:</strong> Un administrador revisará y aprobará tu solicitud antes de que puedas operar.
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
                <p className="form-footer">
                  ¿Ya tenés cuenta?{' '}
                  <span className="link" onClick={() => setTab('login')}>Iniciar sesión</span>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
