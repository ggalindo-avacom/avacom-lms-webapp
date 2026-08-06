import { CalendarBlank } from '@phosphor-icons/react'

import './TodayDateCard.css'

/* Átomo: tarjeta fija con la fecha actual, fondo #53544F y glassmorfismo.
   date en ISO (YYYY-MM-DD); si no llega usa la fecha real del dispositivo. */
function TodayDateCard({ date, language = 'es' }) {
  const value = date ? new Date(`${date}T12:00:00`) : new Date()
  const locale = language === 'en' ? 'en' : 'es'
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(value)
  const dayMonth = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(value)

  return (
    <aside className="today-date-card" aria-label={`${weekday} ${dayMonth}`}>
      <span className="today-date-card__icon" aria-hidden="true"><CalendarBlank weight="duotone" /></span>
      <span className="today-date-card__text">
        <strong>{dayMonth}</strong>
        <small>{weekday}</small>
      </span>
    </aside>
  )
}

export default TodayDateCard
