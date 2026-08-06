import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  BookOpen,
  CheckCircle,
  DownloadSimple,
  FileArrowUp,
  FilePdf,
  FileText,
  Function as FunctionIcon,
  Key,
  Lifebuoy,
  PaperPlaneTilt,
  Play,
  PlayCircle,
  ProjectorScreen,
  SealCheck,
  UploadSimple,
} from '@phosphor-icons/react'

import ModuleChip from '../../components/atoms/ModuleChip/ModuleChip'
import CoursePresentation from '../../components/molecules/CoursePresentation/CoursePresentation'
import ModuleProgress from '../../components/atoms/ModuleProgress/ModuleProgress'
import ModuleInfoRow from '../../components/molecules/ModuleInfoRow/ModuleInfoRow'
import ModuleTabs from '../../components/molecules/ModuleTabs/ModuleTabs'
import ModuleCard from '../../components/organisms/ModuleCard/ModuleCard'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import {
  calendarData,
  courseUnits,
  encyclopediaData,
  helpData,
  prototypeProfiles,
  students,
  subjectsByRole,
  syllabus,
  systemLogs,
  teacherHistory,
  teachers,
} from '../../data/lmsPrototypeData'
import { useLanguage } from '../../i18n/LanguageContext'
import { getAssignmentPath, getModulePath } from '../../routes/moduleRoutes'
import './ModulePage.css'

const titleByModule = {
  subjects: ['Asignaturas', 'Subjects'],
  encyclopedia: ['Enciclopedia', 'Encyclopedia'],
  progress: ['Progreso', 'Progress'],
  calendar: ['Calendario', 'Calendar'],
  communication: ['Comunicación', 'Communication'],
  help: ['Ayuda', 'Help'],
  profile: ['Perfil', 'Profile'],
  classToday: ['Clase de hoy', "Today's class"],
  attendance: ['Asistencia', 'Attendance'],
  students: ['Estudiantes', 'Students'],
  reports: ['Reportes', 'Reports'],
  history: ['Historial', 'History'],
  teachers: ['Profesores', 'Teachers'],
  certificates: ['Certificados', 'Certificates'],
  auditLogs: ['Logs · Bitácora', 'Logs · Audit trail'],
  settings: ['Configuraciones', 'Settings'],
}

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function ActionButton({ children, Icon, onClick, primary = false }) {
  return (
    <button className={`module-action${primary ? ' module-action--primary' : ''}`} type="button" onClick={onClick}>
      {Icon && <Icon aria-hidden="true" weight="regular" />}
      {children}
    </button>
  )
}

function Item({ action, children, detail }) {
  return (
    <div className="module-item">
      <div className="module-item__copy"><strong>{children}</strong>{detail && <small>{detail}</small>}</div>
      {action}
    </div>
  )
}

