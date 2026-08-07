import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import {
  CaretDoubleDown,
  Atom,
  BookBookmark,
  Cpu,
  Exam,
  Flask,
  GlobeHemisphereWest,
  Leaf,
  Lightbulb,
  MathOperations,
  Palette,
  PersonSimpleRun,
  Scales,
  Translate,
  Triangle,
} from '@phosphor-icons/react'

import HexCell from '../../atoms/HexCell/HexCell'
import './SubjectHive.css'

/* El backend guarda el nombre del icono; aquí se resuelve al componente. */
const iconByName = {
  Atom, BookBookmark, Cpu, Exam, Flask, GlobeHemisphereWest, Leaf,
  Lightbulb, MathOperations, Palette, PersonSimpleRun, Scales, Translate,
  Triangle,
}

/* Coordenadas del panal, tomadas del prototipo: columnas escalonadas y tres
   filas. Las columnas "medias" (A–E) van en la fila central. */
const COLUMNS = { z: -2.7925, a: -1.6755, b: -0.5585, c: 0.5585, d: 1.6755, A: -2.234, B: -1.117, C: 0, D: 1.117, E: 2.234 }
const ROWS = { top: -0.973, mid: 0, bot: 0.973 }

/* Orden de llenado: centro primero y luego hacia los lados, igual que el
   prototipo (2 arriba / 3 al medio / 2 abajo, creciendo por fuera). */
const SLOTS = [
  { x: COLUMNS.b, y: ROWS.top }, { x: COLUMNS.c, y: ROWS.top },
  { x: COLUMNS.B, y: ROWS.mid }, { x: COLUMNS.C, y: ROWS.mid }, { x: COLUMNS.D, y: ROWS.mid },
  { x: COLUMNS.b, y: ROWS.bot }, { x: COLUMNS.c, y: ROWS.bot },
  { x: COLUMNS.a, y: ROWS.top }, { x: COLUMNS.d, y: ROWS.top },
  { x: COLUMNS.A, y: ROWS.mid }, { x: COLUMNS.E, y: ROWS.mid },
  { x: COLUMNS.a, y: ROWS.bot }, { x: COLUMNS.d, y: ROWS.bot },
  { x: COLUMNS.z, y: ROWS.top }, { x: COLUMNS.z, y: ROWS.bot },
]

