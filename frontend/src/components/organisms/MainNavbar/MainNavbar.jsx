import { createElement, useState } from 'react'
import {
  BookOpen,
  Books,
  CaretDoubleRight,
  Question,
  SignOut,
  SquaresFour,
  User,
} from '@phosphor-icons/react'

import logoSymbol from '../../../assets/avacom-symbol.svg?no-inline'
import { useLanguage } from '../../../i18n/LanguageContext'
import './MainNavbar.css'

const STORAGE_KEY = 'avacom.menu.navOpen'

const navItems = [
  { id: 'menu', Icon: SquaresFour, labelKey: 'main.menu' },
  { id: 'subjects', Icon: BookOpen, labelKey: 'main.subjects' },
  { id: 'encyclopedia', Icon: Books, labelKey: 'main.encyclopedia' },
  { id: 'profile', Icon: User, labelKey: 'main.profile' },
  { id: 'help', Icon: Question, labelKey: 'main.help' },
  { id: 'logout', Icon: SignOut, labelKey: 'main.signOut' },
]

function readInitialState() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function MainNavbar({ onSignOut }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(readInitialState)

  const toggle = () => {
    setOpen((current) => {
      const next = !current
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        // El navbar sigue funcionando aunque el navegador no permita guardar.
      }
      return next
    })
  }

  const handleItemClick = (id) => {
    if (id === 'logout') onSignOut()
  }

  const toggleLabel = open ? t('main.navCollapse') : t('main.navExpand')

  return (
    <nav className="main-navbar" aria-label={t('main.navAria')}>
      <div className={`main-navbar__pill${open ? ' is-open' : ''}`}>
        <button className="main-navbar__home" type="button" onClick={toggle} aria-label={toggleLabel} aria-expanded={open}>
          <img src={logoSymbol} alt="" />
        </button>

        <div className="main-navbar__clip" aria-hidden={!open}>
          <div className="main-navbar__items">
            {navItems.map(({ id, Icon, labelKey }, index) => (
              <button
                key={id}
                className="main-navbar__item"
                type="button"
                title={t(labelKey)}
                tabIndex={open ? 0 : -1}
                style={{ '--item-delay': `${90 + index * 55}ms`, '--item-close-delay': `${(navItems.length - 1 - index) * 22}ms` }}
                onClick={() => handleItemClick(id)}
              >
                {createElement(Icon, {
                  'aria-hidden': true,
                  className: 'main-navbar__icon',
                  weight: 'regular',
                })}
                <span>{t(labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="main-navbar__toggle" type="button" onClick={toggle} aria-label={toggleLabel} aria-expanded={open}>
          <CaretDoubleRight className={`main-navbar__toggle-icon${open ? ' is-open' : ''}`} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

export default MainNavbar
