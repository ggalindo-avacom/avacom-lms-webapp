import { useNavigate } from 'react-router-dom'

import KitLoginCard from '../../components/organisms/KitLoginCard/KitLoginCard'
import StudentsCounterCard from '../../components/organisms/StudentsCounterCard/StudentsCounterCard'
import KitAuthTemplate from '../../components/templates/KitAuthTemplate/KitAuthTemplate'
import { useStudentPresence } from '../../hooks/useStudentPresence'

/* Destino de la demostración por rol. Hoy los tres llegan al inicio; cuando
   exista el tablero de cada rol solo cambia esta tabla. */
const demoRoutes = {
  estudiante: '/mainmenu',
  profesor: '/mainmenu?role=profesor',
  admin: '/mainmenu?role=admin',
}

function KitLoginPage() {
  const navigate = useNavigate()

  /* Paso 8: cada visitante del login marca presencia como estudiante; el
     backend agrupa por host, asi que mas pestañas no inflan el conteo. */
  useStudentPresence('student')

  const handleDemoAccess = (role) => {
    navigate(demoRoutes[role] ?? '/', { replace: true })
  }

  return (
    <KitAuthTemplate>
      <KitLoginCard onDemoAccess={handleDemoAccess} />
      {/* Mismo contador en vivo del inicio: aquí muestra cuántos hosts están
          en el login, incluido el propio dispositivo. */}
      <StudentsCounterCard />
    </KitAuthTemplate>
  )
}

export default KitLoginPage
