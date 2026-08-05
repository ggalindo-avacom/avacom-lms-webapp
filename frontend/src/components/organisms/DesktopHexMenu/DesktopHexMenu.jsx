import { createElement } from 'react'

import colorHexagon from '../../../assets/mainmenu/ColorHexagon.svg?no-inline'
import { useLanguage } from '../../../i18n/LanguageContext'
import './DesktopHexMenu.css'

function DesktopHexMenu({ items }) {
  const { t } = useLanguage()

  return (
    <main className="desktop-hex-menu">
      <svg className="desktop-hex-menu__defs" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="mainMenuHex" clipPathUnits="objectBoundingBox">
            <path d="M0.42,0.04 Q0.5,0 0.58,0.04 L0.92,0.21 Q1,0.25 1,0.33 L1,0.67 Q1,0.75 0.92,0.79 L0.58,0.96 Q0.5,1 0.42,0.96 L0.08,0.79 Q0,0.75 0,0.67 L0,0.33 Q0,0.25 0.08,0.21 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="desktop-hex-menu__cluster">
        <img className="desktop-hex-menu__background" src={colorHexagon} alt="" aria-hidden="true" />

        {items.map(({ id, Icon, color, labelKey, x, y }) => (
          <div
            key={id}
            className="desktop-hex-menu__cell"
            style={{ '--hex-x': x, '--hex-y': y, '--hex-delay': `${Math.round(Math.hypot(x, y) * 135)}ms` }}
          >
            <div className="desktop-hex-menu__shadow">
              <button className="desktop-hex-menu__button" type="button">
                {createElement(Icon, {
                  'aria-hidden': true,
                  className: 'desktop-hex-menu__icon',
                  color,
                  weight: 'regular',
                })}
                <span>{t(labelKey)}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default DesktopHexMenu
