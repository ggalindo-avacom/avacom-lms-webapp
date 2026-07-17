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

export function buildQrAccessUrl(networkData) {
  const frontendUrl = new URL(networkData.frontend_address)
  frontendUrl.searchParams.set('backend', networkData.query)
  return frontendUrl.toString()
}
