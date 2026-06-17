import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function TarjetasPage() {
  const [tarjetas, setTarjetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' })

  const cargarTarjetas = () => {
    api.tarjetas.listar()
      .then(setTarjetas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargarTarjetas() }, [])

  const handleAgregar = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.tarjetas.agregar(form)
      setSuccess('Tarjeta agregada correctamente')
      setMostrarForm(false)
      setForm({ titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' })
      cargarTarjetas()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta tarjeta?')) return
    try {
      await api.tarjetas.eliminar(id)
      cargarTarjetas()
    } catch (err) {
      setError(err.message)
    }
  }

  const enmascarar = (num) => {
    const s = num?.toString() || ''
    return '•••• ' + s.slice(-4)
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Métodos de Pago</h1>
        <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Tarjeta'}
        </button>
      </div>

      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      {mostrarForm && (
        <form onSubmit={handleAgregar} style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Titular</label>
              <input required value={form.titular} onChange={(e) => setForm({ ...form, titular: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Número de tarjeta</label>
              <input required value={form.numeroTarjeta} onChange={(e) => setForm({ ...form, numeroTarjeta: e.target.value })} placeholder="1234567890123456" maxLength={19} />
            </div>
            <div className="input-group">
              <label>Vencimiento (MM/AA)</label>
              <input required value={form.vencimiento} onChange={(e) => setForm({ ...form, vencimiento: e.target.value })} placeholder="12/28" maxLength={5} />
            </div>
            <div className="input-group">
              <label>CVV</label>
              <input required value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} placeholder="123" maxLength={4} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Guardar Tarjeta</button>
        </form>
      )}

      {tarjetas.length === 0 ? (
        <p style={{ color: '#777' }}>No tenés tarjetas registradas.</p>
      ) : (
        <div className="card-grid">
          {tarjetas.map((t) => (
            <div key={t.id} className="dash-card" style={{ position: 'relative' }}>
              <span className="dash-icon">💳</span>
              <h3>{t.titular}</h3>
              <p>{enmascarar(t.numeroTarjeta)}</p>
              <p style={{ fontSize: 13, color: '#777' }}>Vence: {t.vencimiento}</p>
              <button
                onClick={() => handleEliminar(t.id)}
                style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#d32f2f' }}
                title="Eliminar"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default TarjetasPage