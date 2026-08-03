import { useState } from 'react'

import KitButton from '../../atoms/KitButton/KitButton'
import KitField from '../../atoms/KitField/KitField'
import KitLogo from '../../atoms/KitLogo/KitLogo'
import { useLanguage } from '../../../i18n/LanguageContext'
import './KitLoginCard.css'

const initialValues = {
  password: '',
  username: '',
}

function KitLoginCard({ onSubmit }) {
  const { t } = useLanguage()
  const [values, setValues] = useState(initialValues)

  const handleChange = ({ target }) => {
    setValues((currentValues) => ({
      ...currentValues,
      [target.name]: target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="kit-login-card" onSubmit={handleSubmit} noValidate>
      <KitLogo />
      <p className="kit-login-card__sub">
        {t('kit.subtitle')}
      </p>

      <KitField
        id="kit-login-username"
        name="username"
        type="text"
        label={t('kit.username')}
        placeholder={t('kit.usernamePlaceholder')}
        autoComplete="username"
        value={values.username}
        onChange={handleChange}
      />
      <KitField
        id="kit-login-password"
        name="password"
        type="password"
        label={t('kit.password')}
        placeholder={t('kit.passwordPlaceholder')}
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
      />

      <KitButton size="big" type="submit" variant="primary">
        {t('kit.submit')}
      </KitButton>
    </form>
  )
}

export default KitLoginCard
