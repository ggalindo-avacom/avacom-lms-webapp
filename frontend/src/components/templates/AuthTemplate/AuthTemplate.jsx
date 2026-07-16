import './AuthTemplate.css'

function AuthTemplate({ children }) {
  return (
    <main className="auth-template">
      <section className="auth-template__intro">
        <div className="auth-template__intro-content">
          <span className="auth-template__badge">Aprende a tu ritmo</span>
          <h2 className="auth-template__headline">
            El conocimiento que necesitas, en un solo lugar.
          </h2>
          <p className="auth-template__copy">
            Explora contenidos, sigue tu progreso y alcanza tus objetivos de
            aprendizaje.
          </p>
        </div>
      </section>
      <section className="auth-template__content">{children}</section>
    </main>
  )
}

export default AuthTemplate
