import { useEffect, useRef } from 'react'
import { FilePdf, MonitorPlay, PlayCircle, X } from '@phosphor-icons/react'

import './ResourcePreview.css'

function pick(language, texts) {
  if (!texts) return null
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

const icons = { interactive: MonitorPlay, pdf: FilePdf, video: PlayCircle }

/* Molécula reutilizable: vista rápida del recurso. La acción primaria cambia
   según las capacidades del rol recibidas desde la página/API. */
function ResourcePreview({ experience, language = 'es', onAction, onClose, resource }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (resource && !dialog.open) dialog.showModal()
    if (!resource && dialog.open) dialog.close()
  }, [resource])

  if (!resource) return <dialog className="resource-preview" ref={dialogRef} />

  const Icon = icons[resource.kind] ?? PlayCircle
  const fallbackKind = resource.kind === 'interactive'
    ? (language === 'en' ? 'Interactive' : 'Interactivo')
    : (language === 'en' ? 'Video' : 'Vídeo')

  return (
    <dialog className={`resource-preview resource-preview--${resource.tone ?? 'red'}`} ref={dialogRef} onCancel={onClose} onClose={onClose}>
      <button className="resource-preview__close" type="button" onClick={onClose} aria-label={language === 'en' ? 'Close preview' : 'Cerrar vista previa'}>
        <X aria-hidden="true" weight="bold" />
      </button>
      <span className="resource-preview__icon"><Icon aria-hidden="true" weight="duotone" /></span>
      <span className="resource-preview__kind">{resource.kind === 'pdf' ? 'PDF' : pick(language, resource.eyebrow) || fallbackKind}</span>
      <h2>{pick(language, resource.title)}</h2>
      <p>{pick(language, resource.meta)}</p>
      <button className="resource-preview__action" type="button" onClick={() => onAction(resource)}>
        {pick(language, experience.action)}
      </button>
    </dialog>
  )
}

export default ResourcePreview
