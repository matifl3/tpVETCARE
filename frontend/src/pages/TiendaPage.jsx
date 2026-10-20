import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function TiendaPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categoria, setCategoria] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const CATEGORIAS = ['ALIMENTO', 'JUGUETE', 'HIGIENE', 'ACCESORIO', 'SALUD', 'ROPA', 'CAMA', 'TRANSPORTE']

  const cargar = (cat, busq) => {
    setLoading(true)
    let promesa
    if (busq) {
      promesa = api.productos.buscarPorNombre(busq)
    } else if (cat) {
      promesa = api.productos.porCategoria(cat)
    } else {
      promesa = api.productos.listar()
    }
    promesa
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const handleBuscar = (e) => {
    e.preventDefault()
    cargar(categoria, busqueda)
  }

  const handleAgregarCarrito = async (id) => {
    setError('')
    setSuccess('')
    try {
      await api.carrito.agregar(id, 1)
      setSuccess('Producto agregado al carrito')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  return (
    <div className="dashboard">
      <h1>Tienda</h1>
      <p style={{ marginBottom: 24 }}>Productos para tu mascota.</p>

      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <form onSubmit={handleBuscar} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}
        />
        <button type="submit" className="btn-primary">Buscar</button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className={`btn-${categoria === '' && busqueda === '' ? 'primary' : 'secondary'}`} onClick={() => { setCategoria(''); setBusqueda(''); cargar() }}>
          Todas
        </button>
        {CATEGORIAS.map((c) => (
          <button key={c} className={`btn-${categoria === c ? 'primary' : 'secondary'}`} onClick={() => { setCategoria(c); setBusqueda(''); cargar(c, '') }}>
            {c.charAt(0) + c.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {productos.length === 0 ? (
        <p style={{ color: '#777' }}>No se encontraron productos.</p>
      ) : (
        <div className="card-grid">
          {productos.filter((p) => p.activo !== false).map((p) => (
            <div key={p.id} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="dash-icon">📦</span>
                <h3>{p.nombre}</h3>
                <p>{p.descripcion}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#667eea', marginTop: 8 }}>${p.precio?.toFixed(2)}</p>
                <p style={{ fontSize: 13, color: p.stock > 0 ? '#388e3c' : '#d32f2f' }}>
                  {p.stock > 0 ? `${p.stock} en stock` : 'Sin stock'}
                </p>
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: 12, width: '100%' }}
                disabled={p.stock <= 0}
                onClick={() => handleAgregarCarrito(p.id)}
              >
                {p.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </button>
            </div>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default TiendaPage