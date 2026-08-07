import { useEffect, useRef } from 'react'
import anime from 'animejs'

import PathNode from '../../molecules/PathNode/PathNode'
import './LearningPath.css'

/* Geometría tomada del prototipo (unidades = múltiplos de --nd):
   primer hito en 0.9, paso horizontal 1.66 y alternancia vertical
   0.79 / 1.11 para el zig-zag. */
const FIRST_X = 0.9
const STEP_X = 1.66
const TOP_Y = 0.79
const BOTTOM_Y = 1.11
const STUB = 0.55
const LOCKED_COLOR = '#808080'
const EDGE_COLOR = '#dedede'

function pick(language, texts) {
  if (!texts) return ''
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Organismo: ruta de aprendizaje en hexágonos unidos por tramos inclinados.
   Recibe las unidades y las aplana en hitos consecutivos. */
function LearningPath({ language = 'es', onSelectNode, units }) {
  const viewportRef = useRef(null)

  /* El recorrido lo conduce anime.js: al tocar un hexágono la ruta se
     desplaza hasta centrarlo, despacio y con easing (nunca lineal). */
  const centerNode = (index, duration = 1200) => {
    const viewport = viewportRef.current
    if (!viewport) return

    const node = viewport.querySelectorAll('.learning-path__node')[index]
    if (!node) return

    const maxScroll = viewport.scrollWidth - viewport.clientWidth
    const target = Math.max(0, Math.min(maxScroll, node.offsetLeft + node.offsetWidth / 2 - viewport.clientWidth / 2))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    anime.remove(viewport)
    anime({
      targets: viewport,
      scrollLeft: target,
      duration: reduced ? 0 : duration,
      easing: 'easeInOutQuart',
    })
  }

  /* Un hito por nodo, recordando el color y el número de su unidad. */
  const nodes = units.flatMap((unit) => unit.nodes.map((node) => ({
    ...node,
    unitNumber: unit.number,
    unitTitle: unit.title,
    color: unit.color,
  })))

  /* Al abrir, la ruta se sitúa sobre el hito en curso (sin él no habría
     forma de llegar allí, porque el desplazamiento manual está oculto). */
  const currentIndex = Math.max(0, nodes.findIndex((node) => node.status === 'current'))

  useEffect(() => {
    const viewport = viewportRef.current
    const timer = setTimeout(() => centerNode(currentIndex, 1500), 320)

    return () => {
      clearTimeout(timer)
      if (viewport) anime.remove(viewport)
    }
  }, [currentIndex])

  const positionOf = (index) => ({
    x: FIRST_X + index * STEP_X,
    y: index % 2 === 0 ? TOP_Y : BOTTOM_Y,
  })

  const colorOf = (node) => (node.status === 'locked' ? LOCKED_COLOR : node.color)

  /* Tramos: dos muñones en los extremos y un segmento inclinado entre cada
     par de hitos, con degradado del color de uno al del siguiente. */
  const segments = []
  segments.push({ id: 'stub-start', x: FIRST_X - STUB, y: TOP_Y, length: STUB, rotation: 0, from: EDGE_COLOR, to: colorOf(nodes[0]) })

  for (let index = 0; index < nodes.length - 1; index += 1) {
    const start = positionOf(index)
    const end = positionOf(index + 1)
    const dx = end.x - start.x
    const dy = end.y - start.y

    segments.push({
      id: `seg-${index}`,
      x: start.x,
      y: start.y,
      length: Math.hypot(dx, dy),
      rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
      from: colorOf(nodes[index]),
      to: colorOf(nodes[index + 1]),
    })
  }

  const lastIndex = nodes.length - 1
  const last = positionOf(lastIndex)
  segments.push({ id: 'stub-end', x: last.x, y: last.y, length: STUB, rotation: 0, from: colorOf(nodes[lastIndex]), to: EDGE_COLOR })

  /* Etiqueta de unidad sobre el primer hito de cada una. */
  let cursor = 0
  const unitLabels = units.map((unit) => {
    const label = { id: unit.id, x: positionOf(cursor).x, color: unit.color, number: unit.number, title: unit.title }
    cursor += unit.nodes.length
    return label
  })

  return (
    <div className="learning-path" ref={viewportRef}>
      <div className="learning-path__track" style={{ '--track': nodes.length * STEP_X + 1 }}>
        {segments.map((segment, index) => (
          <span
            className="learning-path__line"
            key={segment.id}
            style={{
              '--x': segment.x,
              '--y': segment.y,
              '--len': segment.length,
              '--rot': `${segment.rotation}deg`,
              '--from': segment.from,
              '--to': segment.to,
              animationDelay: `${100 + index * 70}ms`,
            }}
            aria-hidden="true"
          />
        ))}

        {unitLabels.map((label, index) => (
          <span
            className="learning-path__unit"
            key={label.id}
            style={{ '--x': label.x, animationDelay: `${200 + index * 280}ms` }}
          >
            {language === 'en' ? 'Unit' : 'Unidad'} {label.number}
            <i style={{ background: label.color }} aria-hidden="true" />
          </span>
        ))}

        {nodes.map((node, index) => {
          const { x, y } = positionOf(index)

          return (
            <div
              className="learning-path__node"
              key={node.id}
              style={{ '--x': x, '--y': y, animationDelay: `${140 + index * 70}ms` }}
            >
              <PathNode
                color={node.color}
                kind={node.kind}
                label={pick(language, node.label)}
                ring={node.ring}
                status={node.status}
                title={pick(language, node.title)}
                onSelect={() => {
                  centerNode(index)
                  onSelectNode?.(node)
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPath
