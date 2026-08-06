import { FilePdf } from '@phosphor-icons/react'

import './DocumentCover.css'

function pick(language, texts) {
  if (!texts) return null
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Molécula: carátula vertical de documento (proporción de póster tipo
   Netflix) para la sección de PDFs: lomo de color, título y autor. */
function DocumentCover({ language = 'es', meta, onSelect, title, tone = 'red' }) {
  return (
    <button
      className={`document-cover document-cover--${tone}`}
      type="button"
      aria-label={`${pick(language, title)} · PDF`}
      onClick={onSelect}
    >
      <span className="document-cover__kind"><FilePdf aria-hidden="true" weight="fill" /> PDF</span>
      <strong className="document-cover__title">{pick(language, title)}</strong>
      {meta && <span className="document-cover__meta">{pick(language, meta)}</span>}
    </button>
  )
}

export default DocumentCover
