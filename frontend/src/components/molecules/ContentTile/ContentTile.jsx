import { MonitorPlay, PlayCircle } from '@phosphor-icons/react'

import './ContentTile.css'

function pick(language, texts) {
  if (!texts) return null
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Molécula: mosaico apaisado de la videoteca (clases y exámenes), con
   degradado por tono, icono y título — estilo tarjeta de streaming. */
function ContentTile({ eyebrow, language = 'es', meta, onSelect, title, tone = 'red', kind = 'video' }) {
  const Icon = kind === 'interactive' ? MonitorPlay : PlayCircle

  return (
    <button
      className={`content-tile content-tile--${tone}`}
      type="button"
      aria-label={`${pick(language, title)} · ${pick(language, meta) ?? ''}`}
      onClick={onSelect}
    >
      <Icon className="content-tile__icon" aria-hidden="true" weight="duotone" />
      {eyebrow && <span className="content-tile__eyebrow">{pick(language, eyebrow)}</span>}
      <strong className="content-tile__title">{pick(language, title)}</strong>
      {meta && <span className="content-tile__meta">{pick(language, meta)}</span>}
    </button>
  )
}

export default ContentTile
