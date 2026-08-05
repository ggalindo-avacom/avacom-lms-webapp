import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from '../pages/HomePage/HomePage'
import KitLoginPage from '../pages/KitLoginPage/KitLoginPage'
import MainPage from '../pages/MainPage/MainPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<KitLoginPage />} />
      <Route path="/mainmenu" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
