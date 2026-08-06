import './SteppedCard.css'

/* Molécula visual genérica: tarjeta horizontal tipo carpeta con pestaña
   escalonada. Su contenido puede ser cualquier formulario o mensaje. */
function SteppedCard({ children, description, eyebrow, title }) {
  return (
    <section className="stepped-card">
      <span className="stepped-card__tab" aria-hidden="true" />
      <header>
        <span>{eyebrow}</span>
      </header>
      <div className="stepped-card__body">
        <div className="stepped-card__intro">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {children}
      </div>
    </section>
  )
}

export default SteppedCard