function pick(language, texts) {
  if (!texts) return ''
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

const MOBILE_QUERY = '(max-width: 900px)'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/* Organismo: panal de asignaturas en hexágonos, con tarjeta de ayuda al
   pasar el puntero (o al enfocar con teclado). */
function SubjectHive({ language = 'es', onSelect, subjects }) {
  const [hovered, setHovered] = useState(null)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const hoverTimer = useRef(null)
  const boardRef = useRef(null)

  /* Pista de scroll: aparece unos segundos al abrir la vista en responsive
     y también al pasar de escritorio a responsive. */
  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)')
    let hideTimer

    const refresh = () => {
      clearTimeout(hideTimer)
      if (!query.matches) {
        setShowScrollHint(false)
        return
      }
      setShowScrollHint(true)
      hideTimer = setTimeout(() => setShowScrollHint(false), 4000)
    }

    refresh()
    query.addEventListener('change', refresh)

    return () => {
      query.removeEventListener('change', refresh)
      clearTimeout(hideTimer)
    }
  }, [])

  /* Flotación suave de los hexágonos (solo responsive), con anime.js y
     desfase entre uno y otro para que no suban a la vez. */
  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    let floating = null

    const stop = () => {
      const board = boardRef.current
      if (floating) {
        floating.pause()
        floating = null
      }
      if (!board) return
      anime.remove(board.children)
      /* Sin transform inline: en escritorio manda la animación CSS. */
      for (const slot of board.children) slot.style.transform = ''
    }

    const start = () => {
      stop()
      const board = boardRef.current
      if (!board || !query.matches || prefersReducedMotion()) return

      anime.set(board.children, { translateY: 0 })
      floating = anime({
        targets: board.children,
        translateY: [0, -9],
        direction: 'alternate',
        loop: true,
        duration: 2200,
        easing: 'easeInOutSine',
        delay: anime.stagger(140, { from: 'center' }),
      })
    }

    start()
    query.addEventListener('change', start)

    return () => {
      query.removeEventListener('change', start)
      stop()
    }
  }, [subjects])

  /* El desplazamiento vertical lo conduce anime.js: la rueda y el gesto solo
     indican hacia dónde ir, y la animación hace el recorrido con easing. */
  useEffect(() => {
    const board = boardRef.current
    const query = window.matchMedia(MOBILE_QUERY)
    if (!board) return undefined

    let targetTop = board.scrollTop

    /* Recorrido lento con easeInOutBack: arranca recogiéndose un poco,
       viaja pausado y se pasa apenas del destino antes de asentarse. */
    const scrollTo = (value, duration) => {
      targetTop = clamp(value, 0, board.scrollHeight - board.clientHeight)
      anime.remove(board)
      anime({
        targets: board,
        scrollTop: targetTop,
        duration: prefersReducedMotion() ? 0 : duration,
        easing: 'easeInOutBack',
      })
      setShowScrollHint(false)
    }

    const onWheel = (event) => {
      if (!query.matches) return
      event.preventDefault()
      scrollTo(targetTop + event.deltaY * 1.8, 1150)
    }

    /* Gesto táctil: el dedo arrastra y al soltar anime.js continúa con la
       inercia proporcional a la velocidad del deslizamiento. */
    let startY = 0
    let startTop = 0
    let lastY = 0
    let lastTime = 0

    const onTouchStart = (event) => {
      if (!query.matches) return
      anime.remove(board)
      startY = event.touches[0].clientY
      lastY = startY
      lastTime = event.timeStamp
      startTop = board.scrollTop
      targetTop = startTop
    }

    const onTouchMove = (event) => {
      if (!query.matches) return
      event.preventDefault()
      const currentY = event.touches[0].clientY
      board.scrollTop = clamp(startTop + (startY - currentY), 0, board.scrollHeight - board.clientHeight)
      targetTop = board.scrollTop
      lastY = currentY
      lastTime = event.timeStamp
      setShowScrollHint(false)
    }

    const onTouchEnd = (event) => {
      if (!query.matches) return
      const elapsed = Math.max(16, event.timeStamp - lastTime)
      const velocity = (lastY - event.changedTouches[0].clientY) / elapsed
      scrollTo(board.scrollTop + velocity * 280, 1400)
    }

    board.addEventListener('wheel', onWheel, { passive: false })
    board.addEventListener('touchstart', onTouchStart, { passive: true })
    board.addEventListener('touchmove', onTouchMove, { passive: false })
    board.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      board.removeEventListener('wheel', onWheel)
      board.removeEventListener('touchstart', onTouchStart)
      board.removeEventListener('touchmove', onTouchMove)
      board.removeEventListener('touchend', onTouchEnd)
      anime.remove(board)
    }
  }, [subjects])

  /* Pequeño retardo al salir para que el puntero pueda viajar sin parpadeo. */
  const hoverOn = (id) => {
    clearTimeout(hoverTimer.current)
    setHovered(id)
  }
  const hoverOff = () => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setHovered(null), 90)
  }

  const visible = subjects.slice(0, SLOTS.length)
  const hoveredSubject = visible.find((subject) => subject.id === hovered)

  return (
    <div className="subject-hive">
      <div className="subject-hive__board" ref={boardRef} onScroll={() => setShowScrollHint(false)}>
        {visible.map((subject, index) => {
          const slot = SLOTS[index]
          const Icon = iconByName[subject.icon] ?? BookBookmark

          return (
            <div
              className="subject-hive__slot"
              key={subject.id}
              style={{
                '--x': slot.x,
                '--y': slot.y,
                animationDelay: `${Math.min(index, 8) * 32}ms`,
              }}
            >
              <HexCell
                accent={subject.accent}
                icon={<Icon weight="duotone" />}
                label={pick(language, subject.name)}
                onBlur={hoverOff}
                onClick={() => onSelect(subject)}
                onFocus={() => hoverOn(subject.id)}
                onPointerEnter={() => hoverOn(subject.id)}
                onPointerLeave={hoverOff}
              />
            </div>
          )
        })}
      </div>

      {/* Tarjeta de ayuda: solo existe mientras hay una asignatura señalada.
          Va flotante para no descentrar el panal. */}
      {hoveredSubject && (
        <aside className="subject-hive__help" role="status" aria-live="polite">
          <strong>{pick(language, hoveredSubject.name)}</strong>
          <p>{pick(language, hoveredSubject.description)}</p>
          <small>
            {hoveredSubject.teacher && <span>{hoveredSubject.teacher}</span>}
            <span>{hoveredSubject.units} {language === 'en' ? 'units' : 'unidades'}</span>
            <span>{hoveredSubject.topics} {language === 'en' ? 'topics' : 'temas'}</span>
          </small>
        </aside>
      )}

      {/* Indicador de scroll (solo responsive). */}
      {showScrollHint && (
        <span className="subject-hive__scroll-hint" aria-hidden="true">
          <CaretDoubleDown weight="bold" />
        </span>
      )}
    </div>
  )
}

export default SubjectHive
