import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminProductosPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ nombre: '', categoria: '', precio: '', stock: '', activo: true })

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
      setForm({ nombre: '', categoria: '', precio: '', stock: '', activo: true })
      cargar()
    } catch (err) { setError(err.message) }
  }

  const editar = (p) => {
    setEditId(p.id)
    setForm({ nombre: p.nombre, categoria: p.categoria, precio: String(p.precio), stock: String(p.stock), activo: p.activo })
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
      <h1>Productos</h1>
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, marginBottom: 32, marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <div className="input-group">
            <label>Nombre</label>
            <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Categoría</label>
            <input required value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Precio</label>
            <input type="number" step="0.01" required value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Stock</label>
            <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: 12 }}>
          {editId ? 'Guardar cambios' : 'Crear producto'}
        </button>
        {editId && <button type="button" className="btn-secondary" style={{ marginLeft: 8 }} onClick={() => { setEditId(null); setForm({ nombre: '', categoria: '', precio: '', stock: '', activo: true }) }}>Cancelar</button>}
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
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
                <td>{p.categoria}</td>
                <td>${p.precio?.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.activo ? '✅' : '❌'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 13 }} onClick={() => editar(p)}>Editar</button>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 13, color: '#d32f2f', borderColor: '#d32f2f' }} onClick={() => eliminar(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default AdminProductosPage