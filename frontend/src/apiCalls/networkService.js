import { ApiError, apiRequest } from './apiClient'

const REQUIRED_NETWORK_FIELDS = [
  'ip_address',
  'frontend_address',
  'backend_address',
  'query',
]

export async function getHostNetwork(options = {}) {
  const responseBody = await apiRequest('/network/ip-address/', options)

  if (!responseBody?.data || typeof responseBody.data !== 'object') {
    throw new ApiError(
      'La API de red respondió sin la propiedad data.',
      502,
      responseBody,
    )
  }

  const hasValidNetworkData = REQUIRED_NETWORK_FIELDS.every(
    (field) => typeof responseBody.data[field] === 'string' && responseBody.data[field],
  )

  if (!hasValidNetworkData) {
    throw new ApiError(
      'La API de red devolvió datos incompletos.',
      502,
      responseBody,
    )
  }

  return responseBody.data
}

export async function createWifiNetwork(wifiNetwork) {
  const responseBody = await apiRequest('/network/wifi-networks/', {
    method: 'POST',
    body: JSON.stringify(wifiNetwork),
  })

  if (!responseBody?.data || typeof responseBody.data !== 'object') {
    throw new ApiError(
      'La API respondió sin los datos de la red creada.',
      502,
      responseBody,
    )
  }

  return responseBody.data
}

/* El QR lleva al dispositivo invitado a la pantalla de inicio de sesión del
   frontend servido por esta máquina, con la dirección del backend como query
   para que el equipo remoto sepa a qué API pedirle los datos. */
const QR_ACCESS_PATH = '/login'

export function buildQrAccessUrl(networkData) {
  const frontendUrl = new URL(networkData.frontend_address)
  frontendUrl.pathname = QR_ACCESS_PATH
  frontendUrl.searchParams.set('backend', networkData.query)
  return frontendUrl.toString()
}
