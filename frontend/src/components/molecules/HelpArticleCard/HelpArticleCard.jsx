import { ArrowRight, FileText, PlayCircle } from '@phosphor-icons/react'

import './HelpArticleCard.css'

function pick(language, texts) {
  return language === 'en' ? texts.en : texts.es
}

/* Molécula: resultado de ayuda seleccionable con indicación de texto/vídeo. */
function HelpArticleCard({ active, article, language = 'es', onSelect }) {
  return (
    <button className={`help-article-card${active ? ' is-active' : ''}`} type="button" onClick={() => onSelect(article)}>
      <span className="help-article-card__icons">
        <FileText aria-hidden="true" weight="duotone" />
        {article.video && <PlayCircle aria-hidden="true" weight="fill" />}
      </span>
      <strong>{pick(language, article.question)}</strong>
      <small>{pick(language, article.summary)}</small>
      <ArrowRight className="help-article-card__arrow" aria-hidden="true" weight="bold" />
    </button>
  )
}

export default HelpArticleCard
