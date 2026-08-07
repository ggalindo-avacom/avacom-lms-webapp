import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PathIcon, SquaresFour } from '@phosphor-icons/react'

import CoursePresentation from '../../components/molecules/CoursePresentation/CoursePresentation'
import ModuleBreadcrumb from '../../components/molecules/ModuleBreadcrumb/ModuleBreadcrumb'
import ViewModeSwitch from '../../components/molecules/ViewModeSwitch/ViewModeSwitch'
import LearningPath from '../../components/organisms/LearningPath/LearningPath'
import UnitSection from '../../components/organisms/UnitSection/UnitSection'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { courseDetailDemoData } from '../../data/courseDetailDemoData'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { subjectsDemoData } from '../../data/subjectsDemoData'
import { useLanguage } from '../../i18n/LanguageContext'
import { getModulePath } from '../../routes/moduleRoutes'
import './CourseDetailPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function pick(language, texts) {
  if (!texts) return ''
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Página de una asignatura con dos modos: ruta de aprendizaje (por defecto)
   y vista general por unidades. El rol entra por forcedRole o ?role=. */
function CourseDetailPage({ data = courseDetailDemoData, forcedRole }) {
  const navigate = useNavigate()
  const { assignmentId } = useParams()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')

  /* Por defecto se abre en la ruta de aprendizaje. */
  const [mode, setMode] = useState('path')

  /* El nombre sale del catálogo de asignaturas del rol; si el id no está,
     se usa el del curso de la demo. */
  const roleSubjects = subjectsDemoData[role] ?? subjectsDemoData.estudiante
  const subject = roleSubjects.find((item) => item.id === assignmentId)
  const courseName = subject ? pick(language, subject.name) : pick(language, data.course.name)
  const subjectsPath = getModulePath(role, 'subjects')

  return (
    <ModuleLayout activeModule="subjects" language={language} role={role} title={courseName}>
      {/* Ubicación: Mis Asignaturas / Matemáticas */}
      <ModuleBreadcrumb
        label={localize(language, 'Ubicación', 'Location')}
        items={[
          { label: localize(language, 'Mis Asignaturas', 'My Subjects'), onClick: () => navigate(subjectsPath) },
          { label: courseName },
        ]}
      />

      <ViewModeSwitch
        label={localize(language, 'Modo de vista', 'View mode')}
        value={mode}
        onChange={setMode}
        options={[
          { id: 'path', label: localize(language, 'Ruta de aprendizaje', 'Learning path'), icon: <PathIcon aria-hidden="true" weight="duotone" /> },
          { id: 'general', label: localize(language, 'Vista general', 'Course overview'), icon: <SquaresFour aria-hidden="true" weight="duotone" /> },
        ]}
      />

      {mode === 'path' ? (
        <>
          {/* Resumen del avance sobre la ruta. */}
          <section className="course-detail__summary">
            <div>
              <span className="course-detail__eyebrow">{localize(language, 'Tu avance', 'Your progress')}</span>
              <p className="course-detail__today">{pick(language, data.progress.todayNode)}</p>
            </div>
            <div className="course-detail__meter">
              <div className="course-detail__bar"><span style={{ width: `${data.progress.percent}%` }} /></div>
              <strong>{data.progress.percent}%</strong>
              <small>
                {data.progress.completedNodes} {localize(language, 'de', 'of')} {data.progress.totalNodes} {localize(language, 'hitos completados', 'milestones completed')}
              </small>
            </div>
          </section>

          <LearningPath language={language} units={data.units} />
        </>
      ) : (
        <>
          <CoursePresentation
            backLabel={localize(language, 'Mis Asignaturas', 'My Subjects')}
            grade={pick(language, data.course.term)}
            title={`${courseName} · ${data.course.group}`}
            onBack={() => navigate(subjectsPath)}
          />

          {data.units.map((unit) => <UnitSection key={unit.id} language={language} unit={unit} />)}
        </>
      )}
    </ModuleLayout>
  )
}

export default CourseDetailPage
