import { CaretRight } from '@phosphor-icons/react'

import './ModuleBreadcrumb.css'

/* Molécula: indicador de ubicación (Menú principal / Mis Asignaturas).
   items = [{ label, onClick? }]; el último es la página actual. */
function ModuleBreadcrumb({ items, label = 'Ubicación' }) {
  return (
    <nav className="module-breadcrumb" aria-label={label}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span className="module-breadcrumb__step" key={item.label}>
            {index > 0 && <CaretRight className="module-breadcrumb__sep" aria-hidden="true" weight="bold" />}
            {isLast || !item.onClick
              ? <span className="module-breadcrumb__current" aria-current="page">{item.label}</span>
              : <button className="module-breadcrumb__link" type="button" onClick={item.onClick}>{item.label}</button>}
          </span>
        )
      })}
    </nav>
  )
}

export default ModuleBreadcrumb
