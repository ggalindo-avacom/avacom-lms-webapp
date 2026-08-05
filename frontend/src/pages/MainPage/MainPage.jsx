import { useNavigate, useSearchParams } from 'react-router-dom'

// `?no-inline` conserva el logo corporativo como un archivo SVG independiente.
import logo from '../../assets/avacom-logo.svg?no-inline'
import DesktopHexMenu from '../../components/organisms/DesktopHexMenu/DesktopHexMenu'
import MainNavbar from '../../components/organisms/MainNavbar/MainNavbar'
import { getMenuItems } from '../../components/organisms/MainMenu/menuItems'
import MenuButtons from '../../components/organisms/MenuButtons/MenuButtons'
import { useLanguage } from '../../i18n/LanguageContext'
import './MainPage.css'

const profiles = {
  estudiante: {
    chip: '#6b6b6b',
    greetingKey: 'main.greeting',
    halfWidth: 1.617,
    initials: 'SR',
    name: 'Samuel',
    roleKey: 'main.studentRole',
  },
  profesor: {
    chip: '#8a6a2f',
    greetingKey: 'main.teacherGreeting',
    halfWidth: 3.2925,
    initials: 'CT',
    name: 'Prof. Claudia',
    roleKey: 'main.teacherRole',
  },
}

function MainPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const role = searchParams.get('role') === 'profesor' ? 'profesor' : 'estudiante'
  const profile = profiles[role]
  const items = getMenuItems(role)
  const handleSignOut = () => navigate('/login', { replace: true })

  return (
    <div className="main-page" style={{ '--cluster-half': profile.halfWidth }}>
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

      <MenuButtons greetingKey={profile.greetingKey} items={items} onSignOut={handleSignOut} />
      <DesktopHexMenu items={items} />
      <MainNavbar role={role} onSignOut={handleSignOut} />
    </div>
  )
}

export default MainPage
