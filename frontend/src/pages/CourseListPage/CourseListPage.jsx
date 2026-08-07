import { useNavigate, useSearchParams } from 'react-router-dom'

import ModuleBreadcrumb from '../../components/molecules/ModuleBreadcrumb/ModuleBreadcrumb'
import SubjectHive from '../../components/organisms/SubjectHive/SubjectHive'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { subjectsDemoData } from '../../data/subjectsDemoData'
import { useLanguage } from '../../i18n/LanguageContext'
import { getAssignmentPath, getMainMenuPath } from '../../routes/moduleRoutes'
import './CourseListPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Página propia del listado de asignaturas: panal de hexágonos con iconos
   por materia y tarjeta de ayuda en hover. El rol de la demo entra por
   forcedRole o ?role=; los datos llegan con la forma del backend
   (ver src/data/subjectsDemoData.js). */
function CourseListPage({ forcedRole, subjects }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const title = localize(language, 'Asignaturas', 'Subjects')

  /* El estudiante ve todas sus materias; el profesor solo los cursos que
     dicta (asignatura + grupo). */
  const roleSubjects = subjects ?? subjectsDemoData[role] ?? subjectsDemoData.estudiante

  const currentLabel = role === 'profesor'
    ? localize(language, 'Asignaturas que dicto', 'Subjects I teach')
    : localize(language, 'Mis Asignaturas', 'My Subjects')

  return (
    <ModuleLayout activeModule="subjects" language={language} role={role} title={title}>
      {/* Indicador de ubicación: Menú principal / Mis Asignaturas. */}
      <ModuleBreadcrumb
        label={localize(language, 'Ubicación', 'Location')}
        items={[
          { label: localize(language, 'Menú principal', 'Main menu'), onClick: () => navigate(getMainMenuPath(role)) },
          { label: currentLabel },
        ]}
      />

      <h1>{currentLabel}</h1>
      <p className="module-subtitle">
        {localize(language, 'Toca una asignatura para entrar a su contenido.', 'Tap a subject to open its content.')}
      </p>

      <SubjectHive
        language={language}
        subjects={roleSubjects}
        onSelect={(subject) => navigate(getAssignmentPath(role, subject.id))}
      />
    </ModuleLayout>
  )
}

export default CourseListPage
