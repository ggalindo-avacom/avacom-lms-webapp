import { createElement } from 'react'
import { SignOut } from '@phosphor-icons/react'

import colorHexagon from '../../../assets/mainmenu/ColorHexagon.svg?no-inline'
import { useLanguage } from '../../../i18n/LanguageContext'
import './ResponsiveHexMenu.css'

const CORE_X_LIMIT = 1.117
const CORE_Y_LIMIT = 0.973

function groupByLevel(items) {
  return [...items]
    .sort((first, second) => first.y - second.y || first.x - second.x)
    .reduce((rows, item) => {
      const currentRow = rows.at(-1)
      if (!currentRow || Math.abs(currentRow[0].y - item.y) > 0.001) rows.push([item])
      else currentRow.push(item)
      return rows
    }, [])
}

function chunkItems(items, size = 2) {
  const chunks = []
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size))
  return chunks
}

function ResponsiveHexButton({ item, label, order, onClick }) {
  const { Icon, color } = item

  return (
    <div className="responsive-hex-menu__cell" style={{ '--responsive-delay': `${order * 55}ms` }}>
      <div className="responsive-hex-menu__shadow">
        <button className="responsive-hex-menu__button" type="button" onClick={onClick}>
          {createElement(Icon, {
            'aria-hidden': true,
            className: 'responsive-hex-menu__icon',
            color,
            weight: 'regular',
          })}
          <span>{label}</span>
        </button>
      </div>
    </div>
  )
}

function ResponsiveHexMenu({ greetingKey, items, onSelect, onSignOut, role }) {
  const { t } = useLanguage()
  const visibleItems = items.filter(({ hideInHexMenu }) => !hideInHexMenu)
  const coreItems = visibleItems.filter(({ x, y }) => Math.abs(x) <= CORE_X_LIMIT && Math.abs(y) <= CORE_Y_LIMIT)
  const extraItems = visibleItems
    .filter((item) => !coreItems.includes(item))
    .sort((first, second) => first.y - second.y || first.x - second.x)
  const coreRows = groupByLevel(coreItems)
  const extraRows = chunkItems(extraItems)
  const itemOrder = new Map(visibleItems.map((item, index) => [item.id, index]))
  const signOutItem = { id: 'logout', Icon: SignOut, color: '#e5262b', labelKey: 'main.signOut' }
  const findExtraItem = (id) => extraItems.find((item) => item.id === id)
  const renderedExtraRows = role === 'profesor'
    ? [
        [findExtraItem('reports'), findExtraItem('attendance')].filter(Boolean),
        [signOutItem],
        [findExtraItem('history'), findExtraItem('students')].filter(Boolean),
      ]
    : extraRows

  const renderRow = (row, rowKey) => (
    <div className="responsive-hex-menu__row" key={rowKey}>
      {row.map((item) => (
        <ResponsiveHexButton
          item={item}
          key={item.id}
          label={t(item.labelKey)}
          onClick={item.id === 'logout' ? onSignOut : () => onSelect?.(item.id)}
          order={itemOrder.get(item.id) ?? visibleItems.length}
        />
      ))}
    </div>
  )

  return (
    <main className={`responsive-hex-menu responsive-hex-menu--${role}`}>
      <svg className="responsive-hex-menu__defs" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="responsiveMainMenuHex" clipPathUnits="objectBoundingBox">
            <path d="M0.43,0.025 Q0.5,0 0.57,0.025 L0.9,0.19 Q0.99,0.235 0.99,0.335 L0.99,0.665 Q0.99,0.765 0.9,0.81 L0.57,0.975 Q0.5,1 0.43,0.975 L0.1,0.81 Q0.01,0.765 0.01,0.665 L0.01,0.335 Q0.01,0.235 0.1,0.19 Z" />
          </clipPath>
        </defs>
      </svg>

      <header className="responsive-hex-menu__intro">
        <h1>{t(greetingKey)}</h1>
        <p>{t('main.prompt')}</p>
      </header>

      <section className="responsive-hex-menu__core" aria-label={t('main.menu')}>
        <img className="responsive-hex-menu__background" src={colorHexagon} alt="" aria-hidden="true" />
        <div className="responsive-hex-menu__rows">
          {coreRows.map((row, index) => renderRow(row, `core-${index}`))}
        </div>
      </section>

      {renderedExtraRows.length > 0 && (
        <section className={`responsive-hex-menu__extra responsive-hex-menu__extra--${role}`} aria-label={t('main.menu')}>
          {renderedExtraRows.map((row, index) => renderRow(row, `extra-${index}`))}
        </section>
      )}

      {role !== 'profesor' && (
        <div className="responsive-hex-menu__logout">
          <ResponsiveHexButton
            item={signOutItem}
            label={t('main.signOut')}
            onClick={onSignOut}
            order={visibleItems.length}
          />
        </div>
      )}
    </main>
  )
}

export default ResponsiveHexMenu
