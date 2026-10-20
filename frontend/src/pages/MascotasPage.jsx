import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import api from '../services/api'

function MascotasPage() {
  const { user } = useOutletContext()
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState({
    nombre: '', especie: 'PERRO', raza: '', sexo: '', peso: '', fechaNacimiento: '',
  })

  const cargarMascotas = () => {
    setLoading(true)
    api.mascotas.misMascotas()
      .then(setMascotas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargarMascotas() }, [])

  const resetForm = () => {
    setForm({ nombre: '', especie: 'PERRO', raza: '', sexo: '', peso: '', fechaNacimiento: '' })
    setEditandoId(null)
    setMostrarForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = {
        ...form,
        peso: form.peso ? parseFloat(form.peso) : null,
        fechaNacimiento: form.fechaNacimiento || null,
      }
      if (editandoId) {
        await api.mascotas.actualizarMia(editandoId, data)
      } else {
        await api.mascotas.crear(data)
      }
      resetForm()
      cargarMascotas()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditar = (m) => {
    setForm({
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza || '',
      sexo: m.sexo || '',
      peso: m.peso ? String(m.peso) : '',
      fechaNacimiento: m.fechaNacimiento || '',
    })
    setEditandoId(m.idMascota)
    setMostrarForm(true)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta mascota?')) return
    try {
      await api.mascotas.eliminarMia(id)
      cargarMascotas()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Mis Mascotas</h1>
        <button className="btn-primary" onClick={() => mostrarForm ? resetForm() : setMostrarForm(true)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Mascota'}
        </button>
      </div>

      {error && <div className="alert alert-error show">{error}</div>}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, marginBottom: 32 }}>
          <h3 style={{ marginTop: 0 }}>{editandoId ? 'Editar Mascota' : 'Nueva Mascota'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Nombre</label>
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Especie</label>
              <select className="input-group" value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}>
                <option value="PERRO">Perro</option>
                <option value="GATO">Gato</option>
                <option value="AVE">Ave</option>
                <option value="PEZ">Pez</option>
                <option value="ROEDOR">Roedor</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="input-group">
              <label>Raza</label>
              <input value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Sexo</label>
              <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}>
                <option value="">Seleccionar</option>
                <option value="MACHO">Macho</option>
                <option value="HEMBRA">Hembra</option>
              </select>
            </div>
            <div className="input-group">
              <label>Peso (kg)</label>
              <input type="number" step="0.1" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Fecha de nacimiento</label>
              <input type="date" value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>
            {editandoId ? 'Guardar Cambios' : 'Guardar Mascota'}
          </button>
        </form>
      )}

      {mascotas.length === 0 ? (
        <p style={{ color: '#777' }}>No tenés mascotas registradas. ¡Agregá una!</p>
      ) : (
        <div className="card-grid">
          {mascotas.map((m) => (
            <div key={m.idMascota} className="dash-card" style={{ position: 'relative' }}>
              <span className="dash-icon">🐾</span>
              <h3>{m.nombre}</h3>
              <p><strong>Especie:</strong> {m.especie}</p>
              {m.raza && <p><strong>Raza:</strong> {m.raza}</p>}
              {m.sexo && <p><strong>Sexo:</strong> {m.sexo === 'MACHO' ? 'Macho' : 'Hembra'}</p>}
              {m.peso > 0 && <p><strong>Peso:</strong> {m.peso} kg</p>}
              {m.fechaNacimiento && <p><strong>Nacimiento:</strong> {m.fechaNacimiento}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => handleEditar(m)}
                  className="btn-sm"
                  style={{ flex: 1 }}
                >Editar</button>
                <button
                  onClick={() => handleEliminar(m.idMascota)}
                  className="btn-sm"
                  style={{ flex: 1, background: '#d32f2f', color: '#fff' }}
                >Eliminar</button>
                <Link to={`/dashboard/mascotas/${m.idMascota}/seguimiento`}
                  className="btn-sm"
                  style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#667eea', color: '#fff' }}>
                  Seguimiento
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default MascotasPage