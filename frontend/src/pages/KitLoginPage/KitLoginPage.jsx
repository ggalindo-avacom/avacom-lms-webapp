import { useNavigate } from 'react-router-dom'

import KitLoginCard from '../../components/organisms/KitLoginCard/KitLoginCard'
import KitAuthTemplate from '../../components/templates/KitAuthTemplate/KitAuthTemplate'

function KitLoginPage() {
  const navigate = useNavigate()

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
