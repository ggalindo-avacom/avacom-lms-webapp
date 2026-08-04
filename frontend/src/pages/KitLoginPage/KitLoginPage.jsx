import { useNavigate } from 'react-router-dom'

import KitLoginCard from '../../components/organisms/KitLoginCard/KitLoginCard'
import KitAuthTemplate from '../../components/templates/KitAuthTemplate/KitAuthTemplate'
import { useStudentPresence } from '../../hooks/useStudentPresence'

function KitLoginPage() {
  const navigate = useNavigate()

  /* Paso 8: cada visitante del login marca presencia como estudiante; el
     backend agrupa por host, asi que mas pestañas no inflan el conteo. */
  useStudentPresence('student')

  /* Marcador de posición: lleva al inicio mientras se conecta la
     autenticación real. */
  const handleSubmit = () => {
    navigate('/', { replace: true })
  }

  return (
    <KitAuthTemplate>
      <KitLoginCard onSubmit={handleSubmit} />
    </KitAuthTemplate>
  )
}

export default KitLoginPage
