import { MagnifyingGlass, X } from '@phosphor-icons/react'

import './HelpSearch.css'

/* Molécula de búsqueda controlada, reutilizable en centros de recursos. */
function HelpSearch({ language = 'es', onChange, value }) {
  return (
    <label className="help-search">
      <span className="help-search__label">{language === 'en' ? 'Search the help center' : 'Buscar en el centro de ayuda'}</span>
      <MagnifyingGlass className="help-search__icon" aria-hidden="true" weight="bold" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={language === 'en' ? 'What do you need help with?' : '¿Con qué necesitas ayuda?'}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label={language === 'en' ? 'Clear search' : 'Limpiar búsqueda'}>
          <X aria-hidden="true" weight="bold" />
        </button>
      )}
    </label>
  )
}

export default HelpSearch
