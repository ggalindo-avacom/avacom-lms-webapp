import { CalendarDate } from '@internationalized/date'
import { useSearchParams } from 'react-router-dom'

import FullCalendar from '../../components/organisms/FullCalendar/FullCalendar'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { useLanguage } from '../../i18n/LanguageContext'
import './CalendarPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Fechas de la demo (2026) que ahora viven dentro del recuadro principal:
   programa académico e institucionales. label = [es, en]. */
const programEvents = [
  { date: new CalendarDate(2026, 7, 30), label: ['Evaluación Unidad 2 — Ecuaciones', 'Unit 2 evaluation — Equations'], time: '10:00', tone: 'program' },
  { date: new CalendarDate(2026, 8, 7), label: ['Entrega: Problemas de planteo (PDF)', 'Due: Word problems (PDF)'], time: '23:59', tone: 'program' },
  { date: new CalendarDate(2026, 8, 18), label: ['Inicio Unidad 3 — Sistemas 2×2', 'Unit 3 starts — 2×2 systems'], time: '10:00', tone: 'program' },
]

const institutionalEvents = [
  { date: new CalendarDate(2026, 8, 15), label: ['Día de la familia AVACOM', 'AVACOM family day'], time: null, tone: 'institutional' },
  { date: new CalendarDate(2026, 9, 11), label: ['Cierre del Periodo 2', 'Term 2 closes'], time: null, tone: 'institutional' },
  ...Array.from({ length: 5 }, (_, index) => ({
    date: new CalendarDate(2026, 10, 5 + index),
    label: ['Semana de receso escolar', 'School break week'],
    time: null,
    tone: 'institutional',
  })),
]

/* Página propia del módulo Calendario. El rol de la demo (estudiante,
   profesor o admin) llega por la prop forcedRole o por ?role= en la URL,
   igual que en el resto de módulos. */
function CalendarPage({ forcedRole }) {
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const title = localize(language, 'Calendario', 'Calendar')

  /* El admin solo ve fechas institucionales; estudiante y profesor ven todo. */
  const events = role === 'admin' ? institutionalEvents : [...programEvents, ...institutionalEvents]

  return (
    <ModuleLayout activeModule="calendar" language={language} role={role} title={title}>
      <h1>{title}</h1>
      <p className="module-subtitle">
        {role === 'profesor'
          ? localize(language, 'Fechas de tus grupos y del colegio.', 'Your groups’ and school dates.')
          : role === 'admin'
            ? localize(language, 'Fechas institucionales de la plataforma.', 'Institutional platform dates.')
            : localize(language, 'Tus fechas de clase y del colegio.', 'Your class and school dates.')}
      </p>

      <FullCalendar events={events} language={language} />
    </ModuleLayout>
  )
}

export default CalendarPage
