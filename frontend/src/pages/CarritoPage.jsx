import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function CarritoPage() {
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState(null)
  const [historial, setHistorial] = useState([])
  const [tarjetas, setTarjetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pestaña, setPestaña] = useState('carrito')
  const [comprando, setComprando] = useState(false)

  const [metodoPago, setMetodoPago] = useState('TARJETA')
  const [idTarjetaGuardada, setIdTarjetaGuardada] = useState('')
  const [mostrarNuevaTarjeta, setMostrarNuevaTarjeta] = useState(false)
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    titular: '', numeroTarjeta: '', vencimiento: '', cvv: '',
  })

  const cargarDatos = () => {
    setLoading(true)
    Promise.all([
      api.carrito.obtener(),
      api.carrito.historial(),
      api.tarjetas.listar(),
    ])
      .then(([cart, hist, cards]) => {
        setCarrito(cart)
        setHistorial(hist)
        setTarjetas(cards)
        if (cards.length > 0) setIdTarjetaGuardada(cards[0].idTarjeta)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargarDatos() }, [])

  const handleModificar = async (idProducto, cantidad) => {
    try {
      const nuevo = await api.carrito.modificar(idProducto, cantidad)
      setCarrito(nuevo)
    } catch (err) { setError(err.message) }
  }

  const handleEliminar = async (idProducto) => {
    try {
      const nuevo = await api.carrito.eliminar(idProducto)
      setCarrito(nuevo)
    } catch (err) { setError(err.message) }
  }

  const handleAgregarTarjeta = async () => {
    try {
      await api.tarjetas.agregar(nuevaTarjeta)
      const cards = await api.tarjetas.listar()
      setTarjetas(cards)
      if (cards.length > 0) setIdTarjetaGuardada(cards[cards.length - 1].idTarjeta)
      setMostrarNuevaTarjeta(false)
      setNuevaTarjeta({ titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' })
    } catch (err) { setError(err.message) }
  }

  const handleComprar = async () => {
    setError('')
    setSuccess('')
    setComprando(true)
    try {
      const body = { metodoPago: 'TARJETA' }
      if (idTarjetaGuardada) {
        body.idTarjetaGuardada = Number(idTarjetaGuardada)
      } else if (mostrarNuevaTarjeta) {
        body.tarjetaNueva = nuevaTarjeta
      }
      const resultado = await api.carrito.comprar(body)
      setSuccess('Compra realizada con éxito')
      setCarrito(resultado)
      cargarDatos()
      setTimeout(() => navigate('/dashboard/compra-exitosa', { state: { carrito: resultado } }), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setComprando(false)
    }
  }

  if (loading) return <div className="dashboard"><p>Cargando...</p></div>

  const hayItems = carrito && (carrito.items?.length > 0 || carrito.turnos?.length > 0)

  return (
    <div className="dashboard">
      <h1>Carrito</h1>

      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">{success}</div>}

      <div className="tab-buttons" style={{ marginTop: 16 }}>
        <button className={`tab-btn ${pestaña === 'carrito' ? 'active' : ''}`} onClick={() => setPestaña('carrito')}>
          Carrito Actual
        </button>
        <button className={`tab-btn ${pestaña === 'historial' ? 'active' : ''}`} onClick={() => setPestaña('historial')}>
          Historial
        </button>
      </div>

      {pestaña === 'carrito' && (
        <div>
          {!hayItems ? (
            <p style={{ color: '#777', marginTop: 24 }}>Tu carrito está vacío.</p>
          ) : (
            <div style={{ marginTop: 24 }}>
              {carrito.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #e0e0e0' }}>
                  <div>
                    <strong>{item.productoNombre}</strong>
                    <p style={{ fontSize: 13, color: '#777' }}>${item.precioUnitario?.toFixed(2)} c/u</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '4px 12px' }} onClick={() => handleModificar(item.idProducto, item.cantidad - 1)}>−</button>
                    <span>{item.cantidad}</span>
                    <button className="btn-secondary" style={{ padding: '4px 12px' }} onClick={() => handleModificar(item.idProducto, item.cantidad + 1)}>+</button>
                    <button className="btn-secondary" style={{ padding: '4px 12px', color: '#d32f2f', borderColor: '#d32f2f' }} onClick={() => handleEliminar(item.idProducto)}>✕</button>
                  </div>
                  <strong>${item.subtotal?.toFixed(2)}</strong>
                </div>
              ))}

              {carrito.turnos?.map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #e0e0e0', background: '#f0f0ff' }}>
                  <div>
                    <strong>🗓️ Turno: {t.nombreProfesional}</strong>
                    <p style={{ fontSize: 13, color: '#777' }}>{t.nombreMascota} — {t.fecha} {t.horas > 1 ? `(${t.horas} hs)` : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '4px 12px', color: '#d32f2f', borderColor: '#d32f2f' }}
                      onClick={async () => {
                        try {
                          const c = await api.carrito.eliminarTurno(t.id)
                          setCarrito(c)
                        } catch (err) { setError(err.message) }
                      }}
                    >✕</button>
                  </div>
                  <strong>${t.precio?.toFixed(2)}</strong>
                </div>
              ))}

              <div style={{ textAlign: 'right', marginTop: 24, padding: 24, background: '#f8f9fa', borderRadius: 12 }}>
                <h2 style={{ marginBottom: 16 }}>Total: ${carrito.total?.toFixed(2)}</h2>

                <div style={{ textAlign: 'left', marginBottom: 16 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>Método de pago</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '2px solid #667eea', borderRadius: 8, cursor: 'pointer' }}>
                      <input type="radio" checked={metodoPago === 'TARJETA'} onChange={() => setMetodoPago('TARJETA')} />
                      💳 Tarjeta
                    </label>
                  </div>
                </div>

                {metodoPago === 'TARJETA' && (
                  <div style={{ textAlign: 'left', marginBottom: 16 }}>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>Seleccionar tarjeta</p>

                    {tarjetas.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                        {tarjetas.map((t) => (
                          <label key={t.idTarjeta} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: `2px solid ${idTarjetaGuardada == t.idTarjeta ? '#667eea' : '#e0e0e0'}`, borderRadius: 10, cursor: 'pointer' }}>
                            <input type="radio" name="tarjeta" checked={idTarjetaGuardada == t.idTarjeta} onChange={() => { setIdTarjetaGuardada(t.idTarjeta); setMostrarNuevaTarjeta(false) }} />
                            <span>💳</span>
                            <div>
                              <strong>{t.titular}</strong>
                              <p style={{ fontSize: 13, color: '#777' }}>•••• {t.ultimosDigitos} — Vence: {t.vencimiento}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    <button className="btn-secondary" onClick={() => { setMostrarNuevaTarjeta(!mostrarNuevaTarjeta); setIdTarjetaGuardada('') }} style={{ marginBottom: 12 }}>
                      {mostrarNuevaTarjeta ? 'Cancelar' : '+ Usar otra tarjeta'}
                    </button>

                    {mostrarNuevaTarjeta && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 16, background: 'white', borderRadius: 10 }}>
                        <div className="input-group">
                          <label>Titular</label>
                          <input value={nuevaTarjeta.titular} onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, titular: e.target.value })} />
                        </div>
                        <div className="input-group">
                          <label>Número</label>
                          <input value={nuevaTarjeta.numeroTarjeta} onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, numeroTarjeta: e.target.value })} maxLength={19} />
                        </div>
                        <div className="input-group">
                          <label>Vencimiento (MM/AA)</label>
                          <input value={nuevaTarjeta.vencimiento} onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, vencimiento: e.target.value })} placeholder="12/28" maxLength={5} />
                        </div>
                        <div className="input-group">
                          <label>CVV</label>
                          <input value={nuevaTarjeta.cvv} onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })} placeholder="123" maxLength={4} />
                        </div>
                      </div>
                    )}

                    <button className="btn-primary" style={{ marginTop: 16, width: '100%' }}
                      disabled={comprando || (!idTarjetaGuardada && !mostrarNuevaTarjeta)}
                      onClick={handleComprar}
                    >
                      {comprando ? 'Procesando...' : `Pagar $${carrito.total?.toFixed(2)} con tarjeta`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {pestaña === 'historial' && (
        <div style={{ marginTop: 24 }}>
          {historial.length === 0 ? (
            <p style={{ color: '#777' }}>No hay compras anteriores.</p>
          ) : (
            historial.map((c) => (
              <div key={c.id} style={{ padding: 16, borderBottom: '1px solid #e0e0e0' }}>
                <p><strong>Compra #{c.id}</strong> — {c.estado} — ${c.total?.toFixed(2)}</p>
                <p style={{ fontSize: 13, color: '#777' }}>{c.fechaCreacion}</p>
                {c.metodoPago && <p style={{ fontSize: 13, color: '#777' }}>Método: {c.metodoPago}</p>}
                {c.turnos?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {c.turnos.map((t) => (
                      <p key={t.id} style={{ fontSize: 13, color: '#555' }}>🗓️ Turno: {t.nombreProfesional} — {t.fecha}</p>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default CarritoPage