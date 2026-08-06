import { Navigate, Route, Routes } from 'react-router-dom'

import CalendarPage from '../pages/CalendarPage/CalendarPage'
import EncyclopediaPage from '../pages/EncyclopediaPage/EncyclopediaPage'
import AttendancePage from '../pages/AttendancePage/AttendancePage'
import HomePage from '../pages/HomePage/HomePage'
import HelpPage from '../pages/HelpPage/HelpPage'
import KitLoginPage from '../pages/KitLoginPage/KitLoginPage'
import MainPage from '../pages/MainPage/MainPage'
import ModulePage from '../pages/ModulePage/ModulePage'
import NotificationPage from '../pages/NotificationPage/NotificationPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import ProgressPage from '../pages/ProgressPage/ProgressPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<KitLoginPage />} />
      <Route path="/mainmenu" element={<MainPage />} />
      <Route path="/lista-asignaturas" element={<ModulePage moduleId="subjects" />} />
      <Route path="/lista-asignaturas/:assignmentId" element={<ModulePage moduleId="subjects" />} />
      <Route path="/enciclopedia" element={<EncyclopediaPage />} />
      <Route path="/progreso" element={<ProgressPage />} />
      <Route path="/calendario" element={<CalendarPage />} />
      <Route path="/comunicacion" element={<NotificationPage />} />
      <Route path="/ayuda" element={<HelpPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/clase-de-hoy" element={<ModulePage forcedRole="profesor" moduleId="classToday" />} />
      <Route path="/asistencia" element={<AttendancePage />} />
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
