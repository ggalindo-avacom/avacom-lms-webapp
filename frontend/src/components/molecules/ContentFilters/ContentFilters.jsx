import { ArrowCounterClockwise, FunnelSimple } from '@phosphor-icons/react'

import './ContentFilters.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function pick(language, texts) {
  return language === 'en' ? texts.en : texts.es
}

/* Molécula: filtros de la biblioteca por grado y estándar (país). Emite el
   cambio hacia la página; 'all' significa sin filtro. */
function ContentFilters({ grade, grades, language = 'es', onChange, onReset, standard, standards }) {
  const hasFilters = grade !== 'all' || standard !== 'all'

  return (
    <div className="content-filters" role="group" aria-label={localize(language, 'Filtros de contenido', 'Content filters')}>
      <span className="content-filters__icon" aria-hidden="true"><FunnelSimple weight="bold" /></span>

      <label className="content-filters__field">
        <span>{localize(language, 'Grado', 'Grade')}</span>
        <select value={grade} onChange={(event) => onChange({ grade: event.target.value, standard })}>
          <option value="all">{localize(language, 'Todos los grados', 'All grades')}</option>
          {grades.map((item) => <option key={item.id} value={item.id}>{pick(language, item.label)}</option>)}
        </select>
      </label>

      <label className="content-filters__field">
        <span>{localize(language, 'Estándar', 'Standard')}</span>
        <select value={standard} onChange={(event) => onChange({ grade, standard: event.target.value })}>
          <option value="all">{localize(language, 'Todos los países', 'All countries')}</option>
          {standards.map((item) => <option key={item.id} value={item.id}>{pick(language, item.label)}</option>)}
        </select>
      </label>

      {hasFilters && (
        <button className="content-filters__reset" type="button" onClick={onReset}>
          <ArrowCounterClockwise aria-hidden="true" weight="bold" />
          {localize(language, 'Limpiar', 'Clear')}
        </button>
      )}
    </div>
  )
}

export default ContentFilters
