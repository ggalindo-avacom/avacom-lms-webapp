const API_URL_STORAGE_KEY = 'lms_api_url'
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || '/api'

function stripWrappingQuotes(value) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function normalizeBackendApiUrl(backendAddress) {
  const address = stripWrappingQuotes(backendAddress)
  const addressWithProtocol = /^https?:\/\//i.test(address)
    ? address
    : `http://${address}`
  const backendUrl = new URL(addressWithProtocol)

  backendUrl.pathname = '/api/'
  backendUrl.search = ''
  backendUrl.hash = ''

  return backendUrl.toString().replace(/\/$/, '')
}

function readStoredApiUrl() {
  try {
    return window.localStorage.getItem(API_URL_STORAGE_KEY)
  } catch {
    return null
  }
}

function saveApiUrl(apiUrl) {
  try {
    window.localStorage.setItem(API_URL_STORAGE_KEY, apiUrl)
  } catch {
    // The request can continue even when storage is unavailable.
  }
}

export function configureApiUrlFromQuery() {
  const backendAddress = new URLSearchParams(window.location.search).get('backend')

  if (!backendAddress) {
    return null
  }

  try {
    const apiUrl = normalizeBackendApiUrl(backendAddress)
    saveApiUrl(apiUrl)
    return apiUrl
  } catch {
    return null
  }
}

export function getApiUrl() {
  return readStoredApiUrl() || DEFAULT_API_URL
}

configureApiUrlFromQuery()

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function getErrorMessage(data) {
  if (typeof data?.detail === 'string') {
    return data.detail
  }

  if (typeof data?.error?.message === 'string') {
    return data.error.message
  }

  if (data && typeof data === 'object') {
    const firstFieldError = Object.values(data)
      .flat()
      .find((value) => typeof value === 'string')

    if (firstFieldError) {
      return firstFieldError
    }
  }

  return 'No fue posible completar la solicitud. Intenta nuevamente.'
}

export async function apiRequest(endpoint, options = {}) {
  const apiUrl = getApiUrl().replace(/\/$/, '')
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const response = await fetch(`${apiUrl}${normalizedEndpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = getErrorMessage(data)
    throw new ApiError(message, response.status, data)
  }

  return data
}
