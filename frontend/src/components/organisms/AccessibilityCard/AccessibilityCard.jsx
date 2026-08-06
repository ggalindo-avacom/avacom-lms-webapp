import { Eye, SpeakerHigh } from '@phosphor-icons/react'

import './AccessibilityCard.css'

function pick(language, texts) {
  return language === 'en' ? texts.en : texts.es
}

/* Organismo controlado: las preferencias llegan desde la página y pueden
   sincronizarse después con PATCH /api/profile/accessibility/. */
function AccessibilityCard({ language = 'es', onReadAloud, onToggle, options, settings }) {
  return (
    <section className="accessibility-card" aria-labelledby="accessibility-title">
      <span className="accessibility-card__icon"><Eye aria-hidden="true" weight="duotone" /></span>
      <div>
        <h2 id="accessibility-title">{language === 'en' ? 'Accessibility' : 'Accesibilidad'}</h2>
        <p>{language === 'en' ? 'Adjust the experience to make it comfortable for you.' : 'Ajusta la experiencia para que sea cómoda para ti.'}</p>
      </div>
      <div className="accessibility-card__options">
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={settings[option.id]} onClick={() => onToggle(option.id)}>
            <span><strong>{pick(language, option.label)}</strong><small>{pick(language, option.description)}</small></span>
            <i aria-hidden="true" />
          </button>
        ))}
        <button className="accessibility-card__speak" type="button" onClick={onReadAloud}>
          <SpeakerHigh aria-hidden="true" weight="fill" />
          <span><strong>{language === 'en' ? 'Read this page aloud' : 'Leer esta página en voz alta'}</strong></span>
        </button>
      </div>
    </section>
  )
}

export default AccessibilityCard
