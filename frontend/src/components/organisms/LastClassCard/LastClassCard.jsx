import { ArrowRight, ChalkboardTeacher } from '@phosphor-icons/react'

import ModuleProgress from '../../atoms/ModuleProgress/ModuleProgress'
import './LastClassCard.css'

function localize(language, texts) {
  return language === 'en' ? texts.en : texts.es
}

/* Tarjeta principal "Tu última clase": blanco cálido, bordes muy redondeados
   y sombra difusa. La fecha acompaña al título con menor jerarquía. Con
   onOpenClass muestra el botón que lleva a la clase. */
function LastClassCard({ language = 'es', lastClass, onOpenClass, title }) {
  const classDate = new Date(`${lastClass.date}T12:00:00`)
  const dateText = new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', { dateStyle: 'full' }).format(classDate)

  return (
    <section className="last-class-card" aria-label={title}>
      <span className="last-class-card__icon" aria-hidden="true">
        <ChalkboardTeacher weight="duotone" />
      </span>

      <div className="last-class-card__body">
        <p className="last-class-card__kicker">{title}</p>
        <h2 className="last-class-card__title">{localize(language, lastClass.title)}</h2>
        <p className="last-class-card__date">{dateText}</p>
        <p className="last-class-card__summary">{localize(language, lastClass.summary)}</p>

        <div className="last-class-card__meta">
          <span className="module-chip module-chip--info">{lastClass.course}</span>
          {lastClass.teacher && <span className="module-chip module-chip--ok">{lastClass.teacher}</span>}
        </div>

        {typeof lastClass.progress === 'number' && (
          <div className="last-class-card__progress">
            <ModuleProgress value={lastClass.progress} />
            <small>{lastClass.progress}%</small>
          </div>
        )}

        {onOpenClass && (
          <button className="last-class-card__cta" type="button" onClick={onOpenClass}>
            {localize(language, { es: 'Ir a la clase', en: 'Go to class' })}
            <ArrowRight aria-hidden="true" weight="bold" />
          </button>
        )}
      </div>
    </section>
  )
}

export default LastClassCard
