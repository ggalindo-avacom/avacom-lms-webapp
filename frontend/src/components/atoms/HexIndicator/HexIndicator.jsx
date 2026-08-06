import { useId } from 'react'

import './HexIndicator.css'

/* Hexágono con esquinas redondeadas del UI kit de AVACOM (misma silueta que
   el menú principal). clipPathUnits en objectBoundingBox lo hace escalable. */
const HEX_PATH = 'M0.42,0.04 Q0.5,0 0.58,0.04 L0.92,0.21 Q1,0.25 1,0.33 L1,0.67 Q1,0.75 0.92,0.79 L0.58,0.96 Q0.5,1 0.42,0.96 L0.08,0.79 Q0,0.75 0,0.67 L0,0.33 Q0,0.25 0.08,0.21 Z'

/* Átomo reutilizable: indicador hexagonal con borde sólido de color y sombra
   ligera. color: 'gold' (#F3C701) | 'green' (#019D60) | 'violet' (#A81D81). */
function HexIndicator({ color = 'green', icon = null, label, value, ...rest }) {
  /* Cada instancia registra su propio clipPath; useId trae ':' que rompe
     url(#...), por eso se limpia. */
  const clipId = `hex-clip-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  return (
    <article className={`hex-indicator hex-indicator--${color}`} {...rest}>
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={HEX_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Capa exterior = borde sólido; capa interior = cara blanca. */}
      <div className="hex-indicator__shape" style={{ clipPath: `url(#${clipId})` }}>
        <div className="hex-indicator__face" style={{ clipPath: `url(#${clipId})` }}>
          {icon && <span className="hex-indicator__icon" aria-hidden="true">{icon}</span>}
          <strong className="hex-indicator__value">{value}</strong>
          <span className="hex-indicator__label">{label}</span>
        </div>
      </div>
    </article>
  )
}

export default HexIndicator
