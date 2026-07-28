import { useCallback, useEffect, useState } from 'react'

import { buildQrAccessUrl, getHostNetwork } from '../apiCalls/networkService'

export function useHostNetwork() {
  const [networkData, setNetworkData] = useState(null)
  const [qrAccessUrl, setQrAccessUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [requestVersion, setRequestVersion] = useState(0)

  const refresh = useCallback(() => {
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadHostNetwork() {
      setIsLoading(true)
      setError('')

      try {
        const hostNetwork = await getHostNetwork({ signal: controller.signal })
        const accessUrl = buildQrAccessUrl(hostNetwork)

        setNetworkData(hostNetwork)
        setQrAccessUrl(accessUrl)
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return
        }

        const message = requestError.message || 'No fue posible consultar la red del host.'
        setError(message)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadHostNetwork()

    return () => controller.abort()
  }, [requestVersion])

  return {
    error,
    isLoading,
    networkData,
    qrAccessUrl,
    refresh,
  }
}
