import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import api from '../../services/api'
import { cargarGoogleMaps } from '../../services/googleMaps'

function MisPaseosPage() {
  const { user } = useOutletContext()
  const [paseos, setPaseos] = useState([])
  const [turnosPendientes, setTurnosPendientes] = useState([])
  const [paseoActivo, setPaseoActivo] = useState(null)
  const [iniciando, setIniciando] = useState(null)
  const [maps, setMaps] = useState(null)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)
  const watchIdRef = useRef(null)

  useEffect(() => {
    cargarGoogleMaps().then(setMaps).catch(console.error)
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const [paseosData, turnosData] = await Promise.all([
        api.paseos.misPaseosActivos(),
        api.turnos.pendientesPaseador(),
      ])
      setPaseos(paseosData)
      setTurnosPendientes(turnosData)
    } catch (e) {
      console.error('Error al cargar datos:', e)
    }
  }

  useEffect(() => {
    if (maps && paseoActivo && mapRef.current) {
      const map = new maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat: -34.6037, lng: -58.3816 },
      })
      mapInstance.current = map
      markerRef.current = new maps.Marker({ map, title: 'Mi ubicación' })
    }
  }, [maps, paseoActivo])

  async function iniciarPaseoDesdeTurno(turno) {
    setIniciando(turno.id)
    try {
      const data = await api.paseos.iniciarDesdeTurno(turno.id)
      setPaseoActivo(data)
      setTurnosPendientes((prev) => prev.filter((t) => t.id !== turno.id))
      iniciarGeolocalizacion(data.idPaseo)
    } catch (e) {
      console.error('Error al iniciar paseo:', e)
    } finally {
      setIniciando(null)
    }
  }

  function iniciarGeolocalizacion(idPaseo) {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada')
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        if (markerRef.current && mapInstance.current) {
          const pos = { lat: latitude, lng: longitude }
          markerRef.current.setPosition(pos)
          mapInstance.current.setCenter(pos)
        }

        try {
          await api.paseos.enviarUbicacion(idPaseo, {
            latitud: latitude,
            longitud: longitude,
          })
        } catch (e) {
          console.error('Error al enviar ubicación:', e)
        }
      },
      (error) => console.error('Error GPS:', error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }

  async function finalizarPaseo() {
    if (!paseoActivo) return

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    try {
      await api.paseos.finalizar(paseoActivo.idPaseo)
      setPaseoActivo(null)
      cargarDatos()
    } catch (e) {
      console.error('Error al finalizar paseo:', e)
    }
  }

  const tieneActivos = paseos.length > 0
  const tienePendientes = turnosPendientes.length > 0

  return (
    <div className="dashboard">
      <h1>Mis Paseos</h1>

      {paseoActivo ? (
        <div className="paseo-activo">
          <div className="paseo-info">
            <h2>Paseo en curso</h2>
            <p>Mascota: {paseoActivo.nombreMascota}</p>
            <p>Cliente: {paseoActivo.nombreCliente}</p>
            <p>Iniciado: {new Date(paseoActivo.fechaInicio).toLocaleTimeString()}</p>
          </div>
          <div ref={mapRef} className="mapa-container" style={{ height: '400px', width: '100%', marginBottom: '1rem' }} />
          <button onClick={finalizarPaseo} className="btn-primary" style={{ background: '#e74c3c' }}>
            Finalizar Paseo
          </button>
        </div>
      ) : (
        <div>
          {tienePendientes && (
            <section style={{ marginBottom: '2rem' }}>
              <h2>Turnos Pendientes</h2>
              <p className="text-muted">Turnos de paseo reservados por clientes. Inicialos para comenzar el seguimiento GPS.</p>
              <div className="card-grid">
                {turnosPendientes.map((t) => (
                  <div key={t.id} className="dash-card">
                    <h3>{t.nombreMascota}</h3>
                    <p>Cliente: {t.nombreCliente}</p>
                    <p>Fecha: {new Date(t.fecha + 'T00:00:00').toLocaleDateString()}</p>
                    <p>Horas: {t.horas}</p>
                    <button
                      onClick={() => iniciarPaseoDesdeTurno(t)}
                      className="btn-primary"
                      disabled={iniciando === t.id}
                    >
                      {iniciando === t.id ? 'Iniciando...' : 'Iniciar Paseo'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tieneActivos && (
            <section style={{ marginBottom: '2rem' }}>
              <h2>Paseos en Curso</h2>
              <div className="card-grid">
                {paseos.map((p) => (
                  <div key={p.idPaseo} className="dash-card">
                    <h3>{p.nombreMascota}</h3>
                    <p>Cliente: {p.nombreCliente}</p>
                    <p>Inicio: {new Date(p.fechaInicio).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!tienePendientes && !tieneActivos && (
            <p className="text-muted">No tenés turnos de paseo pendientes ni paseos activos. Esperá a que un cliente reserve un turno de paseo.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default MisPaseosPage
