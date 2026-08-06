import HexBadge from '../../atoms/HexBadge/HexBadge'
import ModuleChip from '../../atoms/ModuleChip/ModuleChip'
import './NotificationItem.css'

/* Molécula: notificación horizontal — hexágono a la izquierda, título y
   descripción a la derecha. Acepta textos { es, en } o string plano (los
   mensajes creados en pantalla van en un solo idioma). */
function pick(language, texts) {
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

function NotificationItem({ color, date, description, icon, isNew = false, language = 'es', meta, title }) {
  const dateText = date
    ? new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', { day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`))
    : null

  return (
    <article className="notification-item">
      <HexBadge color={color}>{icon}</HexBadge>
      <div className="notification-item__body">
        <div className="notification-item__head">
          <h3 className="notification-item__title">{pick(language, title)}</h3>
          {isNew && <ModuleChip tone="ok">{language === 'en' ? 'New' : 'Nueva'}</ModuleChip>}
        </div>
        <p className="notification-item__description">{pick(language, description)}</p>
        <div className="notification-item__meta">
          {meta && <span>{pick(language, meta)}</span>}
          {dateText && <span>{dateText}</span>}
        </div>
      </div>
    </article>
  )
}

export default NotificationItem
