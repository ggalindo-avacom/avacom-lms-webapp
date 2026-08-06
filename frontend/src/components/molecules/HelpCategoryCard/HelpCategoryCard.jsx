import { ChatCircle, ChartLineUp, Gear, Key, RocketLaunch, Student } from '@phosphor-icons/react'

import './HelpCategoryCard.css'

const icons = { chat: ChatCircle, class: Student, key: Key, progress: ChartLineUp, rocket: RocketLaunch, settings: Gear }

function pick(language, texts) {
  return language === 'en' ? texts.en : texts.es
}

/* Molécula: categoría compacta del centro de ayuda. */
function HelpCategoryCard({ active, category, count, language = 'es', onSelect }) {
  const Icon = icons[category.icon] ?? RocketLaunch

  return (
    <button
      className={`help-category help-category--${category.color}${active ? ' is-active' : ''}`}
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(category.id)}
    >
      <span className="help-category__icon"><Icon aria-hidden="true" weight="duotone" /></span>
      <strong>{pick(language, category.label)}</strong>
      <small>{pick(language, category.description)}</small>
      <i>{count}</i>
    </button>
  )
}

export default HelpCategoryCard
