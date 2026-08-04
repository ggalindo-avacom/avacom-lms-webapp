import { useState } from 'react'

import Input from '../../atoms/Input/Input'
import { useLanguage } from '../../../i18n/LanguageContext'
import './WifiNetworkList.css'

/* Paso 1: lista de redes guardadas. Cada fila ofrece Actualizar (abre el
   formulario de contraseña en linea) y Borrar (pide un segundo toque). */
function WifiNetworkList({
  error = '',
  isLoading = false,
  networks = [],
  onDelete,
  onUpdate,
  successMessage = '',
}) {
  const { t } = useLanguage()
  const [editingId, setEditingId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)
  const [editValues, setEditValues] = useState({ type: 'WPA', wifipassword: '' })
  const [isBusy, setIsBusy] = useState(false)

  const startEditing = (network) => {
    setEditingId(network.id)
    setConfirmingId(null)
    setEditValues({ type: network.type, wifipassword: network.wifipassword })
  }

  const stopEditing = () => {
    setEditingId(null)
    setEditValues({ type: 'WPA', wifipassword: '' })
  }

  const handleEditChange = ({ target }) => {
    setEditValues((currentValues) => ({
      ...currentValues,
      [target.name]: target.value,
      ...(target.name === 'type' && target.value === 'nopass'
        ? { wifipassword: '' }
        : {}),
    }))
  }

  /* Paso 2: PATCH de contraseña (y tipo) de la red elegida. */
  const handleUpdateSubmit = async (event) => {
    event.preventDefault()
    setIsBusy(true)

    const succeeded = await onUpdate(editingId, editValues)

    setIsBusy(false)
    if (succeeded) {
      stopEditing()
    }
  }

  /* Paso 3: DELETE con confirmacion: el primer toque arma el boton. */
  const handleDelete = async (network) => {
    if (confirmingId !== network.id) {
      setConfirmingId(network.id)
      return
    }

    setIsBusy(true)
    await onDelete(network.id)
    setIsBusy(false)
    setConfirmingId(null)
  }

  if (isLoading) {
    return <p className="wifi-network-list__hint">{t('wifiList.loading')}</p>
  }

  if (!networks.length) {
    return <p className="wifi-network-list__hint">{t('wifiList.empty')}</p>
  }

  return (
    <div className="wifi-network-list">
      {error && (
        <p className="wifi-network-list__message wifi-network-list__message--error" role="alert">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="wifi-network-list__message wifi-network-list__message--success" role="status">
          {successMessage}
        </p>
      )}

      <ul className="wifi-network-list__items">
        {networks.map((network) => (
          <li key={network.id} className="wifi-network-list__item">
            <div className="wifi-network-list__row">
              <div className="wifi-network-list__info">
                <strong>{network.name}</strong>
                <span>{network.type === 'nopass' ? t('wifiForm.typeOpen') : network.type}</span>
              </div>
              <div className="wifi-network-list__actions">
                <button
                  type="button"
                  className="wifi-network-list__update"
                  disabled={isBusy}
                  onClick={() => (editingId === network.id ? stopEditing() : startEditing(network))}
                >
                  {t('wifiList.update')}
                </button>
                <button
                  type="button"
                  className={`wifi-network-list__delete${confirmingId === network.id ? ' is-confirming' : ''}`}
                  disabled={isBusy}
                  onClick={() => handleDelete(network)}
                  onBlur={() => setConfirmingId(null)}
                >
                  {confirmingId === network.id ? t('wifiList.confirmDelete') : t('wifiList.delete')}
                </button>
              </div>
            </div>

            {/* Paso 4: formulario en linea para la nueva contraseña. */}
            {editingId === network.id && (
              <form className="wifi-network-list__edit" onSubmit={handleUpdateSubmit} noValidate>
                <label className="wifi-network-form__field" htmlFor={`wifi-edit-type-${network.id}`}>
                  <span>{t('wifiForm.type')}</span>
                  <select
                    id={`wifi-edit-type-${network.id}`}
                    name="type"
                    value={editValues.type}
                    onChange={handleEditChange}
                  >
                    <option value="nopass">{t('wifiForm.typeOpen')}</option>
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                  </select>
                </label>
                <Input
                  id={`wifi-edit-password-${network.id}`}
                  name="wifipassword"
                  type="password"
                  label={t('wifiList.newPassword')}
                  placeholder={
                    editValues.type === 'nopass'
                      ? t('wifiForm.passwordOpen')
                      : t('wifiForm.passwordPlaceholder')
                  }
                  autoComplete="new-password"
                  value={editValues.wifipassword}
                  disabled={editValues.type === 'nopass'}
                  onChange={handleEditChange}
                />
                <div className="wifi-network-form__actions">
                  <button type="button" className="wifi-network-form__cancel" onClick={stopEditing}>
                    {t('wifiForm.cancel')}
                  </button>
                  <button type="submit" className="wifi-network-form__save" disabled={isBusy}>
                    {isBusy ? t('wifiForm.saving') : t('wifiList.saveChanges')}
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WifiNetworkList
