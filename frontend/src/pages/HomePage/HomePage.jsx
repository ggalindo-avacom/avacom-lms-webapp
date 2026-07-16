import { useNavigate } from 'react-router-dom'

import Button from '../../components/atoms/Button/Button'
import { clearSession } from '../../utils/tokenStorage'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <main className="home-page">
      <section className="home-page__card">
        <p className="home-page__eyebrow">Sesión iniciada</p>
        <h1>Bienvenido a LMS Academy</h1>
        <p>
          Esta es una ruta protegida de ejemplo. Aquí podrá construirse el
          dashboard principal.
        </p>
        <div className="home-page__action">
          <Button type="button" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </section>
    </main>
  )
}

export default HomePage
