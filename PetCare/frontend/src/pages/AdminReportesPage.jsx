import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
      <h1>Reportes</h1>
      {error && <div className="alert alert-error show">{error}</div>}

      <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <button className={`tab-btn ${tipo === 'ganancias' ? 'active' : ''}`} onClick={() => setTipo('ganancias')}>Ganancias</button>
          <button className={`tab-btn ${tipo === 'ventas' ? 'active' : ''}`} onClick={() => setTipo('ventas')}>Ventas</button>
          <button className={`tab-btn ${tipo === 'productos' ? 'active' : ''}`} onClick={() => setTipo('productos')}>Productos más vendidos</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          {(tipo === 'ganancias' || tipo === 'productos') && (
            <>
              <div className="input-group">
                <label>Año</label>
                <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} style={{ width: 100 }} />
              </div>
              <div className="input-group">
                <label>Mes</label>
                <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={{ width: 120, padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                    <option key={m} value={m}>{['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][m-1]}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {tipo === 'ventas' && (
            <>
              <div className="input-group">
                <label>Fecha inicio</label>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </div>
              <div className="input-group">
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
        <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, marginTop: 24 }}>
          {tipo === 'ganancias' && (
            <div>
              <h3>Ganancias — {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mes-1]} {anio}</h3>
              <p><strong>Cantidad de ventas:</strong> {data.cantidadVentas || 0}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#667eea' }}><strong>Ganancia total:</strong> ${(data.gananciaTotal || 0).toFixed(2)}</p>
            </div>
          )}
          {tipo === 'ventas' && (
            <div>
              <h3>Ventas del {fechaInicio} al {fechaFin}</h3>
              {Array.isArray(data) && data.length === 0 && <p style={{ color: '#777' }}>No hay ventas en ese período.</p>}
              {Array.isArray(data) && data.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
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
                </div>
              )}
            </div>
          )}
          {tipo === 'productos' && (
            <div>
              <h3>Productos más vendidos — {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mes-1]} {anio}</h3>
              {Array.isArray(data) && data.length === 0 && <p style={{ color: '#777' }}>No hay datos para ese período.</p>}
              {Array.isArray(data) && data.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
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
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Link to="/dashboard" className="btn-secondary" style={{ marginTop: 24, display: 'inline-block' }}>← Volver al Dashboard</Link>
    </div>
  )
}

export default AdminReportesPage