import { ArrowLeft } from '@phosphor-icons/react'

import './CoursePresentation.css'

/* Tarjeta de presentación del curso: degradado violeta con remate inferior en
   ola asimétrica (suave a la izquierda, prolongada a la derecha). */
function CoursePresentation({ backLabel, grade, onBack, title }) {
  return (
    <header className="course-presentation">
      <button
        className="course-presentation__back"
        type="button"
        aria-label={backLabel}
        title={backLabel}
        onClick={onBack}
      >
        <ArrowLeft aria-hidden="true" weight="bold" />
      </button>
      <h1 className="course-presentation__title">{title}</h1>
      <p className="course-presentation__grade">{grade}</p>
    </header>
  )
}

export default CoursePresentation
