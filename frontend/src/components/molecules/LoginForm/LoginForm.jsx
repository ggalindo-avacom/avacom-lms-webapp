import { useState } from 'react'

import Button from '../../atoms/Button/Button'
import Input from '../../atoms/Input/Input'
import { useLanguage } from '../../../i18n/LanguageContext'
import './LoginForm.css'

const initialValues = { email: '', password: '' }

function LoginForm({ error, isLoading, onSubmit }) {
  const { t } = useLanguage()
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = ({ target }) => {
    setValues((current) => ({ ...current, [target.name]: target.value }))
    setFieldErrors((current) => ({ ...current, [target.name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const errors = {}

    if (!values.email.trim()) errors.email = t('login.emailRequired')
    if (!values.password) errors.password = t('login.passwordRequired')

    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }

    onSubmit(values)
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <Input
        id="email"
        name="email"
        type="email"
        label={t('login.email')}
        placeholder={t('login.emailPlaceholder')}
        autoComplete="email"
        value={values.email}
        error={fieldErrors.email}
        onChange={handleChange}
      />
      <Input
        id="password"
        name="password"
        type="password"
        label={t('login.password')}
        placeholder={t('login.passwordPlaceholder')}
        autoComplete="current-password"
        value={values.password}
        error={fieldErrors.password}
        onChange={handleChange}
      />
      {error && (
        <p className="login-form__message" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" isLoading={isLoading} loadingLabel={t('login.loading')}>
        {t('login.submit')}
      </Button>
    </form>
  )
}

export default LoginForm
