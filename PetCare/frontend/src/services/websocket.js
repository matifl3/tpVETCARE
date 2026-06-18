let ws = null
let reconnectTimer = null

function getWsUrl(idPaseo) {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws/paseos/${idPaseo}`
}

export function conectarPaseo(idPaseo, onMensaje, onEstado) {
  if (ws) desconectar()

  ws = new WebSocket(getWsUrl(idPaseo))

  ws.onopen = () => {
    if (onEstado) onEstado('conectado')
  }

  ws.onmessage = (event) => {
    try {
      const datos = JSON.parse(event.data)
      if (onMensaje) onMensaje(datos)
    } catch (e) {
      console.error('Error al parsear mensaje WS:', e)
    }
  }

  ws.onclose = () => {
    if (onEstado) onEstado('desconectado')
    reconectar(idPaseo, onMensaje, onEstado)
  }

  ws.onerror = () => {
    if (onEstado) onEstado('error')
  }
}

function reconectar(idPaseo, onMensaje, onEstado) {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(() => {
    conectarPaseo(idPaseo, onMensaje, onEstado)
  }, 3000)
}

export function desconectar() {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = null
  if (ws) {
    ws.onclose = null
    ws.close()
    ws = null
  }
}
