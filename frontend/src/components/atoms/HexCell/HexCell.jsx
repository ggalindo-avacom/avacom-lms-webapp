import { useId } from 'react'

import './HexCell.css'

/* Silueta hexagonal de punta redonda del UI kit AVACOM. */
const HEX_PATH = 'M0.42,0.04 Q0.5,0 0.58,0.04 L0.92,0.21 Q1,0.25 1,0.33 L1,0.67 Q1,0.75 0.92,0.79 L0.58,0.96 Q0.5,1 0.42,0.96 L0.08,0.79 Q0,0.75 0,0.67 L0,0.33 Q0,0.25 0.08,0.21 Z'

/* Átomo: botón hexagonal con icono + etiqueta, usado en el panal de
   asignaturas y reutilizable en cualquier lanzador de módulos. */
function HexCell({ accent = '#3f3f46', icon, label, onBlur, onClick, onFocus, onPointerEnter, onPointerLeave }) {
  const clipId = `hexcell-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  return (
    <div
      className="hex-cell"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={HEX_PATH} />
          </clipPath>
        </defs>
      </svg>

      <button
        className="hex-cell__button"
        type="button"
        style={{ clipPath: `url(#${clipId})` }}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
      >
        <span className="hex-cell__icon" style={{ color: accent }} aria-hidden="true">{icon}</span>
        <span className="hex-cell__label">{label}</span>
      </button>
    </div>
  )
}

export default HexCell
