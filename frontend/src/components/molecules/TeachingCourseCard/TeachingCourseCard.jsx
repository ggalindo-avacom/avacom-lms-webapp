import { ArrowRight, BookOpen, UsersThree } from '@phosphor-icons/react'

import './TeachingCourseCard.css'

function pick(language, texts) {
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Molécula reutilizable para asignaturas dictadas por un profesor. */
function TeachingCourseCard({ course, language = 'es', onOpen }) {
  return (
    <article className={`teaching-course teaching-course--${course.tone}`}>
      <span className="teaching-course__icon"><BookOpen aria-hidden="true" weight="duotone" /></span>
      <span className="teaching-course__group">{course.group}</span>
      <h3>{pick(language, course.title)}</h3>
      <p>{pick(language, course.schedule)}</p>
      <div className="teaching-course__meta">
        <span><UsersThree aria-hidden="true" /> {course.students}</span>
        <span>{course.progress}%</span>
      </div>
      <div className="teaching-course__progress" aria-label={`${course.progress}%`}><span style={{ width: `${course.progress}%` }} /></div>
      <button type="button" onClick={() => onOpen(course)}>
        {language === 'en' ? 'Go to class' : 'Ir a la clase'} <ArrowRight aria-hidden="true" weight="bold" />
      </button>
    </article>
  )
}

export default TeachingCourseCard
