import { useEffect, useState } from 'react'

import { buildQrAccessUrl, getHostNetwork } from '../apiCalls/networkService'

export function useHostNetwork() {
  const [networkData, setNetworkData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadHostNetwork() {
      try {
        const hostNetwork = await getHostNetwork({ signal: controller.signal })
        setNetworkData(hostNetwork)
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return
        }

        const message = requestError.message || 'No fue posible consultar la red del host.'
        setError(message)
        window.alert(`Error al consultar el backend: ${message}`)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadHostNetwork()

    return () => controller.abort()
  }, [])

  return {
    error,
    isLoading,
    networkData,
    qrAccessUrl: networkData ? buildQrAccessUrl(networkData) : '',
  }
}
