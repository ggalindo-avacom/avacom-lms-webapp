import { useEffect, useState } from 'react'

import Input from '../../atoms/Input/Input'
import './WifiNetworkForm.css'

const initialValues = {
  name: '',
  wifipassword: '',
  type: 'nopass',
}

function WifiNetworkForm({
  detectedSsid = '',
  error = '',
  isSaving = false,
  onCancel,
  onSubmit,
  successMessage = '',
}) {
  const [values, setValues] = useState({
    ...initialValues,
    name: detectedSsid,
  })
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    setValues((currentValues) => (
      currentValues.name || !detectedSsid
        ? currentValues
        : { ...currentValues, name: detectedSsid }
    ))
  }, [detectedSsid])

  const handleChange = ({ target }) => {
    const nextValue = target.value

    setValues((currentValues) => ({
      ...currentValues,
      [target.name]: nextValue,
      ...(target.name === 'type' && nextValue === 'nopass'
        ? { wifipassword: '' }
        : {}),
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [target.name]: '',
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'El nombre de la red es obligatorio.'
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors)
      return
    }

    onSubmit({
      ...values,
      name: values.name.trim(),
    })
  }

  return (
    <form className="wifi-network-form" onSubmit={handleSubmit} noValidate>
      <Input
        id="wifi-name"
        name="name"
        type="text"
        label="Nombre de la red (SSID)"
        placeholder="Ej. Makers"
        autoComplete="off"
        value={values.name}
        error={fieldErrors.name}
        onChange={handleChange}
      />

      <label className="wifi-network-form__field" htmlFor="wifi-type">
        <span>Tipo de seguridad</span>
        <select
          id="wifi-type"
          name="type"
          value={values.type}
          onChange={handleChange}
        >
          <option value="nopass">Red abierta</option>
          <option value="WPA">WPA / WPA2 / WPA3</option>
          <option value="WEP">WEP</option>
        </select>
      </label>

      <Input
        id="wifi-password"
        name="wifipassword"
        type="password"
        label="Contraseña"
        placeholder={
          values.type === 'nopass'
            ? 'No requerida para una red abierta'
            : 'Contraseña de la red'
        }
        autoComplete="new-password"
        value={values.wifipassword}
        disabled={values.type === 'nopass'}
        onChange={handleChange}
      />

      {error && (
        <p className="wifi-network-form__message wifi-network-form__message--error" role="alert">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="wifi-network-form__message wifi-network-form__message--success" role="status">
          {successMessage}
        </p>
      )}

      <div className="wifi-network-form__actions">
        <button type="button" className="wifi-network-form__cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="wifi-network-form__save" disabled={isSaving}>
          {isSaving ? 'Guardando…' : 'Guardar red'}
        </button>
      </div>
    </form>
  )
}

export default WifiNetworkForm
