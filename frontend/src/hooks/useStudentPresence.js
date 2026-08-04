import { useEffect, useRef, useState } from 'react'

import { getApiUrl } from '../apiCalls/apiClient'

const RECONNECT_DELAY_MS = 2000

/* Paso 1: la URL del WS sale de la misma fuente que la API. Si la API es
   absoluta (QR con ?backend=ip:8000) se va directo a ese host; si es relativa
   ('/api') se usa el origen actual y el proxy de Vite reenvía /ws al backend. */
function buildPresenceUrl(role) {
  const apiUrl = getApiUrl()
  const base = /^https?:\/\//i.test(apiUrl)
    ? new URL(apiUrl)
    : new URL(window.location.origin)
  const protocol = base.protocol === 'https:' ? 'wss:' : 'ws:'

  return `${protocol}//${base.host}/ws/network/student-presence/?role=${role}`
}

/* Paso 2: hook compartido. role='student' registra presencia (KitLoginPage);
   role='watcher' solo escucha el conteo (HomePage). */
export function useStudentPresence(role) {
  const [count, setCount] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const reconnectRef = useRef(null)

  useEffect(() => {
    let socket = null
    let isActive = true

    function connect() {
      socket = new WebSocket(buildPresenceUrl(role))

      socket.onopen = () => setIsLive(true)

      /* Paso 3: el backend empuja { count } en cada cambio; no hay polling. */
      socket.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data)
          if (typeof data.count === 'number') {
            setCount(data.count)
          }
        } catch {
          // Mensaje ajeno al conteo: se ignora.
        }
      }

      /* Paso 4: si se cae la conexión, se reintenta para seguir en vivo. */
      socket.onclose = () => {
        setIsLive(false)
        if (isActive) {
          reconnectRef.current = setTimeout(connect, RECONNECT_DELAY_MS)
        }
      }

      socket.onerror = () => socket.close()
    }

    connect()

    return () => {
      isActive = false
      clearTimeout(reconnectRef.current)
      socket?.close()
    }
  }, [role])

  return { count, isLive }
}
