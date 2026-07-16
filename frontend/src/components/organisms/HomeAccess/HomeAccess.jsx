import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AccessTabs from '../../molecules/AccessTabs/AccessTabs'
import LoginForm from '../../molecules/LoginForm/LoginForm'
import QrAccess from '../../molecules/QrAccess/QrAccess'
import { useLogin } from '../../../hooks/useLogin'
import './HomeAccess.css'

function HomeAccess() {
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
          <h2>Iniciar sesión</h2>
          <p>Escanea tu código QR o ingresa con tus credenciales.</p>
        </header>
        <AccessTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === 'qr' ? (
          <>
            <QrAccess />
            <button className="home-access__primary" type="button">
              Ingresar <span aria-hidden="true">→</span>
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
          ¿No tienes cuenta? <button type="button">Crear cuenta</button>
        </p>
      </div>
    </section>
  )
}

export default HomeAccess
