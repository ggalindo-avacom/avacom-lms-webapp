import { useEffect, useState } from 'react'
import { ClosedCaptioning, FileText, Play, VideoCamera } from '@phosphor-icons/react'

import './HelpArticleViewer.css'

function pick(language, texts) {
  if (!texts) return ''
  return language === 'en' ? texts.en : texts.es
}

/* Organismo lector. Si `video.sourceUrl` existe usa un reproductor real; si
   es null presenta el vídeo demo sin romper la estructura del documento. */
function HelpArticleViewer({ article, language = 'es', onVideoPlay }) {
  const [demoPlaying, setDemoPlaying] = useState(false)

  useEffect(() => setDemoPlaying(false), [article?.id])

  if (!article) {
    return (
      <article className="help-viewer help-viewer--empty">
        <FileText aria-hidden="true" weight="duotone" />
        <p>{language === 'en' ? 'Choose an article to read it here.' : 'Elige un artículo para leerlo aquí.'}</p>
      </article>
    )
  }

  const playDemo = () => {
    setDemoPlaying(true)
    onVideoPlay?.(article)
  }

  return (
    <article className="help-viewer">
      <span className="help-viewer__eyebrow">{article.type === 'faq' ? 'FAQ' : (language === 'en' ? 'Guide' : 'Guía')}</span>
      <h2>{pick(language, article.title)}</h2>
      <p className="help-viewer__summary">{pick(language, article.summary)}</p>

      <div className="help-viewer__body">
        {article.body.map((paragraph) => <p key={pick(language, paragraph)}>{pick(language, paragraph)}</p>)}
      </div>

      {article.video && (
        <section className="help-video" aria-label={pick(language, article.video.title)}>
          {article.video.sourceUrl ? (
            <video controls preload="metadata" src={article.video.sourceUrl}>
              {article.video.captionsUrl && <track kind="captions" src={article.video.captionsUrl} srcLang={language} default />}
            </video>
          ) : (
            <button type="button" className={demoPlaying ? 'is-playing' : ''} onClick={playDemo}>
              <span className="help-video__orb"><Play aria-hidden="true" weight="fill" /></span>
              <span className="help-video__copy">
                <strong>{demoPlaying ? (language === 'en' ? 'Demo video ready' : 'Vídeo demo listo') : pick(language, article.video.title)}</strong>
                <small><VideoCamera aria-hidden="true" /> {article.video.duration} <ClosedCaptioning aria-hidden="true" /></small>
              </span>
              <i aria-hidden="true"><span /></i>
            </button>
          )}
        </section>
      )}
    </article>
  )
}

export default HelpArticleViewer
