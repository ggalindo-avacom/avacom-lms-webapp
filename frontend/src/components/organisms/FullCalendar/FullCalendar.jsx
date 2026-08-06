import { useMemo, useState } from 'react'
import { CaretLeft, CaretRight, Plus } from '@phosphor-icons/react'
import { getLocalTimeZone, isToday as isTodayDate, startOfMonth, startOfWeek, today } from '@internationalized/date'

import './FullCalendar.css'

const MAX_CHIPS_PER_DAY = 3

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Lunes como inicio de semana en ambos idiomas, como en el prototipo.
   (es-CO es domingo-primero en CLDR, por eso se usa es-ES para el cálculo.) */
function weekLocale(language) {
  return language === 'en' ? 'en-GB' : 'es-ES'
}

function formatterLocale(language) {
  return language === 'en' ? 'en' : 'es'
}

function toJsDate(date) {
  return date.toDate(getLocalTimeZone())
}

/* Paso 1: expandir el periodo visible según la vista (mes 6x7, semana 7, día 1). */
function visibleDays(view, focusedDate, language) {
  if (view === 'day') return [focusedDate]

  if (view === 'week') {
    const start = startOfWeek(focusedDate, weekLocale(language))
    return Array.from({ length: 7 }, (_, index) => start.add({ days: index }))
  }

  const start = startOfWeek(startOfMonth(focusedDate), weekLocale(language))
  return Array.from({ length: 42 }, (_, index) => start.add({ days: index }))
}

function DayChips({ date, events, expanded, language }) {
  const dayEvents = events.filter((event) => event.date.compare(date) === 0)
  const visible = expanded ? dayEvents : dayEvents.slice(0, MAX_CHIPS_PER_DAY)
  const hiddenCount = dayEvents.length - visible.length

  return (
    <>
      {visible.map((event) => (
        <span className={`full-calendar__chip full-calendar__chip--${event.tone}`} key={`${event.date.toString()}-${event.label[0]}`} title={localize(language, ...event.label)}>
          <span className="full-calendar__chip-label">{localize(language, ...event.label)}</span>
          {event.time && <span className="full-calendar__chip-time">{event.time}</span>}
        </span>
      ))}
      {hiddenCount > 0 && <span className="full-calendar__more">{hiddenCount} {localize(language, 'más', 'more')}</span>}
    </>
  )
}

/* Calendario completo con vistas de día, semana y mes, al estilo del
   componente "calendar" de Untitled UI. Recibe los recordatorios ya
   filtrados por rol. */
