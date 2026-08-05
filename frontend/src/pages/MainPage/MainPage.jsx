import { useNavigate } from 'react-router-dom'
import { createElement } from 'react'
import {
  Bell,
  BookOpen,
  Books,
  CalendarDots,
  ChartLineUp,
  Question,
  SignOut,
  User,
} from '@phosphor-icons/react'

// `?no-inline` conserva el logo corporativo como un archivo SVG independiente.
import logo from '../../assets/avacom-logo.svg?no-inline'
import MainNavbar from '../../components/organisms/MainNavbar/MainNavbar'
import { useLanguage } from '../../i18n/LanguageContext'
import './MainPage.css'

const menuItems = [
  { id: 'subjects', Icon: BookOpen, color: '#e5282c', labelKey: 'main.subjects' },
  { id: 'encyclopedia', Icon: Books, color: '#f2c600', labelKey: 'main.encyclopedia' },
  { id: 'progress', Icon: ChartLineUp, color: '#a62080', labelKey: 'main.progress' },
  { id: 'calendar', Icon: CalendarDots, color: '#009c60', labelKey: 'main.calendar' },
  { id: 'communication', Icon: Bell, color: '#c8222f', labelKey: 'main.communication' },
  { id: 'help', Icon: Question, color: '#15a3dd', labelKey: 'main.help' },
  { id: 'profile', Icon: User, color: '#18181b', labelKey: 'main.profile' },
]

function MainPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="main-page">
      <header className="main-page__header">
        <div className="main-page__brand">
          <img src={logo} alt="AVACOM" />
          <span>CLASSROOM</span>
        </div>
        <div className="main-page__user" aria-label="Samuel, Estudiante">
          <span className="main-page__avatar" aria-hidden="true">SR</span>
          <span><strong>Samuel</strong><small>Estudiante</small></span>
        </div>
      </header>

      <main className="main-page__content">
        <h1>{t('main.greeting')}</h1>
        <p>{t('main.prompt')}</p>
        <div className="main-page__grid">
          {menuItems.map(({ id, Icon, color, labelKey }) => (
            <button key={id} className="main-page__item" type="button">
              {createElement(Icon, {
                'aria-hidden': true,
                className: 'main-page__icon',
                color,
                weight: 'regular',
              })}
              <span>{t(labelKey)}</span>
            </button>
          ))}
          <button className="main-page__item main-page__item--logout" type="button" onClick={() => navigate('/login', { replace: true })}>
            <SignOut className="main-page__icon" color="#e5262b" weight="regular" aria-hidden="true" />
            <span>{t('main.signOut')}</span>
          </button>
        </div>
      </main>
      <MainNavbar onSignOut={() => navigate('/login', { replace: true })} />
    </div>
  )
}

export default MainPage
