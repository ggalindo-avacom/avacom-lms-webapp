import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Key, LockKey, PaperPlaneTilt } from '@phosphor-icons/react'

import Input from '../../components/atoms/Input/Input'
import SteppedCard from '../../components/molecules/SteppedCard/SteppedCard'
import TeachingCourseCard from '../../components/molecules/TeachingCourseCard/TeachingCourseCard'
import AccessibilityCard from '../../components/organisms/AccessibilityCard/AccessibilityCard'
import ProfileIdentity from '../../components/organisms/ProfileIdentity/ProfileIdentity'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { profileDemoData } from '../../data/profileDemoData'
import { useLanguage } from '../../i18n/LanguageContext'
import { getAssignmentPath } from '../../routes/moduleRoutes'
import './ProfilePage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

const defaultAccessibility = { highContrast: false, largeText: false, reducedMotion: false }

/* View reutilizable del perfil.
   - data contiene perfiles, capacidades, cursos y opciones accesibles.
   - forcedRole habilita demos controladas; producción debe usar el rol JWT.
   - los callbacks conectan endpoints sin acoplar la UI a un cliente HTTP.
   - ninguna contraseña se guarda en la data ni en almacenamiento local. */
function ProfilePage({
  data = profileDemoData,
  forcedRole,
  initialAccessibility = defaultAccessibility,
  onAccessibilityChange,
  onCourseOpen,
  onRecoveryRequest,
  onStudentPasswordReset,
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (data.profiles[requestedRole] ? requestedRole : 'estudiante')
  const profile = data.profiles[role]
  const capabilities = data.capabilitiesByRole[role]
  const [recoveryEmail, setRecoveryEmail] = useState(profile.email)
  const [studentEmail, setStudentEmail] = useState('')
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [accessibility, setAccessibility] = useState(initialAccessibility)
  const [notice, setNotice] = useState('')

  const openCourse = (course) => {
    onCourseOpen?.(course, { role })
    if (!onCourseOpen) navigate(getAssignmentPath(role, course.id))
  }

  const requestRecovery = (event) => {
    event.preventDefault()
    onRecoveryRequest?.({ email: recoveryEmail }, { role })
    setNotice(localize(language, 'Si la cuenta existe, enviaremos instrucciones seguras al correo indicado.', 'If the account exists, secure instructions will be sent to that email.'))
  }

  const resetStudentPassword = (event) => {
    event.preventDefault()
    onStudentPasswordReset?.({ studentEmail, temporaryPassword }, { role })
    setTemporaryPassword('')
    setNotice(localize(language, 'Contraseña temporal lista para asignar. El estudiante deberá cambiarla al ingresar.', 'Temporary password ready to assign. The student must change it after signing in.'))
  }

  const toggleAccessibility = (id) => {
    setAccessibility((current) => {
      const next = { ...current, [id]: !current[id] }
      onAccessibilityChange?.(next, { role })
      return next
    })
  }

  const readAloud = () => {
    const text = localize(
      language,
      `Perfil de ${profile.name}. Rol: ${profile.role.es}. Cuenta ${profile.status.es}.`,
      `Profile for ${profile.name}. Role: ${profile.role.en}. Account ${profile.status.en}.`,
    )
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
      setNotice(localize(language, 'Lectura en voz alta iniciada.', 'Read-aloud started.'))
    } else {
      setNotice(localize(language, 'La lectura en voz alta no está disponible en este dispositivo.', 'Read-aloud is not available on this device.'))
    }
  }

  const pageClasses = [
    'profile-page',
    accessibility.largeText && 'profile-page--large-text',
    accessibility.highContrast && 'profile-page--high-contrast',
    accessibility.reducedMotion && 'profile-page--reduced-motion',
  ].filter(Boolean).join(' ')

  return (
    <ModuleLayout activeModule="profile" language={language} navigation="main" role={role} title={localize(language, 'Mi perfil', 'My profile')}>
      <div className={pageClasses}>
        <header className="profile-page__intro">
          <div>
            <span>{localize(language, 'Tu espacio personal', 'Your personal space')}</span>
            <h1>{localize(language, 'Mi perfil', 'My profile')}</h1>
            <p>{localize(language, 'Información clara, seguridad de cuenta y herramientas para aprender cómodamente.', 'Clear information, account security and tools to learn comfortably.')}</p>
          </div>
          <LockKey aria-hidden="true" weight="duotone" />
        </header>

        <ProfileIdentity language={language} profile={profile} />

        {capabilities.canViewTeachingCourses && (
          <section className="profile-courses" aria-labelledby="profile-courses-title">
            <div className="profile-section-heading">
              <div>
                <span>{localize(language, 'Acceso rápido', 'Quick access')}</span>
                <h2 id="profile-courses-title">{localize(language, 'Asignaturas que dictas', 'Subjects you teach')}</h2>
              </div>
              <strong>{data.teachingCourses.length}</strong>
            </div>
            <div className="profile-courses__grid">
              {data.teachingCourses.map((course) => (
                <TeachingCourseCard key={course.id} course={course} language={language} onOpen={openCourse} />
              ))}
            </div>
          </section>
        )}

        {notice && (
          <p className="profile-page__notice" role="status">
            <CheckCircle aria-hidden="true" weight="fill" /> {notice}
          </p>
        )}

        <div className="profile-page__tools">
          {capabilities.canRequestOwnRecovery && (
            <SteppedCard
              eyebrow={localize(language, 'Cuenta segura', 'Secure account')}
              title={localize(language, role === 'profesor' ? 'Recuperar mi cuenta de profesor' : 'Recuperar mi cuenta', role === 'profesor' ? 'Recover my teacher account' : 'Recover my account')}
              description={localize(language, 'Te enviaremos un enlace de un solo uso. La respuesta nunca confirma si el correo está registrado.', 'We will send a one-time link. The response never confirms whether the email is registered.')}
            >
              <form onSubmit={requestRecovery}>
                <Input
                  id="profile-recovery-email"
                  label={localize(language, 'Correo de la cuenta', 'Account email')}
                  type="email"
                  autoComplete="email"
                  required
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                />
                <button type="submit"><PaperPlaneTilt aria-hidden="true" weight="fill" /> {localize(language, 'Enviar instrucciones', 'Send instructions')}</button>
              </form>
            </SteppedCard>
          )}

          {capabilities.canResetStudentPassword && (
            <SteppedCard
              eyebrow={localize(language, 'Ayuda a un estudiante', 'Help a student')}
              title={localize(language, 'Asignar contraseña temporal', 'Assign temporary password')}
              description={localize(language, 'Solo puedes gestionar estudiantes de tus cursos. La contraseña no se mostrará de nuevo.', 'You can only manage students in your courses. The password will not be shown again.')}
            >
              <form onSubmit={resetStudentPassword}>
                <Input
                  id="student-account-email"
                  label={localize(language, 'Correo del estudiante', 'Student email')}
                  type="email"
                  autoComplete="off"
                  placeholder="estudiante@avacom.edu"
                  required
                  value={studentEmail}
                  onChange={(event) => setStudentEmail(event.target.value)}
                />
                <Input
                  id="student-temporary-password"
                  label={localize(language, 'Contraseña temporal', 'Temporary password')}
                  type="password"
                  autoComplete="new-password"
                  minLength="8"
                  placeholder={localize(language, 'Mínimo 8 caracteres', 'At least 8 characters')}
                  required
                  value={temporaryPassword}
                  onChange={(event) => setTemporaryPassword(event.target.value)}
                />
                <button type="submit"><Key aria-hidden="true" weight="fill" /> {localize(language, 'Asignar de forma segura', 'Assign securely')}</button>
              </form>
            </SteppedCard>
          )}

          <AccessibilityCard
            language={language}
            options={data.accessibilityOptions}
            settings={accessibility}
            onReadAloud={readAloud}
            onToggle={toggleAccessibility}
          />
        </div>
      </div>
    </ModuleLayout>
  )
}

export default ProfilePage
