import { useLanguage } from '../../../i18n/LanguageContext'
import { useStudentPresence } from '../../../hooks/useStudentPresence'
import './StudentsCounter.css'

/* Paso 5: el contador observa la presencia como 'watcher' (no suma al conteo)
   y se re-renderiza con cada push del backend. */
function StudentsCounter() {
  const { t } = useLanguage()
  const { count, isLive } = useStudentPresence('watcher')

  return (
    <div className="students-counter">
      <span className="students-counter__value">{count ?? '—'}</span>
      <span
        className={`students-counter__status${isLive ? ' is-live' : ''}`}
        role="status"
      >
        <i aria-hidden="true" />
        {isLive ? t('presence.live') : t('presence.connecting')}
      </span>
    </div>
  )
}

export default StudentsCounter
