import { useId } from 'react'

import './HexBadge.css'

/* Misma silueta hexagonal redondeada del UI kit (menú principal y
   HexIndicator), escalable por objectBoundingBox. */
const HEX_PATH = 'M0.42,0.04 Q0.5,0 0.58,0.04 L0.92,0.21 Q1,0.25 1,0.33 L1,0.67 Q1,0.75 0.92,0.79 L0.58,0.96 Q0.5,1 0.42,0.96 L0.08,0.79 Q0,0.75 0,0.67 L0,0.33 Q0,0.25 0.08,0.21 Z'

/* Átomo: insignia hexagonal con borde sólido de color y sombra ligera, para
   acompañar ítems (notificaciones, avatares, listas). children = icono o
   texto corto. color: 'gold' | 'green' | 'violet'. */
function HexBadge({ children, color = 'violet', size = 'md', ...rest }) {
  const clipId = `hexbadge-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  return (
    <span className={`hex-badge hex-badge--${color} hex-badge--${size}`} aria-hidden="true" {...rest}>
      <svg width="0" height="0" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={HEX_PATH} />
          </clipPath>
        </defs>
      </svg>
      <span className="hex-badge__shape" style={{ clipPath: `url(#${clipId})` }}>
        <span className="hex-badge__face" style={{ clipPath: `url(#${clipId})` }}>
          {children}
        </span>
      </span>
    </span>
  )
}

export default HexBadge
