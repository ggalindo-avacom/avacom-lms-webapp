import { useState } from 'react'

import { login } from '../apiCalls/authService'
import { saveSession } from '../utils/tokenStorage'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const authenticate = async (credentials) => {
    setIsLoading(true)
    setError('')

    try {
      const session = await login(credentials)
      saveSession(session)
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { authenticate, error, isLoading }
}
