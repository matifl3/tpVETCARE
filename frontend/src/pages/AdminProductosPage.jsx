import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminProductosPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', activo: true })

  const cargar = () => {
    setLoading(true)
    api.productos.listar()
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) }
      if (editId) {
        await api.productos.actualizar(editId, body)
        setSuccess('Producto actualizado')
      } else {
        await api.productos.crear(body)
        setSuccess('Producto creado')
      }
      setEditId(null)
      setForm({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', activo: true })
      cargar()
    } catch (err) { setError(err.message) }
  }

  const editar = (p) => {
    setEditId(p.id)
    setForm({ nombre: p.nombre, descripcion: p.descripcion || '', categoria: p.categoria, precio: String(p.precio), stock: String(p.stock), activo: p.activo })
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return
    try {
      await api.productos.eliminar(id)
      setSuccess('Producto eliminado')
      cargar()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Productos</h1>
        <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver al Dashboard</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Nombre</label>
            <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Descripción</label>
            <input required value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Categoría</label>
            <input required value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Precio</label>
              <input type="number" step="0.01" required value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Stock</label>
              <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn-primary">
            {editId ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {editId && (
            <button type="button" className="btn-secondary"
              onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', activo: true }) }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion || '—'}</td>
                <td>{p.categoria}</td>
                <td>${p.precio?.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.activo ? '✅' : '❌'}</td>
                <td>
                  <div className="actions">
                    <button className="btn-secondary btn-sm" onClick={() => editar(p)}>Editar</button>
                    <button className="btn-secondary btn-sm"
                      style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                      onClick={() => eliminar(p.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductosPage