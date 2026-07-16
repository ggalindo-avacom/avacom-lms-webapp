import AvacomLogo from '../../atoms/AvacomLogo/AvacomLogo'
import './HomeIntro.css'

function HomeIntro() {
  return (
    <section className="home-intro">
      <AvacomLogo />
      <div className="home-intro__content">
        <span className="home-intro__badge">◇ Plataforma para docentes</span>
        <h1>Tu aula, organizada y lista para enseñar.</h1>
        <p>Planea tus clases, sigue el progreso de tus estudiantes y genera certificados desde un solo lugar.</p>
      </div>
      <div className="home-intro__features">
        <span>♢ Acceso seguro</span>
        <span>⌁ Funciona sin conexión</span>
      </div>
    </section>
  )
}

export default HomeIntro
