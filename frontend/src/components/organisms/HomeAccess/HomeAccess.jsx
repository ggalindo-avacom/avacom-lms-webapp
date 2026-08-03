import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AccessTabs from '../../molecules/AccessTabs/AccessTabs'
import LoginForm from '../../molecules/LoginForm/LoginForm'
import QrAccess from '../../molecules/QrAccess/QrAccess'
import { useLogin } from '../../../hooks/useLogin'
import { useLanguage } from '../../../i18n/LanguageContext'
import './HomeAccess.css'

function HomeAccess({ hostNetwork }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('qr')
  const navigate = useNavigate()
  const { authenticate, error, isLoading } = useLogin()

  const handleLogin = async (credentials) => {
    const isAuthenticated = await authenticate(credentials)

    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <section className="home-access">
      <div className="home-access__panel">
        <header>
          <h2>{t('access.title')}</h2>
          <p>{t('access.subtitle')}</p>
        </header>
        <AccessTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === 'qr' ? (
          <>
            <QrAccess
              accessUrl={hostNetwork.qrAccessUrl}
              error={hostNetwork.error}
              isLoading={hostNetwork.isLoading}
            />
            <button className="home-access__primary" type="button">
              {t('access.enter')} <span aria-hidden="true">→</span>
            </button>
          </>
        ) : (
          <LoginForm
            error={error}
            isLoading={isLoading}
            onSubmit={handleLogin}
          />
        )}
        <p className="home-access__signup">
          {t('access.noAccount')} <button type="button">{t('access.createAccount')}</button>
        </p>
      </div>
    </section>
  )
}

export default HomeAccess
