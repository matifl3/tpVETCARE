import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import api from '../services/api'

const ROLES_CON_HORAS = ['PASEADOR', 'CUIDADOR']

function ReservarTurnoPage() {
  const { idProfesional } = useParams()
  const navigate = useNavigate()
  const { user } = useOutletContext()

  const [profesional, setProfesional] = useState(null)
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [fecha, setFecha] = useState('')
  const [horas, setHoras] = useState(1)
  const [idMascota, setIdMascota] = useState('')
  const [disponible, setDisponible] = useState(null)

  useEffect(() => {
    Promise.all([
      api.profesionales.buscarPorId(Number(idProfesional)),
      api.mascotas.misMascotas(),
    ])
      .then(([prof, masc]) => {
        setProfesional(prof)
        setMascotas(masc)
        if (masc.length > 0) setIdMascota(masc[0].idMascota)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [idProfesional])

  useEffect(() => {
    if (!fecha) { setDisponible(null); return }
    const timer = setTimeout(() => {
      api.turnos.disponibilidad(idProfesional, fecha)
        .then((res) => setDisponible(res.disponible))
        .catch(() => setDisponible(false))
    }, 500)
    return () => clearTimeout(timer)
  }, [fecha, idProfesional])

  const precioBase = profesional?.precioBase || 0
  const precioHora = profesional?.precioHora || 0
  const total = precioBase + (precioHora * (Math.max(horas, 1) - 1))
  const permiteHoras = ROLES_CON_HORAS.includes(profesional?.rol)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!disponible) return
    setError('')
    setSuccess('')
    setEnviando(true)
    try {
      await api.carrito.agregarTurno({
        idProfesional: Number(idProfesional),
        idMascota: Number(idMascota),
        fecha,
        horas: permiteHoras ? Number(horas) : 1,
        precio: total,
      })
      setSuccess('Turno agregado al carrito')
      setTimeout(() => navigate('/dashboard/carrito'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Reservar turno</h1>

      {profesional && (
        <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 40 }}>👨‍⚕️</span>
          <div>
            <h3>{profesional.nombre} {profesional.apellido}</h3>
            <p style={{ color: '#777' }}>{profesional.rol?.charAt(0) + profesional.rol?.slice(1).toLowerCase()}</p>
            {profesional.experiencia && <p style={{ color: '#777', fontSize: 13 }}>{profesional.experiencia}</p>}
          </div>
        </div>
      )}

      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="input-group">
          <label>Mascota</label>
          <select
            value={idMascota}
            onChange={(e) => setIdMascota(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}
          >
            <option value="">Seleccionar mascota</option>
            {mascotas.map((m) => (
              <option key={m.idMascota} value={m.idMascota}>{m.nombre} ({m.especie})</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Fecha del turno</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {fecha && (
          <div style={{ marginBottom: 16 }}>
            {disponible === null ? (
              <p style={{ color: '#777' }}>Verificando disponibilidad...</p>
            ) : disponible ? (
              <p style={{ color: '#388e3c', fontWeight: 600 }}>✓ Profesional disponible en esa fecha</p>
            ) : (
              <p style={{ color: '#d32f2f', fontWeight: 600 }}>✕ El profesional no está disponible en esa fecha</p>
            )}
          </div>
        )}

        {permiteHoras && (
          <div className="input-group">
            <label>Horas de servicio</label>
            <input
              type="number"
              min={1}
              max={8}
              value={horas}
              onChange={(e) => setHoras(parseInt(e.target.value) || 1)}
            />
            <p style={{ fontSize: 13, color: '#777', marginTop: 4 }}>Cargo adicional por hora extra: ${precioHora?.toFixed(2)}</p>
          </div>
        )}

        <div style={{ background: '#f0f0ff', padding: 16, borderRadius: 12, marginBottom: 24 }}>
          <h3>Resumen del turno</h3>
          {permiteHoras && <p>Precio base: ${precioBase?.toFixed(2)}</p>}
          {permiteHoras && horas > 1 && (
            <p>Horas extra: {horas - 1} × ${precioHora?.toFixed(2)} = ${(precioHora * (horas - 1))?.toFixed(2)}</p>
          )}
          <p style={{ fontSize: 20, fontWeight: 700, color: '#667eea', marginTop: 8 }}>Total: ${total?.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={enviando || !disponible || !fecha || !idMascota}
        >
          {enviando ? 'Agregando...' : 'Agregar al carrito'}
        </button>
      </form>

      <Link to="/dashboard/profesionales" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver a profesionales</Link>
    </div>
  )
}

export default ReservarTurnoPage