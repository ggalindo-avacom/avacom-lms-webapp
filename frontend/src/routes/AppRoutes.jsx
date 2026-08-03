import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from '../pages/HomePage/HomePage'
import KitLoginPage from '../pages/KitLoginPage/KitLoginPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<KitLoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
