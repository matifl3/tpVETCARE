import { useState, useEffect } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import api from '../services/api'

function SeguimientoPage() {
  const { idMascota } = useParams()
  const { user } = useOutletContext()
  const [seguimiento, setSeguimiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ descripcion: '', tecnicas: '', observaciones: '', evaluacion: '' })

  const esAdiestradorOAdmin = user?.rol === 'ADIESTRADOR' || user?.rol === 'ADMIN'

  const cargar = () => {
    setLoading(true)
    api.seguimiento.obtener(Number(idMascota))
      .then(setSeguimiento)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [idMascota])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await api.seguimiento.registrarProgreso(Number(idMascota), form)
      setSuccess('Progreso registrado correctamente')
      setForm({ descripcion: '', tecnicas: '', observaciones: '', evaluacion: '' })
      setMostrarForm(false)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Seguimiento de {seguimiento?.nombreMascota || 'Mascota'}</h1>
        <Link to={-1} className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      {esAdiestradorOAdmin && (
        <div style={{ marginBottom: 24 }}>
          <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? 'Cancelar' : '+ Registrar progreso'}
          </button>
        </div>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="admin-card" style={{ marginBottom: 24 }}>
          <h3>Nuevo registro de progreso</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Descripción</label>
              <textarea required value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', minHeight: 80, resize: 'vertical' }} />
            </div>
            <div className="input-group">
              <label>Técnicas aplicadas</label>
              <textarea required value={form.tecnicas}
                onChange={(e) => setForm({ ...form, tecnicas: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', minHeight: 80, resize: 'vertical' }} />
            </div>
            <div className="input-group">
              <label>Observaciones</label>
              <textarea value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', minHeight: 80, resize: 'vertical' }} />
            </div>
            <div className="input-group">
              <label>Evaluación</label>
              <select required value={form.evaluacion}
                onChange={(e) => setForm({ ...form, evaluacion: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}>
                <option value="">Seleccionar</option>
                <option value="EXCELENTE">Excelente</option>
                <option value="BUENO">Bueno</option>
                <option value="REGULAR">Regular</option>
                <option value="MALO">Malo</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Guardar registro</button>
        </form>
      )}

      {(!seguimiento || !seguimiento.registros || seguimiento.registros.length === 0) ? (
        <div className="admin-card">
          <p style={{ color: '#777', textAlign: 'center', padding: 32 }}>No hay registros de seguimiento para esta mascota.</p>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Profesional</th>
                <th>Descripción</th>
                <th>Técnicas</th>
                <th>Observaciones</th>
                <th>Evaluación</th>
              </tr>
            </thead>
            <tbody>
              {seguimiento.registros.map((r) => (
                <tr key={r.id}>
                  <td>{r.fecha}</td>
                  <td>{r.nombreProfesional}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.tecnicas}</td>
                  <td>{r.observaciones || '—'}</td>
                  <td><span className="nav-role">{r.evaluacion}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SeguimientoPage