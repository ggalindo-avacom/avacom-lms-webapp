import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import LoginCard from '../../components/organisms/LoginCard/LoginCard'
import AuthTemplate from '../../components/templates/AuthTemplate/AuthTemplate'
import { useLogin } from '../../hooks/useLogin'
import { hasSession } from '../../utils/tokenStorage'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { authenticate, error, isLoading } = useLogin()

  if (hasSession()) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (credentials) => {
    const isAuthenticated = await authenticate(credentials)

    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/'
      navigate(destination, { replace: true })
    }
  }

  return (
    <AuthTemplate>
      <LoginCard
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
      />
    </AuthTemplate>
  )
}

export default LoginPage
