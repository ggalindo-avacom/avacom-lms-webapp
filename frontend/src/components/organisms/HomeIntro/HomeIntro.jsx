import { useCallback, useState } from 'react'

import AvacomLogo from '../../atoms/AvacomLogo/AvacomLogo'
import Modal from '../../atoms/Modal/Modal'
import WifiNetworkManager from '../WifiNetworkManager/WifiNetworkManager'
import WifiNetworkQr from '../../molecules/WifiNetworkQr/WifiNetworkQr'
import { createWifiNetwork } from '../../../apiCalls/networkService'
import { useLanguage } from '../../../i18n/LanguageContext'
import './HomeIntro.css'

function HomeIntro({ hostNetwork }) {
  const { t } = useLanguage()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedNetworkName, setSavedNetworkName] = useState('')

  const openNetworkForm = () => {
    setIsFormOpen(true)
    setSaveError('')
    setSavedNetworkName('')
  }

  const closeNetworkForm = useCallback(() => {
    setIsFormOpen(false)
    setSaveError('')
    setSavedNetworkName('')
  }, [])

  const handleCreateNetwork = async (wifiNetwork) => {
    setIsSaving(true)
    setSaveError('')
    setSavedNetworkName('')

    try {
      const createdNetwork = await createWifiNetwork(wifiNetwork)
      setSavedNetworkName(createdNetwork.name)
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
          <span className="home-intro__badge">{t('home.badge')}</span>
          <h1>{t('home.title')}</h1>
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
          {t('home.registerNetwork')}
        </button>
      </div>

      <Modal
        id="wifi-network-form"
        isOpen={isFormOpen}
        closeLabel={t('modal.close')}
        title={t('home.networkModalTitle')}
        onClose={closeNetworkForm}
      >
        <WifiNetworkManager
          detectedSsid={hostNetwork.networkData?.wifi?.ssid || ''}
          error={saveError}
          isSaving={isSaving}
          successMessage={savedNetworkName ? t('home.networkSaved', { name: savedNetworkName }) : ''}
          onCancel={closeNetworkForm}
          onNetworksChanged={hostNetwork.refresh}
          onSubmit={handleCreateNetwork}
        />
      </Modal>

   
    </section>
  )
}

export default HomeIntro
