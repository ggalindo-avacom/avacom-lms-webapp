import { useNavigate, useSearchParams } from 'react-router-dom'

// `?no-inline` conserva el logo corporativo como un archivo SVG independiente.
import logo from '../../assets/avacom-logo.svg?no-inline'
import DesktopHexMenu from '../../components/organisms/DesktopHexMenu/DesktopHexMenu'
import MainNavbar from '../../components/organisms/MainNavbar/MainNavbar'
import { getMenuItems } from '../../components/organisms/MainMenu/menuItems'
import ResponsiveHexMenu from '../../components/organisms/ResponsiveHexMenu/ResponsiveHexMenu'
import { useLanguage } from '../../i18n/LanguageContext'
import { getModulePath } from '../../routes/moduleRoutes'
import './MainPage.css'

const profiles = {
  admin: {
    chip: '#7b2f75',
    clusterHeight: 3.1,
    greetingKey: 'main.adminGreeting',
    halfWidth: 1.617,
    initials: 'MJ',
    name: 'Michael',
    roleKey: 'main.adminRole',
  },
  estudiante: {
    chip: '#6b6b6b',
    clusterHeight: 3.1,
    greetingKey: 'main.greeting',
    halfWidth: 1.617,
    initials: 'EM',
    name: 'Ethan',
    roleKey: 'main.studentRole',
  },
  profesor: {
    chip: '#8a6a2f',
    clusterHeight: 5.046,
    greetingKey: 'main.teacherGreeting',
    halfWidth: 2.734,
    initials: 'EC',
    name: 'Ms. Carter',
    roleKey: 'main.teacherRole',
  },
}

function MainPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = profiles[requestedRole] ? requestedRole : 'estudiante'
  const profile = profiles[role]
  const items = getMenuItems(role)
  const handleSignOut = () => navigate('/login', { replace: true })
  const handleModuleSelect = (moduleId) => navigate(getModulePath(role, moduleId))

  return (
    <div className="main-page" style={{ '--cluster-half': profile.halfWidth, '--cluster-height': profile.clusterHeight }}>
      <header className="main-page__header">
        <div className="main-page__brand">
          <img src={logo} alt="AVACOM" />
          <span>CLASSROOM</span>
        </div>
        <div className="main-page__user" aria-label={`${profile.name}, ${t(profile.roleKey)}`}>
          <span className="main-page__avatar" style={{ backgroundColor: profile.chip }} aria-hidden="true">{profile.initials}</span>
          <span><strong>{profile.name}</strong><small>{t(profile.roleKey)}</small></span>
        </div>
      </header>

      <ResponsiveHexMenu greetingKey={profile.greetingKey} items={items} onSelect={handleModuleSelect} onSignOut={handleSignOut} role={role} />
      <DesktopHexMenu items={items} onSelect={handleModuleSelect} />
      <MainNavbar role={role} onNavigate={handleModuleSelect} onSignOut={handleSignOut} />
    </div>
  )
}

export default MainPage
