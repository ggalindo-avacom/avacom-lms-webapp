import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { hasSession } from '../utils/tokenStorage'

function ProtectedRoute() {
  const location = useLocation()

  if (!hasSession()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
