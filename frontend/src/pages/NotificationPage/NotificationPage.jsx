import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import InstitutionalNotices from '../../components/organisms/InstitutionalNotices/InstitutionalNotices'
import TeacherNotices from '../../components/organisms/TeacherNotices/TeacherNotices'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { notificationsDemoData } from '../../data/notificationsDemoData'
import { useLanguage } from '../../i18n/LanguageContext'
import './NotificationPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* La fecha "de hoy" de la demo (los datos del prototipo viven en 2026). */
const DEMO_TODAY = '2026-08-06'

/* Página propia del módulo Comunicación. El rol de la demo entra por la prop
   forcedRole o por ?role=; los datos llegan con la misma forma que dará el
   backend (ver src/data/notificationsDemoData.js, que documenta los
   endpoints GET/POST de /api/communication/notifications/). */
function NotificationPage({ data = notificationsDemoData, forcedRole }) {
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const title = localize(language, 'Comunicación', 'Communication')

  /* Estado local = lo que en producción sería el POST + refetch. */
  const [institutional, setInstitutional] = useState(data.institutional)
  const [teacherNotices, setTeacherNotices] = useState(data.teacher)

  /* Paso 1: el admin publica notificaciones institucionales (audiencia: todos). */
  const publishInstitutional = ({ body, title: noticeTitle }) => {
    setInstitutional((current) => [{
      id: `inst-${Date.now()}`,
      channel: 'institutional',
      sender: { es: 'Administración', en: 'Administration' },
      audience: { type: 'all' },
      title: noticeTitle,
      body,
      date: DEMO_TODAY,
      isNew: true,
    }, ...current])
  }

  /* Paso 2: el profesor publica al estudiante o a toda la clase. */
  const publishTeacher = (mode, { body, recipient, title: noticeTitle }) => {
    setTeacherNotices((current) => [{
      id: `teach-${Date.now()}`,
      channel: 'teacher',
      sender: 'Ms. Carter',
      audience: mode === 'student'
        ? { type: 'student', studentId: null, studentName: recipient }
        : { type: 'course', courseId: null, courseName: recipient },
      title: noticeTitle,
      body,
      date: DEMO_TODAY,
      isNew: true,
    }, ...current])
  }

  return (
    <ModuleLayout activeModule="communication" language={language} role={role} title={title}>
      <h1>{title}</h1>
      <p className="module-subtitle">
        {role === 'estudiante'
          ? localize(language, 'Mensajes de tu colegio y de tus profesores.', 'Messages from your school and your teachers.')
          : role === 'profesor'
            ? localize(language, 'Envía mensajes a tus clases o a un estudiante.', 'Send messages to your classes or to a student.')
            : localize(language, 'Publica los avisos institucionales del colegio.', 'Publish the school-wide announcements.')}
      </p>

      {/* Paso 3: el orden prioriza lo que cada rol usa más. */}
      {role === 'admin' ? (
        <>
          <InstitutionalNotices canPublish language={language} notices={institutional} onPublish={publishInstitutional} />
          <TeacherNotices language={language} notices={teacherNotices} />
        </>
      ) : role === 'profesor' ? (
        <>
          <TeacherNotices canPublish language={language} notices={teacherNotices} onPublish={publishTeacher} />
          <InstitutionalNotices language={language} notices={institutional} />
        </>
      ) : (
        <>
          <InstitutionalNotices language={language} notices={institutional} />
          <TeacherNotices language={language} notices={teacherNotices} />
        </>
      )}
    </ModuleLayout>
  )
}

export default NotificationPage