function DataTable({ columns, rows }) {
  return (
    <div className="module-table-wrap">
      <table className="module-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={`${rowIndex}-${String(row[0])}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function statusChip(status, language) {
  if (status === 'done') return <ModuleChip tone="ok">{localize(language, 'Dictada', 'Completed')}</ModuleChip>
  if (status === 'active') return <ModuleChip tone="info">{localize(language, 'En curso', 'In progress')}</ModuleChip>
  return <ModuleChip tone="warn">{localize(language, 'Pendiente', 'Pending')}</ModuleChip>
}

function SubjectPicker({ language, navigate, role }) {
  const subjectRole = role === 'profesor' ? 'profesor' : 'estudiante'
  const items = subjectsByRole[subjectRole]

  return (
    <>
      <h1>{subjectRole === 'profesor' ? localize(language, 'Asignaturas que dicto', 'Subjects I teach') : localize(language, 'Mis asignaturas', 'My subjects')}</h1>
      <p className="module-subtitle">{localize(language, 'Toca una asignatura para entrar a su contenido.', 'Choose a subject to open its content.')}</p>
      <div className="subject-grid">
        {items.map((subject) => (
          <button className="subject-card" key={subject.id} type="button" onClick={() => navigate(getAssignmentPath(role, subject.id))}>
            <FunctionIcon aria-hidden="true" weight="regular" />
            <span className="subject-card__name">{subject.title}</span>
            <span className="subject-card__group">{subject.group}</span>
            <ModuleProgress value={subject.progress} />
            <span className="subject-card__cta"><PlayCircle aria-hidden="true" /> {localize(language, 'Entrar', 'Open')}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function UnitCards({ language }) {
  return courseUnits.map((unit) => (
    <ModuleCard key={unit.title} title={unit.title}>
      <div className="module-status-line">{statusChip(unit.status, language)}</div>
      <ModuleProgress value={unit.progress} />
      <ul className="module-list">{unit.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
    </ModuleCard>
  ))
}

function SubjectDetail({ activeTab, assignmentId, language, navigate, role, setActiveTab }) {
  const isTeacher = role === 'profesor'
  const subject = subjectsByRole[isTeacher ? 'profesor' : 'estudiante'].find((item) => item.id === assignmentId)
    ?? subjectsByRole[isTeacher ? 'profesor' : 'estudiante'][0]
  const tabs = isTeacher
    ? [localize(language, 'Vistas', 'Views'), localize(language, 'Contenido de la clase', 'Class content'), localize(language, 'Contenido propio', 'Own content'), localize(language, 'Vista progreso', 'Progress view')]
    : [localize(language, 'Por calendario', 'By calendar'), localize(language, 'Por temas · Temario', 'By topic · Syllabus'), localize(language, 'General de contenido', 'Content overview')]

  let tabContent
  if (activeTab === 0) {
    tabContent = (
      <div className="module-grid">
        <ModuleCard title={localize(language, 'Vista por calendario', 'Calendar view')}>
          {calendarData.program.map(([date, label]) => <ModuleInfoRow key={label} label={date} value={label} />)}
        </ModuleCard>
        {isTeacher && <ModuleCard title={localize(language, 'Vista por contenido', 'Content view')}>{courseUnits.map((unit) => <ModuleInfoRow key={unit.title} label={unit.title} value={`${unit.progress}%`} />)}</ModuleCard>}
      </div>
    )
  } else if (activeTab === 1) {
    tabContent = <div className="module-grid"><UnitCards language={language} /></div>
  } else if (activeTab === 2) {
    tabContent = (
      <div className="module-grid">
        <ModuleCard title={isTeacher ? localize(language, 'Unidades propias', 'Own units') : localize(language, 'Contenido general', 'Content overview')}>
          {courseUnits.map((unit) => <ModuleInfoRow key={unit.title} label={unit.title} value={`${unit.progress}%`} />)}
        </ModuleCard>
        <ModuleCard title={localize(language, 'Syllabus del curso', 'Course syllabus')}><ul className="module-list">{syllabus.map((item) => <li key={item}>{item}</li>)}</ul></ModuleCard>
      </div>
    )
  } else {
    tabContent = (
      <div className="module-grid">
        <ModuleCard title={localize(language, 'Unidades ya dictadas', 'Completed units')}><ModuleInfoRow label={courseUnits[0].title} value="100%" /></ModuleCard>
        <ModuleCard title={localize(language, 'Unidades pendientes', 'Pending units')}>{courseUnits.slice(1).map((unit) => <ModuleInfoRow key={unit.title} label={unit.title} value={`${unit.progress}%`} />)}</ModuleCard>
      </div>
    )
  }

  return (
    <>
      <CoursePresentation
        backLabel={localize(language, 'Todas mis asignaturas', 'All my subjects')}
        grade={localize(language, 'Periodo 2 · 2026', 'Term 2 · 2026')}
        title={`${subject.title} · ${subject.group.split(' · ')[0]}`}
        onBack={() => navigate(getModulePath(role, 'subjects'))}
      />
      <ModuleTabs active={activeTab} items={tabs} onChange={setActiveTab} />
      {tabContent}
      {!isTeacher && (
        <div className="module-grid">
          <ModuleCard title={localize(language, 'Clase de hoy · 10:00 a.m.', "Today's class · 10:00 a.m.")}>
            <ModuleChip tone="info">{localize(language, 'Taller en vivo activo', 'Live workshop active')}</ModuleChip>
            <ModuleInfoRow label={localize(language, 'Taller grupal', 'Group workshop')} value={localize(language, 'Ecuaciones por equipos — Mesa 3', 'Team equations — Table 3')} />
            <ModuleInfoRow label={localize(language, 'Mi resultado', 'My result')} value="7 / 8" />
          </ModuleCard>
          <ModuleCard title={localize(language, 'Tareas', 'Homework')}>
            <Item detail={localize(language, 'Calificada · 12 jul 2026', 'Graded · Jul 12, 2026')} action={<ModuleChip tone="ok">9.0</ModuleChip>}>{localize(language, 'Taller · Términos semejantes', 'Workshop · Like terms')}</Item>
            <Item detail={localize(language, 'Vence 7 ago 2026', 'Due Aug 7, 2026')} action={<ModuleChip tone="warn">{localize(language, 'Pendiente', 'Pending')}</ModuleChip>}>{localize(language, 'Problemas de planteo (PDF)', 'Word problems (PDF)')}</Item>
          </ModuleCard>
        </div>
      )}
    </>
  )
}

function EncyclopediaView({ language }) {
  const rows = [
    [localize(language, 'Vista de exámenes estatales · Saber ICFES', 'State exams · Saber ICFES'), encyclopediaData.state],
    [localize(language, 'Vista por nivel académico', 'By academic level'), encyclopediaData.level],
    [localize(language, 'Vista por temática', 'By topic'), encyclopediaData.topic],
  ]
  return (
    <>
      <h1>{localize(language, 'Enciclopedia', 'Encyclopedia')}</h1>
      <p className="module-subtitle">{localize(language, 'Aprende con el contenido precargado de la plataforma.', 'Learn with the platform’s curated content.')}</p>
      <section className="encyclopedia-hero"><div><ModuleChip tone="warn">{localize(language, 'Destacado · Exámenes estatales', 'Featured · State exams')}</ModuleChip><h2>{localize(language, 'Prepárate para las Pruebas Saber · ICFES', 'Prepare for Saber · ICFES exams')}</h2><p>{localize(language, 'Simulacros cronometrados y banco de preguntas liberadas.', 'Timed practice tests and released question banks.')}</p><ActionButton Icon={Play} primary>{localize(language, 'Empezar a aprender', 'Start learning')}</ActionButton></div></section>
      {rows.map(([title, items]) => <section key={title}><h2>{title}</h2><div className="module-carousel">{items.map((item) => <article className="module-poster" key={item}><PlayCircle aria-hidden="true" /><span>{item}</span></article>)}</div></section>)}
    </>
  )
}

function HelpView({ language, role }) {
  return (
    <>
      <h1>{localize(language, 'Ayuda', 'Help')}</h1>
      <div className="module-grid"><ModuleCard title={localize(language, 'Tutoriales con vídeo', 'Video tutorials')}>{helpData.videos.map((item) => <Item key={item} action={<ModuleChip tone="info">3–5 min</ModuleChip>}><PlayCircle aria-hidden="true" /> {item}</Item>)}</ModuleCard><ModuleCard title={localize(language, 'Tutoriales escritos', 'Written tutorials')}>{helpData.guides.map((item) => <Item key={item}><FileText aria-hidden="true" /> {item}</Item>)}</ModuleCard></div>
      {role === 'admin' && <ModuleCard title={localize(language, 'Generar ticket para soporte', 'Create support ticket')}><label className="module-field"><span>{localize(language, 'Asunto', 'Subject')}</span><input placeholder={localize(language, 'Describe el problema', 'Describe the issue')} /></label><label className="module-field"><span>{localize(language, 'Detalles técnicos', 'Technical details')}</span><textarea rows="3" placeholder={localize(language, 'Dispositivo, navegador, pasos para reproducir…', 'Device, browser, steps to reproduce…')} /></label><ActionButton Icon={PaperPlaneTilt} primary>{localize(language, 'Enviar ticket', 'Send ticket')}</ActionButton></ModuleCard>}
    </>
  )
}

function ProfileView({ language, role }) {
  const profile = prototypeProfiles[role]
  return (
    <>
      <h1>{localize(language, 'Mi perfil', 'My profile')}</h1>
      <div className="module-grid"><ModuleCard title={localize(language, 'Información personal', 'Personal information')}><ModuleInfoRow label={localize(language, 'Nombre', 'Name')} value={profile.name} /><ModuleInfoRow label={localize(language, 'Rol', 'Role')} value={profile.role[language]} />{profile.grade && <ModuleInfoRow label={localize(language, 'Grupo', 'Group')} value={profile.grade} />}{profile.area && <ModuleInfoRow label={localize(language, 'Área', 'Area')} value={profile.area} />}</ModuleCard><ModuleCard title={localize(language, 'Gestor de contraseñas', 'Password manager')}><label className="module-field"><span>{localize(language, 'Contraseña actual', 'Current password')}</span><input type="password" placeholder="••••••••" /></label><label className="module-field"><span>{localize(language, 'Nueva contraseña', 'New password')}</span><input type="password" placeholder={localize(language, 'Mínimo 8 caracteres', 'At least 8 characters')} /></label><ActionButton Icon={Key} primary>{localize(language, 'Cambiar contraseña', 'Change password')}</ActionButton></ModuleCard></div>
      <ModuleCard title={localize(language, 'Accesibilidad', 'Accessibility')}><div className="module-actions"><ActionButton>{localize(language, 'Texto grande', 'Large text')}</ActionButton><ActionButton>{localize(language, 'Alto contraste', 'High contrast')}</ActionButton><ActionButton>{localize(language, 'Leer en voz alta', 'Read aloud')}</ActionButton></div></ModuleCard>
    </>
  )
}

function ClassTodayView({ language }) {
  const connected = students.filter((student) => student.connected)
  const disconnected = students.filter((student) => !student.connected)
  return (
    <><h1>{localize(language, 'Clase de hoy · 8°B · 10:00 a.m.', "Today's class · 8°B · 10:00 a.m.")}</h1><div className="module-grid"><ModuleCard title={localize(language, 'Talleres en vivo', 'Live workshops')}><ModuleInfoRow label={localize(language, 'Taller grupal', 'Group workshop')} value={localize(language, 'Ecuaciones por equipos', 'Team equations')} /><ModuleInfoRow label={localize(language, 'Taller individual', 'Individual workshop')} value={localize(language, 'Ficha de despeje No. 12', 'Solving worksheet No. 12')} /><ActionButton Icon={ProjectorScreen} primary>{localize(language, 'Proyectar resultados', 'Project results')}</ActionButton></ModuleCard><ModuleCard title={localize(language, 'Monitoreo', 'Monitoring')}><ModuleChip tone="ok">{connected.length} {localize(language, 'conectados', 'connected')}</ModuleChip><ModuleChip tone="bad">{disconnected.length} {localize(language, 'sin conectar', 'offline')}</ModuleChip>{disconnected.map((student) => <Item key={student.name} action={<ModuleChip tone="bad">{localize(language, 'Sin conexión', 'Offline')}</ModuleChip>}>{student.name}</Item>)}</ModuleCard></div><ModuleCard title={localize(language, 'Contenido principal — complementario', 'Main and complementary content')}><ModuleInfoRow label={localize(language, 'Compartido en pantalla', 'Shared on screen')} value={localize(language, 'Ecuaciones de primer grado', 'Linear equations')} /><ModuleInfoRow label={localize(language, 'Complementario en tablets', 'Tablet companion')} value={localize(language, 'La balanza de ecuaciones', 'The equation balance')} /></ModuleCard></>
  )
}

function StudentsView({ activeTab, language, role, setActiveTab }) {
  if (role === 'admin') {
    return <><h1>{localize(language, 'Estudiantes', 'Students')}</h1><ModuleCard><DataTable columns={[localize(language, 'Estudiante', 'Student'), localize(language, 'Grupo', 'Group'), localize(language, 'Acciones', 'Actions')]} rows={students.slice(0, 8).map((student) => [student.name, '8°B', <div className="module-actions" key={student.name}><ActionButton>{localize(language, 'Asignar', 'Assign')}</ActionButton><ActionButton Icon={Key}>{localize(language, 'Contraseña', 'Password')}</ActionButton></div>])} /></ModuleCard></>
  }

  const tabs = [localize(language, 'Observaciones', 'Observations'), localize(language, 'Bandeja de mensajes', 'Messages'), localize(language, 'Gestor de contraseñas', 'Password manager')]
  let content
  if (activeTab === 0) content = <ModuleCard title={tabs[0]}>{students.filter((student) => student.observation).map((student) => <Item key={student.name} detail={student.observation}>{student.name}</Item>)}</ModuleCard>
  else if (activeTab === 1) content = <ModuleCard title={tabs[1]}><Item detail={localize(language, '“Profe, ¿la tarea se puede entregar en foto?”', '“Can the homework be submitted as a photo?”')} action={<ModuleChip tone="warn">{localize(language, 'Sin responder', 'Unanswered')}</ModuleChip>}>Ethan Miller</Item><Item detail={localize(language, '“¿El taller grupal cuenta para la nota?”', '“Does the group workshop count toward the grade?”')} action={<ModuleChip tone="ok">{localize(language, 'Respondida', 'Answered')}</ModuleChip>}>Ava Robinson</Item></ModuleCard>
  else content = <ModuleCard title={tabs[2]}>{students.slice(0, 6).map((student) => <Item key={student.name} action={<ActionButton Icon={Key}>{localize(language, 'Restablecer', 'Reset')}</ActionButton>}>{student.name}</Item>)}</ModuleCard>
  return <><h1>{localize(language, 'Estudiantes · 8°B', 'Students · 8°B')}</h1><ModuleTabs active={activeTab} items={tabs} onChange={setActiveTab} />{content}</>
}

function ReportsView({ language, role }) {
  return (
    <><h1>{localize(language, 'Reportes', 'Reports')}</h1><div className="module-grid"><ModuleCard title={localize(language, 'Reporte de notas', 'Grade report')}><div className="module-actions"><ActionButton Icon={FilePdf} primary>{localize(language, 'Boletín institucional', 'Institutional report card')}</ActionButton><ActionButton Icon={FileArrowUp}>{localize(language, 'Reporte plataformas estatales', 'State platform report')}</ActionButton></div></ModuleCard><ModuleCard title={localize(language, 'Reporte de uso del ecosistema', 'Platform usage report')}><ModuleInfoRow label={localize(language, 'Horas activas profesores', 'Teacher active hours')} value={role === 'admin' ? '118 h' : '46 h'} /><ModuleInfoRow label={localize(language, 'Horas activas estudiantes', 'Student active hours')} value={role === 'admin' ? '642 h' : '128 h'} /></ModuleCard></div>{role === 'profesor' && <ModuleCard title={localize(language, 'Reporte por estudiante', 'Student report')}><div className="module-actions">{['Rúbricas', 'Currículum', 'Syllabus', 'General', 'Específico'].map((label) => <ActionButton key={label}>{label}</ActionButton>)}</div><p className="module-subtitle">{localize(language, 'Selecciona un estudiante para generar su reporte.', 'Choose a student to generate a report.')}</p></ModuleCard>}</>
  )
}

function HistoryView({ language }) {
  return <><h1>{localize(language, 'Historial', 'History')}</h1><div className="module-grid"><ModuleCard title={localize(language, 'Mi última actividad', 'My latest activity')}><strong>{teacherHistory[0][1]}</strong><p className="module-subtitle">{teacherHistory[0][0]}</p></ModuleCard><ModuleCard title={localize(language, 'Mi último sitio visitado', 'My latest visited page')}><strong>{localize(language, 'Asignatura → Contenido propio → Evaluaciones', 'Subject → Own content → Evaluations')}</strong><p className="module-subtitle">Hoy 10:40</p></ModuleCard></div><ModuleCard title={localize(language, 'Historial de actividades', 'Activity history')}><DataTable columns={[localize(language, 'Fecha', 'Date'), localize(language, 'Actividad', 'Activity')]} rows={teacherHistory} /></ModuleCard></>
}

function TeachersView({ language }) {
  return <><h1>{localize(language, 'Profesores', 'Teachers')}</h1><ModuleCard><DataTable columns={[localize(language, 'Profesor', 'Teacher'), localize(language, 'Asignaturas', 'Subjects'), localize(language, 'Propias', 'Own'), localize(language, 'Estado', 'Status'), localize(language, 'Acciones', 'Actions')]} rows={teachers.map((teacher) => [teacher.name, teacher.subjects, teacher.own, <ModuleChip key={`${teacher.name}-status`} tone={teacher.active ? 'ok' : 'bad'}>{teacher.active ? localize(language, 'Activo', 'Active') : localize(language, 'Inactivo', 'Inactive')}</ModuleChip>, <div className="module-actions" key={`${teacher.name}-actions`}><ActionButton>{localize(language, 'Asignar', 'Assign')}</ActionButton><ActionButton Icon={Key}>{localize(language, 'Contraseña', 'Password')}</ActionButton></div>])} /></ModuleCard><ModuleCard title={localize(language, 'Control de asignaturas', 'Subject control')}><div className="module-actions"><ActionButton>{localize(language, 'Habilitar / bloquear', 'Enable / block')}</ActionButton><ActionButton Icon={UploadSimple}>{localize(language, 'Importar programas propios', 'Import own programs')}</ActionButton><ActionButton Icon={DownloadSimple}>{localize(language, 'Exportar programas', 'Export programs')}</ActionButton></div></ModuleCard></>
}

function CertificatesView({ language }) {
  const certificates = [localize(language, 'Certificado de curso completado', 'Course completion certificate'), localize(language, 'Certificado de participación', 'Participation certificate'), localize(language, 'Mención de honor — periodo', 'Honor distinction — term')]
  return <><h1>{localize(language, 'Certificados', 'Certificates')}</h1><ModuleCard title={localize(language, 'Plantillas de certificados', 'Certificate templates')}>{certificates.map((certificate) => <Item key={certificate} detail={localize(language, 'Plantilla institucional', 'Institutional template')} action={<ActionButton Icon={SealCheck}>{localize(language, 'Editar', 'Edit')}</ActionButton>}>{certificate}</Item>)}</ModuleCard></>
}

function LogsView({ activeTab, language, setActiveTab }) {
  const tabs = [localize(language, 'Comportamiento de usuarios', 'User behavior'), localize(language, 'Errores · Bugs', 'Errors · Bugs')]
  return <><h1>Logs · {localize(language, 'Bitácora', 'Audit trail')}</h1><ModuleTabs active={activeTab} items={tabs} onChange={setActiveTab} />{activeTab === 0 ? <ModuleCard title={tabs[0]}><DataTable columns={[localize(language, 'Fecha', 'Date'), localize(language, 'Usuario', 'User'), localize(language, 'Evento', 'Event')]} rows={systemLogs.behavior} /></ModuleCard> : <ModuleCard title={tabs[1]}><DataTable columns={[localize(language, 'Fecha', 'Date'), 'ID', localize(language, 'Descripción', 'Description'), localize(language, 'Estado', 'Status')]} rows={systemLogs.errors.map(([date, id, description, status]) => [date, id, description, <ModuleChip key={id} tone={status === 'Corregido' ? 'ok' : 'warn'}>{status}</ModuleChip>])} /></ModuleCard>}</>
}

function SettingsView({ language }) {
  return <><h1>{localize(language, 'Configuraciones', 'Settings')}</h1><div className="module-grid"><ModuleCard title={localize(language, 'Idioma', 'Language')}><label className="module-field"><span>{localize(language, 'Idioma de la plataforma', 'Platform language')}</span><select defaultValue={language}><option value="es">Español (Colombia)</option><option value="en">English</option></select></label></ModuleCard><ModuleCard title={localize(language, 'Parametrización de notas', 'Grade settings')}><ModuleInfoRow label={localize(language, 'Escala', 'Scale')} value="0.0 — 10.0" /><ModuleInfoRow label={localize(language, 'Nota mínima aprobatoria', 'Passing grade')} value="6.0" /><ModuleInfoRow label={localize(language, 'Periodos académicos', 'Academic terms')} value="4" /></ModuleCard></div><div className="module-grid"><ModuleCard title={localize(language, 'Sistema', 'System')}><ActionButton>{localize(language, 'Restaurar versión de fábrica', 'Restore factory version')}</ActionButton></ModuleCard><ModuleCard title={localize(language, 'Versión del software', 'Software version')}><ModuleInfoRow label="AVACOM LMS" value="v2.0.0-prototipo" /><ModuleInfoRow label={localize(language, 'Última actualización', 'Last update')} value="30 jul 2026" /></ModuleCard></div></>
}

function ModulePage({ forcedRole, moduleId }) {
  const navigate = useNavigate()
  const { assignmentId } = useParams()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => setActiveTab(0), [assignmentId, moduleId, role])

  const viewProps = { activeTab, assignmentId, language, navigate, role, setActiveTab }
  let content
  if (moduleId === 'subjects') content = assignmentId ? <SubjectDetail {...viewProps} /> : <SubjectPicker language={language} navigate={navigate} role={role} />
  else if (moduleId === 'encyclopedia') content = <EncyclopediaView language={language} />
  else if (moduleId === 'help') content = <HelpView language={language} role={role} />
  else if (moduleId === 'profile') content = <ProfileView language={language} role={role} />
  else if (moduleId === 'classToday') content = <ClassTodayView language={language} />
  else if (moduleId === 'students') content = <StudentsView {...viewProps} />
  else if (moduleId === 'reports') content = <ReportsView language={language} role={role} />
  else if (moduleId === 'history') content = <HistoryView language={language} />
  else if (moduleId === 'teachers') content = <TeachersView language={language} />
  else if (moduleId === 'certificates') content = <CertificatesView language={language} />
  else if (moduleId === 'auditLogs') content = <LogsView activeTab={activeTab} language={language} setActiveTab={setActiveTab} />
  else content = <SettingsView language={language} />

  const [titleEs, titleEn] = titleByModule[moduleId] ?? titleByModule.settings
  return <ModuleLayout activeModule={moduleId} language={language} role={role} title={localize(language, titleEs, titleEn)}>{content}</ModuleLayout>
}

export default ModulePage
