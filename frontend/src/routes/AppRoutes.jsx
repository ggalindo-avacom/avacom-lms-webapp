import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from '../pages/HomePage/HomePage'
import KitLoginPage from '../pages/KitLoginPage/KitLoginPage'
import MainPage from '../pages/MainPage/MainPage'
import ModulePage from '../pages/ModulePage/ModulePage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<KitLoginPage />} />
      <Route path="/mainmenu" element={<MainPage />} />
      <Route path="/lista-asignaturas" element={<ModulePage moduleId="subjects" />} />
      <Route path="/lista-asignaturas/:assignmentId" element={<ModulePage moduleId="subjects" />} />
      <Route path="/enciclopedia" element={<ModulePage moduleId="encyclopedia" />} />
      <Route path="/progreso" element={<ModulePage moduleId="progress" />} />
      <Route path="/calendario" element={<ModulePage moduleId="calendar" />} />
      <Route path="/comunicacion" element={<ModulePage moduleId="communication" />} />
      <Route path="/ayuda" element={<ModulePage moduleId="help" />} />
      <Route path="/perfil" element={<ModulePage moduleId="profile" />} />
      <Route path="/clase-de-hoy" element={<ModulePage forcedRole="profesor" moduleId="classToday" />} />
      <Route path="/asistencia" element={<ModulePage forcedRole="profesor" moduleId="attendance" />} />
      <Route path="/estudiantes" element={<ModulePage forcedRole="profesor" moduleId="students" />} />
      <Route path="/reportes" element={<ModulePage moduleId="reports" />} />
      <Route path="/historial" element={<ModulePage forcedRole="profesor" moduleId="history" />} />
      <Route path="/profesores" element={<ModulePage forcedRole="admin" moduleId="teachers" />} />
      <Route path="/administracion/estudiantes" element={<ModulePage forcedRole="admin" moduleId="students" />} />
      <Route path="/certificados" element={<ModulePage forcedRole="admin" moduleId="certificates" />} />
      <Route path="/logs-bitacora" element={<ModulePage forcedRole="admin" moduleId="auditLogs" />} />
      <Route path="/configuraciones" element={<ModulePage forcedRole="admin" moduleId="settings" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
