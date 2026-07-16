import { apiRequest } from './apiClient'

export function login(credentials) {
  return apiRequest('/auth/token/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function refreshToken(refresh) {
  return apiRequest('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
}
