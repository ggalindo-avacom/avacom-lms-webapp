import { createElement } from 'react'
import { SignOut } from '@phosphor-icons/react'

import { useLanguage } from '../../../i18n/LanguageContext'
import './MenuButtons.css'

function MenuButtons({ greetingKey, items, onSignOut }) {
  const { t } = useLanguage()

  return (
    <main className={`main-page__content${items.length > 7 ? ' main-page__content--extended' : ''}`}>
      <h1>{t(greetingKey)}</h1>
      <p>{t('main.prompt')}</p>
      <div className="main-page__grid">
        {items.map(({ id, Icon, color, labelKey }) => (
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
        <button className="main-page__item main-page__item--logout" type="button" onClick={onSignOut}>
          <SignOut className="main-page__icon" color="#e5262b" weight="regular" aria-hidden="true" />
          <span>{t('main.signOut')}</span>
        </button>
      </div>
    </main>
  )
}

export default MenuButtons
