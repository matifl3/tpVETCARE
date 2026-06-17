import { useLocation, Link } from 'react-router-dom'

function CompraExitosaPage() {
  const location = useLocation()
  const carrito = location.state?.carrito

  return (
    <div className="dashboard" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>✅</div>
      <h1>¡Gracias por tu compra!</h1>
      <p style={{ color: '#777', marginBottom: 32 }}>Tu compra se realizó con éxito.</p>

      {carrito && (
        <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 12, textAlign: 'left', maxWidth: 500, margin: '0 auto 32px' }}>
          <h3 style={{ marginBottom: 16 }}>Resumen de compra</h3>
          <p><strong>Compra #{carrito.id}</strong></p>
          <p>Estado: {carrito.estado}</p>
          <p>Fecha: {carrito.fechaCreacion}</p>
          {carrito.metodoPago && <p>Método de pago: {carrito.metodoPago}</p>}
          <p style={{ fontSize: 20, fontWeight: 700, color: '#667eea', marginTop: 12 }}>Total: ${carrito.total?.toFixed(2)}</p>

          {carrito.turnos?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Turnos reservados</h4>
              {carrito.turnos.map((t) => (
                <div key={t.id} style={{ background: '#f0f0ff', padding: 12, borderRadius: 8, marginTop: 8 }}>
                  <p><strong>Profesional:</strong> {t.nombreProfesional}</p>
                  <p><strong>Mascota:</strong> {t.nombreMascota}</p>
                  <p><strong>Fecha:</strong> {t.fecha}</p>
                  {t.horas > 1 && <p><strong>Horas:</strong> {t.horas}</p>}
                  <p><strong>Precio:</strong> ${t.precio?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {carrito.items?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Productos</h4>
              {carrito.items.map((item) => (
                <p key={item.id} style={{ fontSize: 14 }}>{item.productoNombre} × {item.cantidad} — ${item.subtotal?.toFixed(2)}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link to="/dashboard" className="btn-primary">Volver al Dashboard</Link>
        <Link to="/dashboard/mis-turnos" className="btn-secondary">Ver mis turnos</Link>
      </div>
    </div>
  )
}

export default CompraExitosaPage