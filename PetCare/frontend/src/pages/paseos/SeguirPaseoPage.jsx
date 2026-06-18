import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import { cargarGoogleMaps } from '../../services/googleMaps'
import { conectarPaseo, desconectar } from '../../services/websocket'

function SeguirPaseoPage() {
  const { idPaseo } = useParams()
  const [paseo, setPaseo] = useState(null)
  const [estadoWs, setEstadoWs] = useState('desconectado')
  const [maps, setMaps] = useState(null)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)
  const pathRef = useRef([])
  const polylineRef = useRef(null)

  useEffect(() => {
    cargarGoogleMaps().then(setMaps).catch(console.error)

    api.get(`/api/paseos/${idPaseo}`)
      .then(setPaseo)
      .catch(console.error)

    conectarPaseo(idPaseo, manejarMensaje, setEstadoWs)

    return () => desconectar()
  }, [idPaseo])

  useEffect(() => {
    if (!maps || !paseo) return

    const map = new maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: -34.6037, lng: -58.3816 },
    })
    mapInstance.current = map

    markerRef.current = new maps.Marker({
      map,
      title: 'Paseador',
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#e74c3c',
        fillOpacity: 1,
        strokeColor: '#c0392b',
        strokeWeight: 2,
      },
    })

    polylineRef.current = new maps.Polyline({
      map,
      path: [],
      strokeColor: '#3498db',
      strokeOpacity: 0.8,
      strokeWeight: 3,
    })

    api.get(`/api/paseos/${idPaseo}/ubicacion`)
      .then((ubicaciones) => {
        if (!ubicaciones?.length || !map) return

        const puntos = ubicaciones.map((u) => ({
          lat: u.latitud,
          lng: u.longitud,
        }))

        pathRef.current = puntos
        polylineRef.current.setPath(puntos)

        const ultimo = puntos[puntos.length - 1]
        map.setCenter(ultimo)
        markerRef.current.setPosition(ultimo)
      })
      .catch(() => {})
  }, [maps, paseo])

  function manejarMensaje(datos) {
    if (datos.estadoPaseo === 'FINALIZADO') {
      setPaseo((prev) => prev ? { ...prev, estado: 'FINALIZADO' } : prev)
      desconectar()
      return
    }

    if (!datos.latitud || !datos.longitud) return

    const pos = { lat: datos.latitud, lng: datos.longitud }

    if (markerRef.current) {
      markerRef.current.setPosition(pos)
    }

    if (mapInstance.current) {
      mapInstance.current.setCenter(pos)
    }

    if (polylineRef.current) {
      pathRef.current.push(pos)
      polylineRef.current.setPath(pathRef.current)
    }
  }

  const estadoFinalizado = paseo?.estado === 'FINALIZADO'

  return (
    <div className="dashboard">
      <div className="paseo-header">
        <h1>Seguimiento de Paseo</h1>
        <span className={`estado-badge ${estadoFinalizado ? 'finalizado' : 'en-curso'}`}>
          {estadoFinalizado ? 'FINALIZADO' : 'EN CURSO'}
        </span>
      </div>

      {paseo && (
        <div className="paseo-info">
          <p>Mascota: <strong>{paseo.nombreMascota}</strong></p>
          <p>Paseador: <strong>{paseo.nombrePaseador}</strong></p>
          {paseo.fechaInicio && (
            <p>Iniciado: {new Date(paseo.fechaInicio).toLocaleString()}</p>
          )}
          <p>
            Conexión:{' '}
            <span className={`ws-${estadoWs}`}>
              {estadoWs === 'conectado' ? '🟢 En vivo' : '🔴 Reconectando...'}
            </span>
          </p>
        </div>
      )}

      <div
        ref={mapRef}
        className="mapa-container"
        style={{ height: '500px', width: '100%', borderRadius: '12px' }}
      />
    </div>
  )
}

export default SeguirPaseoPage
