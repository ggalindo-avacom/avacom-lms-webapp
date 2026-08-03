import { useCallback, useState } from 'react'

import AvacomLogo from '../../atoms/AvacomLogo/AvacomLogo'
import Modal from '../../atoms/Modal/Modal'
import WifiNetworkForm from '../../molecules/WifiNetworkForm/WifiNetworkForm'
import WifiNetworkQr from '../../molecules/WifiNetworkQr/WifiNetworkQr'
import { createWifiNetwork } from '../../../apiCalls/networkService'
import './HomeIntro.css'

function HomeIntro({ hostNetwork }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const openNetworkForm = () => {
    setIsFormOpen(true)
    setSaveError('')
    setSuccessMessage('')
  }

  const closeNetworkForm = useCallback(() => {
    setIsFormOpen(false)
    setSaveError('')
    setSuccessMessage('')
  }, [])

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
      <div className="home-intro__header">
        <AvacomLogo />
        <div className="home-intro__content">
          <span className="home-intro__badge">◇ Plataforma para docentes</span>
          <h1>Tu aula, organizada y lista para enseñar.</h1>
        </div>
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
          aria-haspopup="dialog"
          aria-expanded={isFormOpen}
          aria-controls="wifi-network-form"
          onClick={openNetworkForm}
        >
          Registrar una nueva red
        </button>
      </div>

      <Modal
        id="wifi-network-form"
        isOpen={isFormOpen}
        title="Registrar una nueva red"
        onClose={closeNetworkForm}
      >
        <WifiNetworkForm
          detectedSsid={hostNetwork.networkData?.wifi?.ssid || ''}
          error={saveError}
          isSaving={isSaving}
          successMessage={successMessage}
          onCancel={closeNetworkForm}
          onSubmit={handleCreateNetwork}
        />
      </Modal>

   
    </section>
  )
}

export default HomeIntro
