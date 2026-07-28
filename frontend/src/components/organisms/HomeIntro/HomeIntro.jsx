import { useState } from 'react'

import AvacomLogo from '../../atoms/AvacomLogo/AvacomLogo'
import WifiNetworkForm from '../../molecules/WifiNetworkForm/WifiNetworkForm'
import WifiNetworkQr from '../../molecules/WifiNetworkQr/WifiNetworkQr'
import { createWifiNetwork } from '../../../apiCalls/networkService'
import './HomeIntro.css'

function HomeIntro({ hostNetwork }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const toggleNetworkForm = () => {
    setIsFormOpen((currentValue) => !currentValue)
    setSaveError('')
    setSuccessMessage('')
  }

  const handleCreateNetwork = async (wifiNetwork) => {
    setIsSaving(true)
    setSaveError('')
    setSuccessMessage('')

    try {
      const createdNetwork = await createWifiNetwork(wifiNetwork)
      setSuccessMessage(`La red ${createdNetwork.name} fue guardada correctamente.`)
      hostNetwork.refresh()
    } catch (requestError) {
      setSaveError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="home-intro">
      <AvacomLogo />
      <div className="home-intro__content">
        <span className="home-intro__badge">◇ Plataforma para docentes</span>
        <h1>Tu aula, organizada y lista para enseñar.</h1>
        <p>
          Planea tus clases, sigue el progreso de tus estudiantes y genera
          certificados desde un solo lugar.
        </p>
      </div>

      <div className="home-intro__network">
        <WifiNetworkQr
          error={hostNetwork.error}
          isLoading={hostNetwork.isLoading}
          wifi={hostNetwork.networkData?.wifi}
        />
        <button
          className="home-intro__network-toggle"
          type="button"
          aria-expanded={isFormOpen}
          aria-controls="wifi-network-form"
          onClick={toggleNetworkForm}
        >
          {isFormOpen ? 'Cerrar configuración' : 'Registrar una nueva red'}
        </button>

        {isFormOpen && (
          <div id="wifi-network-form">
            <WifiNetworkForm
              detectedSsid={hostNetwork.networkData?.wifi?.ssid || ''}
              error={saveError}
              isSaving={isSaving}
              successMessage={successMessage}
              onCancel={toggleNetworkForm}
              onSubmit={handleCreateNetwork}
            />
          </div>
        )}
      </div>

      <div className="home-intro__features">
        <span>♢ Acceso seguro</span>
        <span>⌁ Funciona sin conexión</span>
      </div>
    </section>
  )
}

export default HomeIntro
