import StudentsCounter from '../../molecules/StudentsCounter/StudentsCounter'
import { useLanguage } from '../../../i18n/LanguageContext'
import './StudentsCounterCard.css'

/* Paso 6: tarjeta del HomePage que enmarca el contador en vivo. */
function StudentsCounterCard() {
  const { t } = useLanguage()

  return (
    <section className="students-counter-card" aria-label={t('presence.title')}>
      <p className="students-counter-card__title">{t('presence.title')}</p>
      <StudentsCounter />
    </section>
  )
}

export default StudentsCounterCard
