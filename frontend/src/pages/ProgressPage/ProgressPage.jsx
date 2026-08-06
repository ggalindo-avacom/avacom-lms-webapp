import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ClockCountdown, TrendUp, WarningCircle } from '@phosphor-icons/react'

import HexIndicator from '../../components/atoms/HexIndicator/HexIndicator'
import ModuleChip from '../../components/atoms/ModuleChip/ModuleChip'
import ModuleProgress from '../../components/atoms/ModuleProgress/ModuleProgress'
import ModuleCard from '../../components/organisms/ModuleCard/ModuleCard'
import LastClassCard from '../../components/organisms/LastClassCard/LastClassCard'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { progressDemoData } from '../../data/progressDemoData'
import { useLanguage } from '../../i18n/LanguageContext'
import { getAssignmentPath } from '../../routes/moduleRoutes'
import './ProgressPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function pick(language, texts) {
  return language === 'en' ? texts.en : texts.es
}

const toneIcons = {
  ok: CheckCircle,
  info: TrendUp,
  warn: ClockCountdown,
  bad: WarningCircle,
}

/* Colores de marca para los hexágonos según el tono del indicador. */
const toneColors = {
  ok: 'green',
  info: 'violet',
  warn: 'gold',
  bad: 'gold',
}

/* Paso 1: fila tipo dashboard con los indicadores del rol en hexágonos. */
function IndicatorsGrid({ indicators, language }) {
  return (
    <div className="progress-indicators" role="list" aria-label={localize(language, 'Indicadores', 'Indicators')}>
      {indicators.map((indicator) => {
        const Icon = toneIcons[indicator.tone] ?? TrendUp
        return (
          <HexIndicator
            key={indicator.id}
            color={toneColors[indicator.tone] ?? 'green'}
            icon={<Icon weight="duotone" />}
            label={pick(language, indicator.label)}
            value={indicator.value}
            role="listitem"
          />
        )
      })}
    </div>
  )
}

/* Paso 2: progreso por curso para el estudiante. */
function StudentCourses({ courses, language }) {
  return (
    <ModuleCard title={localize(language, 'Mi progreso por curso', 'My progress by course')}>
      <div className="progress-courses">
        {courses.map((course) => (
          <div className="progress-course" key={course.id}>
            <div className="progress-course__head">
              <strong>{course.name} · {course.group}</strong>
              <span>{course.progress}%</span>
            </div>
            <ModuleProgress value={course.progress} />
            <small>{localize(language, 'Nota actual', 'Current grade')}: {course.grade.toFixed(1)}</small>
          </div>
        ))}
      </div>
    </ModuleCard>
  )
}

/* Paso 3: tareas pendientes del estudiante. */
function PendingTasks({ language, tasks }) {
  const formatDue = (isoDate) =>
    new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', { day: 'numeric', month: 'short' }).format(new Date(`${isoDate}T12:00:00`))

  return (
    <ModuleCard title={localize(language, 'Mis tareas pendientes', 'My pending tasks')}>
      {tasks.map((task) => (
        <div className="progress-task" key={task.id}>
          <div className="progress-task__copy">
            <strong>{pick(language, task.title)}</strong>
            <small>{task.course}</small>
          </div>
          <ModuleChip tone={task.status === 'urgent' ? 'bad' : 'warn'}>
            {localize(language, 'Vence', 'Due')} {formatDue(task.dueDate)}
          </ModuleChip>
        </div>
      ))}
    </ModuleCard>
  )
}

/* Paso 4: tabla del profesor con estudiantes en riesgo, separada por curso. */
function FailingByCourse({ groups, language }) {
  return groups.map((group) => (
    <ModuleCard key={group.courseId} title={`${localize(language, 'En riesgo', 'At risk')} · ${group.course}`}>
      <div className="module-table-wrap">
        <table className="module-table progress-table">
          <thead>
            <tr>
              <th>{localize(language, 'Estudiante', 'Student')}</th>
              <th>{localize(language, 'Promedio', 'Average')}</th>
              <th>{localize(language, 'Tareas sin entregar', 'Missing tasks')}</th>
              <th>{localize(language, 'Estado', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {group.students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.average.toFixed(1)}</td>
                <td>{student.pendingTasks}</td>
                <td><ModuleChip tone="bad">{localize(language, 'Fallando', 'Failing')}</ModuleChip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleCard>
  ))
}

/* Paso 5: resumen por curso para el administrador. */
function AdminCoursesOverview({ courses, language }) {
  return (
    <ModuleCard title={localize(language, 'Resumen por curso', 'Course overview')}>
      <div className="module-table-wrap">
        <table className="module-table progress-table">
          <thead>
            <tr>
              <th>{localize(language, 'Curso', 'Course')}</th>
              <th>{localize(language, 'Profesor', 'Teacher')}</th>
              <th>{localize(language, 'Promedio', 'Average')}</th>
              <th>{localize(language, 'En riesgo', 'At risk')}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.course}</td>
                <td>{course.teacher}</td>
                <td>{course.average.toFixed(1)}</td>
                <td><ModuleChip tone={course.atRisk > 1 ? 'warn' : 'ok'}>{course.atRisk}</ModuleChip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleCard>
  )
}

/* Página propia del módulo Progreso. Recibe el rol de la demo por la prop
   forcedRole o por ?role=, y todos los datos entran con la misma forma que
   entregaría el backend (ver src/data/progressDemoData.js). */
function ProgressPage({ data = progressDemoData, forcedRole }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const roleData = data[role] ?? data.estudiante
  const title = localize(language, 'Progreso', 'Progress')

  const cardTitle = role === 'estudiante'
    ? localize(language, 'Tu última clase', 'Your last class')
    : role === 'profesor'
      ? localize(language, 'Tu última clase dictada', 'Your last class taught')
      : localize(language, 'Última clase en la plataforma', 'Latest class on the platform')

  return (
    <ModuleLayout activeModule="progress" language={language} role={role} title={title}>
      <h1>{role === 'profesor' ? localize(language, 'Progreso de mis grupos', 'My groups’ progress') : role === 'admin' ? localize(language, 'Progreso institucional', 'Institutional progress') : localize(language, 'Mi progreso', 'My progress')}</h1>
      <p className="module-subtitle">
        {role === 'estudiante'
          ? localize(language, 'Así vas en tus cursos. ¡Sigue así!', 'This is how your courses are going. Keep it up!')
          : role === 'profesor'
            ? localize(language, 'Indicadores de tus clases y estudiantes que necesitan apoyo.', 'Your class indicators and students who need support.')
            : localize(language, 'Indicadores generales del ecosistema.', 'Platform-wide indicators.')}
      </p>

      {/* La demo enlaza la última clase al curso de Álgebra (courseId del dato). */}
      <LastClassCard
        language={language}
        lastClass={roleData.lastClass}
        title={cardTitle}
        onOpenClass={() => navigate(getAssignmentPath(role, roleData.lastClass.courseId))}
      />

      <IndicatorsGrid indicators={roleData.indicators} language={language} />

      {role === 'estudiante' && (
        <div className="module-grid">
          <StudentCourses courses={roleData.courses} language={language} />
          <PendingTasks language={language} tasks={roleData.pendingTasks} />
        </div>
      )}

      {role === 'profesor' && <FailingByCourse groups={roleData.failingByCourse} language={language} />}

      {role === 'admin' && <AdminCoursesOverview courses={roleData.coursesOverview} language={language} />}
    </ModuleLayout>
  )
}

export default ProgressPage
