import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import './Modal.css'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function Modal({ children, id, isOpen, title, onClose }) {
  const dialogRef = useRef(null)
  const bodyRef = useRef(null)
  const titleId = `${id}-title`

  const focusableElements = useCallback(() => (
    Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || [])
  ), [])

  const firstContentElement = useCallback(() => (
    bodyRef.current?.querySelector(FOCUSABLE_SELECTOR)
  ), [])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const elements = focusableElements()

      if (!elements.length) {
        return
      }

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    ;(firstContentElement() || dialogRef.current)?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [firstContentElement, focusableElements, isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div className="modal" role="presentation" onMouseDown={handleOverlayMouseDown}>
      <div
        className="modal__dialog"
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal__header">
          <h2 className="modal__title" id={titleId}>{title}</h2>
          <button
            className="modal__close"
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal__body" ref={bodyRef}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
