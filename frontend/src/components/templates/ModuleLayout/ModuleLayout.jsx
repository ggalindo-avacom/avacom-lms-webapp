import { useNavigate } from 'react-router-dom'

import logo from '../../../assets/avacom-logo.svg?no-inline'
import { prototypeProfiles } from '../../../data/lmsPrototypeData'
import { getModulePath } from '../../../routes/moduleRoutes'
import { clearSession } from '../../../utils/tokenStorage'
import MainNavbar from '../../organisms/MainNavbar/MainNavbar'
import ModuleDock from '../../organisms/ModuleDock/ModuleDock'
import './ModuleLayout.css'

function ModuleLayout({ activeModule, children, language, logoSrc = logo, navigation = 'dock', role, title, variant }) {
  const navigate = useNavigate()
  const profile = prototypeProfiles[role] ?? prototypeProfiles.estudiante
  const onNavigate = (moduleId) => navigate(getModulePath(role, moduleId))
  const onSignOut = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className={`module-shell${variant ? ` module-shell--${variant}` : ''}`}>
      <header className="module-topbar">
        <strong className="module-topbar__title">{title}</strong>
        <img className="module-topbar__logo" src={logoSrc} alt="AVACOM" />
        <div className="module-topbar__user" aria-label={`${profile.shortName}, ${profile.role[language]}`}>
          <span className="module-topbar__avatar" style={{ backgroundColor: profile.chip }} aria-hidden="true">{profile.initials}</span>
          <span><strong>{profile.shortName}</strong><small>{profile.role[language]}</small></span>
        </div>
      </header>

      <main className="module-content">{children}</main>

      {navigation === 'main' ? (
        <MainNavbar role={role} onNavigate={onNavigate} onSignOut={onSignOut} />
      ) : (
        <ModuleDock
          activeModule={activeModule}
          language={language}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
          role={role}
        />
      )}
    </div>
  )
}

export default ModuleLayout
