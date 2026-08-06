import { Check, HandTap } from '@phosphor-icons/react'

import './AttendanceRollCall.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Molécula: modo "Llamar lista en clase" — tarjetones grandes para que cada
   estudiante toque su nombre en la pantalla táctil y quede presente. */
function AttendanceRollCall({ language = 'es', onMark, records }) {
  return (
    <div className="attendance-rollcall">
      <p className="attendance-rollcall__hint">
        <HandTap aria-hidden="true" weight="duotone" />
        {localize(language, 'Toca tu nombre para marcar que estás en clase.', 'Tap your name to mark that you are in class.')}
      </p>

      <div className="attendance-rollcall__grid">
        {records.map((record) => {
          const isHere = record.status === 'present' || record.status === 'late'

          return (
            <button
              key={record.studentId}
              type="button"
              className={`attendance-rollcall__card${isHere ? ' is-here' : ''}`}
              aria-pressed={isHere}
              onClick={() => onMark(record.studentId, isHere ? 'absent' : 'present', 'student')}
            >
              <span className="attendance-rollcall__avatar" aria-hidden="true">
                {isHere ? <Check weight="bold" /> : record.initials}
              </span>
              <span className="attendance-rollcall__name">{record.name}</span>
              <span className="attendance-rollcall__state">
                {isHere
                  ? localize(language, '¡Aquí estoy!', "I'm here!")
                  : localize(language, 'Toca para marcar', 'Tap to mark')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AttendanceRollCall
