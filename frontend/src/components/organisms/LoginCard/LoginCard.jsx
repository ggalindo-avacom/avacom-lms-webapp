import Brand from '../../atoms/Brand/Brand'
import LoginForm from '../../molecules/LoginForm/LoginForm'
import './LoginCard.css'

function LoginCard({ error, isLoading, onSubmit }) {
  return (
    <section className="login-card">
      <Brand />
      <header className="login-card__header">
        <p className="login-card__eyebrow">Bienvenido de nuevo</p>
        <h1 className="login-card__title">Inicia sesión</h1>
        <p className="login-card__description">
          Accede a tus cursos y continúa aprendiendo.
        </p>
      </header>
      <LoginForm error={error} isLoading={isLoading} onSubmit={onSubmit} />
    </section>
  )
}

export default LoginCard