function FullCalendar({ events = [], language = 'es' }) {
  const [view, setView] = useState('month')
  const [focusedDate, setFocusedDate] = useState(() => today(getLocalTimeZone()))
  const [reminders, setReminders] = useState([])

  const allEvents = useMemo(
    () => [...events, ...reminders].sort((a, b) => a.date.compare(b.date)),
    [events, reminders],
  )
  const days = visibleDays(view, focusedDate, language)
  const currentToday = today(getLocalTimeZone())

  /* Paso 2: navegación por unidad de la vista activa. */
  const move = (direction) => {
    const step = view === 'month' ? { months: direction } : view === 'week' ? { weeks: direction } : { days: direction }
    setFocusedDate((current) => current.add(step))
  }

  /* Paso 3: "Añadir recordatorio" crea uno en la fecha enfocada (solo demo,
     vive en memoria de la pantalla). */
  const addReminder = () => {
    setReminders((current) => [
      ...current,
      { date: focusedDate, label: ['Nuevo recordatorio', 'New reminder'], time: null, tone: 'reminder' },
    ])
  }

  const locale = formatterLocale(language)
  const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(toJsDate(focusedDate))
  const dayLong = new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(toJsDate(focusedDate))
  const rangeFormat = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  const rangeText = view === 'day' ? dayLong : `${rangeFormat.format(toJsDate(days[0]))} – ${rangeFormat.format(toJsDate(days[days.length - 1]))}`
  const monthStartWeek = startOfWeek(startOfMonth(focusedDate), weekLocale(language))
  const focusedWeek = startOfWeek(focusedDate, weekLocale(language))
  const weekOfMonth = Math.floor(focusedWeek.compare(monthStartWeek) / 7) + 1
  const badgeMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(toJsDate(currentToday)).replace('.', '')
  const weekdayNames = visibleDays('week', focusedDate, language).map((day) => new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(toJsDate(day)).replace('.', ''))

  return (
    <section className="full-calendar" aria-label={localize(language, 'Calendario', 'Calendar')}>
      <header className="full-calendar__header">
        <div className="full-calendar__heading">
          <span className="full-calendar__badge" aria-hidden="true">
            <small>{badgeMonth}</small>
            <strong>{currentToday.day}</strong>
          </span>
          <div>
            <div className="full-calendar__title-row">
              <h2 className="full-calendar__title">{view === 'day' ? dayLong : monthTitle}</h2>
              {view !== 'day' && <span className="full-calendar__week-chip">{localize(language, 'Semana', 'Week')} {weekOfMonth}</span>}
            </div>
            <p className="full-calendar__range">{rangeText}</p>
          </div>
        </div>

        <div className="full-calendar__controls">
          <div className="full-calendar__nav" role="group" aria-label={localize(language, 'Navegar fechas', 'Navigate dates')}>
            <button type="button" aria-label={localize(language, 'Anterior', 'Previous')} onClick={() => move(-1)}><CaretLeft aria-hidden="true" /></button>
            <button type="button" className="full-calendar__today" onClick={() => setFocusedDate(currentToday)}>{localize(language, 'Hoy', 'Today')}</button>
            <button type="button" aria-label={localize(language, 'Siguiente', 'Next')} onClick={() => move(1)}><CaretRight aria-hidden="true" /></button>
          </div>

          <label className="full-calendar__view">
            <span className="sr-only-label">{localize(language, 'Vista', 'View')}</span>
            <select value={view} onChange={(event) => setView(event.target.value)}>
              <option value="day">{localize(language, 'Vista día', 'Day view')}</option>
              <option value="week">{localize(language, 'Vista semana', 'Week view')}</option>
              <option value="month">{localize(language, 'Vista mes', 'Month view')}</option>
            </select>
          </label>

          <button className="full-calendar__add" type="button" onClick={addReminder}>
            <Plus aria-hidden="true" weight="bold" /> {localize(language, 'Añadir recordatorio', 'Add reminder')}
          </button>
        </div>
      </header>

      {view !== 'day' && (
        <div className="full-calendar__weekdays" aria-hidden="true">
          {weekdayNames.map((name) => <span key={name}>{name}</span>)}
        </div>
      )}

      {/* Paso 4: cuadrícula de celdas completas; tocar un día abre su vista. */}
      <div className={`full-calendar__grid full-calendar__grid--${view}`} role="grid">
        {days.map((date) => {
          const outsideMonth = view === 'month' && date.month !== focusedDate.month
          const isCurrentDay = isTodayDate(date, getLocalTimeZone())

          return (
            <div
              className={`full-calendar__cell${outsideMonth ? ' is-outside' : ''}${isCurrentDay ? ' is-today' : ''}`}
              key={date.toString()}
              role="gridcell"
              tabIndex={view === 'day' ? -1 : 0}
              onClick={view === 'day' ? undefined : () => { setFocusedDate(date); setView('day') }}
              onKeyDown={view === 'day' ? undefined : (event) => { if (event.key === 'Enter') { setFocusedDate(date); setView('day') } }}
            >
              {view !== 'day' && <span className="full-calendar__daynum">{date.day}</span>}
              <div className="full-calendar__chips">
                <DayChips date={date} events={allEvents} expanded={view !== 'month'} language={language} />
                {view === 'day' && !allEvents.some((event) => event.date.compare(date) === 0) && (
                  <p className="full-calendar__empty">{localize(language, 'Sin recordatorios para este día.', 'No reminders for this day.')}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FullCalendar
