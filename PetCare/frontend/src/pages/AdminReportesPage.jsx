import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function AdminReportesPage() {
  const [tipo, setTipo] = useState('ganancias')
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const consultar = async () => {
    setError('')
    setLoading(true)
    setData(null)
    try {
      let res
      if (tipo === 'ganancias') {
        res = await api.reportes.ganancias(anio, mes)
      } else if (tipo === 'ventas') {
        res = await api.reportes.ventas(fechaInicio, fechaFin)
      } else {
        res = await api.reportes.productosMasVendidos(anio, mes)
      }
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Reportes</h1>
        <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>← Volver al Dashboard</Link>
      </div>
      {error && <div className="alert alert-error show">{error}</div>}

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button className={`tab-btn ${tipo === 'ganancias' ? 'active' : ''}`} onClick={() => setTipo('ganancias')}>Ganancias</button>
          <button className={`tab-btn ${tipo === 'ventas' ? 'active' : ''}`} onClick={() => setTipo('ventas')}>Ventas</button>
          <button className={`tab-btn ${tipo === 'productos' ? 'active' : ''}`} onClick={() => setTipo('productos')}>Productos más vendidos</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          {(tipo === 'ganancias' || tipo === 'productos') && (
            <>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Año</label>
                <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} style={{ width: 100 }} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Mes</label>
                <select value={mes} onChange={(e) => setMes(Number(e.target.value))}
                  style={{ padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'white' }}>
                  {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
              </div>
            </>
          )}
          {tipo === 'ventas' && (
            <>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Fecha inicio</label>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Fecha fin</label>
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              </div>
            </>
          )}
          <button className="btn-primary" onClick={consultar} disabled={loading}>
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </div>

      {data && (
        <div className="admin-card">
          {tipo === 'ganancias' && (
            <div>
              <h3 style={{ marginBottom: 16 }}>Ganancias — {MESES[mes - 1]} {anio}</h3>
              <p style={{ marginBottom: 8 }}><strong>Cantidad de ventas:</strong> {data.cantidadVentas || 0}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#667eea' }}>${(data.gananciaTotal || 0).toFixed(2)}</p>
            </div>
          )}
          {tipo === 'ventas' && (
            <div>
              <h3 style={{ marginBottom: 16 }}>Ventas del {fechaInicio} al {fechaFin}</h3>
              {Array.isArray(data) && data.length === 0 && <p style={{ color: '#777', padding: 16, textAlign: 'center' }}>No hay ventas en ese período.</p>}
              {Array.isArray(data) && data.length > 0 && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.idUsuario || '—'}</td>
                        <td>${c.total?.toFixed(2)}</td>
                        <td>{c.estado}</td>
                        <td>{c.fechaCreacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {tipo === 'productos' && (
            <div>
              <h3 style={{ marginBottom: 16 }}>Productos más vendidos — {MESES[mes - 1]} {anio}</h3>
              {Array.isArray(data) && data.length === 0 && <p style={{ color: '#777', padding: 16, textAlign: 'center' }}>No hay datos para ese período.</p>}
              {Array.isArray(data) && data.length > 0 && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Cantidad vendida</th>
                      <th>Ganancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((p, i) => (
                      <tr key={i}>
                        <td>{p.nombreProducto}</td>
                        <td>{p.categoria}</td>
                        <td>{p.cantidadVendida || 0}</td>
                        <td>${(p.gananciaTotal || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminReportesPage