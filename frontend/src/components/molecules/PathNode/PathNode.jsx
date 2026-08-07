import { useId } from 'react'
import { Books, Exam } from '@phosphor-icons/react'

import './PathNode.css'

/* Misma silueta hexagonal del kit; el trazo del anillo usa el mismo contorno
   con pathLength=100 para poder mostrar el avance como dasharray. */
const HEX_PATH = 'M0.42,0.04 Q0.5,0 0.58,0.04 L0.92,0.21 Q1,0.25 1,0.33 L1,0.67 Q1,0.75 0.92,0.79 L0.58,0.96 Q0.5,1 0.42,0.96 L0.08,0.79 Q0,0.75 0,0.67 L0,0.33 Q0,0.25 0.08,0.21 Z'
const RING_PATH = 'M57.56 7.54 L89.69 26.1 Q97.25 30.46 97.25 39.19 L97.25 76.28 Q97.25 85.01 89.69 89.37 L57.56 107.93 Q50 112.29 42.44 107.93 L10.31 89.37 Q2.75 85.01 2.75 76.28 L2.75 39.19 Q2.75 30.46 10.31 26.1 L42.44 7.54 Q50 3.18 57.56 7.54 Z'

const iconByKind = { exam: Exam, topic: Books }

/* Molécula: hito hexagonal de la ruta de aprendizaje. status define el color
   (unidad / gris bloqueado) y ring el avance del contorno verde. */
function PathNode({ color, kind = 'topic', label, onSelect, ring = 0, status = 'locked', title }) {
  const clipId = `pathnode-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  const Icon = iconByKind[kind] ?? Books
  const background = status === 'locked' ? '#808080' : color

  return (
    <div className={`path-node path-node--${status}`}>
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={HEX_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Halo que late en el hito actual. */}
      {status === 'current' && (
        <span className="path-node__pulse" style={{ background, clipPath: `url(#${clipId})` }} aria-hidden="true" />
      )}

      <div className="path-node__shape">
        <button
          className="path-node__button"
          type="button"
          title={title}
          style={{ background, clipPath: `url(#${clipId})` }}
          onClick={onSelect}
        >
          <Icon className="path-node__icon" aria-hidden="true" weight="duotone" />
          <span className="path-node__label">{label}</span>
        </button>

        {ring > 0 && (
          <svg className="path-node__ring" viewBox="0 0 100 115.47" aria-hidden="true">
            <path
              d={RING_PATH}
              pathLength="100"
              fill="none"
              stroke="#00e89b"
              strokeWidth="5.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={`${ring} 100`}
            />
          </svg>
        )}
      </div>
    </div>
  )
}

export default PathNode
