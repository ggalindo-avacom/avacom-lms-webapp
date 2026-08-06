import { useState } from 'react'
import { ChalkboardTeacher, Student, UsersThree } from '@phosphor-icons/react'

import NotificationComposer from '../../molecules/NotificationComposer/NotificationComposer'
import NotificationItem from '../../molecules/NotificationItem/NotificationItem'
import './TeacherNotices.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Organismo: notificaciones del profesor. canPublish muestra los dos botones
   del docente: mensaje a un estudiante o a toda la clase. */
function TeacherNotices({ canPublish = false, language = 'es', notices, onPublish }) {
  /* composeMode: null | 'student' | 'course' */
  const [composeMode, setComposeMode] = useState(null)

  const handleSubmit = (values) => {
    onPublish(composeMode, values)
    setComposeMode(null)
  }

  return (
    <section className="notices-board notices-board--teacher" aria-label={localize(language, 'Notificaciones del profesor', 'Teacher notifications')}>
      <header className="notices-board__header">
        <h2>{localize(language, 'Notificaciones del profesor', 'Teacher notifications')}</h2>
        {canPublish && composeMode === null && (
          <div className="notices-board__actions">
            <button className="notices-board__action notices-board__action--gold" type="button" onClick={() => setComposeMode('student')}>
              <Student aria-hidden="true" weight="bold" /> {localize(language, 'Mensaje al estudiante', 'Message a student')}
            </button>
            <button className="notices-board__action notices-board__action--green" type="button" onClick={() => setComposeMode('course')}>
              <UsersThree aria-hidden="true" weight="bold" /> {localize(language, 'Mensaje a la clase', 'Message the class')}
            </button>
          </div>
        )}
      </header>

      {composeMode !== null && (
        <NotificationComposer
          language={language}
          recipientLabel={composeMode === 'student'
            ? localize(language, 'Estudiante', 'Student')
            : localize(language, 'Clase', 'Class')}
          recipientPlaceholder={composeMode === 'student' ? 'Ej. Ethan Miller' : 'Ej. Álgebra · 8°B'}
          onCancel={() => setComposeMode(null)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="notices-board__list">
        {notices.map((notice) => (
          <NotificationItem
            key={notice.id}
            color={notice.audience.type === 'student' ? 'gold' : 'green'}
            date={notice.date}
            description={notice.body}
            icon={notice.audience.type === 'student' ? <Student weight="duotone" /> : <ChalkboardTeacher weight="duotone" />}
            isNew={notice.isNew}
            language={language}
            meta={notice.audience.type === 'student'
              ? `${notice.sender} → ${notice.audience.studentName}`
              : `${notice.sender} → ${notice.audience.courseName}`}
            title={notice.title}
          />
        ))}
      </div>
    </section>
  )
}

export default TeacherNotices
