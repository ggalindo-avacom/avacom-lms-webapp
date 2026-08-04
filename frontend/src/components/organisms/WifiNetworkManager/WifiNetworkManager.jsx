import { useCallback, useEffect, useState } from 'react'

import WifiNetworkForm from '../../molecules/WifiNetworkForm/WifiNetworkForm'
import WifiNetworkList from '../../molecules/WifiNetworkList/WifiNetworkList'
import {
  deleteWifiNetwork,
  getWifiNetworks,
  updateWifiNetwork,
} from '../../../apiCalls/networkService'
import { useLanguage } from '../../../i18n/LanguageContext'
import './WifiNetworkManager.css'

/* Paso 1: contenido del modal con dos pestañas: registrar una red nueva
   (formulario existente) y administrar las redes guardadas (lista con
   Actualizar y Borrar). */
function WifiNetworkManager({
  detectedSsid = '',
  error = '',
  isSaving = false,
  onCancel,
  onNetworksChanged,
  onSubmit,
  successMessage = '',
}) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('create')
  const [networks, setNetworks] = useState([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [listError, setListError] = useState('')
  const [listSuccess, setListSuccess] = useState('')

  /* Paso 2: al entrar a la pestaña de guardadas se carga la lista. */
  const loadNetworks = useCallback(async () => {
    setIsLoadingList(true)
    setListError('')

    try {
      setNetworks(await getWifiNetworks())
    } catch (requestError) {
      setListError(requestError.message)
    } finally {
      setIsLoadingList(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'saved') {
      setListSuccess('')
      loadNetworks()
    }
  }, [activeTab, loadNetworks])

  /* Paso 3: actualizar contraseña/tipo y refrescar lista y QR del host. */
  const handleUpdate = async (networkId, changes) => {
    setListError('')
    setListSuccess('')

    try {
      const updatedNetwork = await updateWifiNetwork(networkId, changes)
      setListSuccess(t('wifiList.updated', { name: updatedNetwork.name }))
      await loadNetworks()
      onNetworksChanged?.()
      return true
    } catch (requestError) {
      setListError(requestError.message)
      return false
    }
  }

  /* Paso 4: borrar una red guardada y refrescar lista y QR del host. */
  const handleDelete = async (networkId) => {
    setListError('')
    setListSuccess('')
    const deletedNetwork = networks.find((network) => network.id === networkId)

    try {
      await deleteWifiNetwork(networkId)
      setListSuccess(t('wifiList.deleted', { name: deletedNetwork?.name ?? '' }))
      await loadNetworks()
      onNetworksChanged?.()
    } catch (requestError) {
      setListError(requestError.message)
    }
  }

  return (
    <div className="wifi-network-manager">
      <div className="wifi-network-manager__tabs" role="tablist" aria-label={t('wifiForm.tabsAria')}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'create'}
          className={activeTab === 'create' ? 'is-active' : ''}
          onClick={() => setActiveTab('create')}
        >
          {t('wifiForm.tabCreate')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'saved'}
          className={activeTab === 'saved' ? 'is-active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          {t('wifiForm.tabSaved')}
        </button>
      </div>

      {activeTab === 'create' ? (
        <WifiNetworkForm
          detectedSsid={detectedSsid}
          error={error}
          isSaving={isSaving}
          successMessage={successMessage}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      ) : (
        <WifiNetworkList
          error={listError}
          isLoading={isLoadingList}
          networks={networks}
          successMessage={listSuccess}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

export default WifiNetworkManager
