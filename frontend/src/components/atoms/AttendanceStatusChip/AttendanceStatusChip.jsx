import { CheckCircle, Clock, FirstAidKit, XCircle } from '@phosphor-icons/react'

import './AttendanceStatusChip.css'

/* Átomo: estado de asistencia con icono + color. Los cuatro estados son los
   mismos del backend: present | late | excused | absent. */
const statusMap = {
  present: { Icon: CheckCircle, es: 'Presente', en: 'Present' },
  late: { Icon: Clock, es: 'Tarde', en: 'Late' },
  excused: { Icon: FirstAidKit, es: 'Excusa', en: 'Excused' },
  absent: { Icon: XCircle, es: 'Ausente', en: 'Absent' },
}

function AttendanceStatusChip({ language = 'es', status = 'absent' }) {
  const { Icon, es, en } = statusMap[status] ?? statusMap.absent

  return (
    <span className={`attendance-chip attendance-chip--${status}`}>
      <Icon aria-hidden="true" weight="fill" />
      {language === 'en' ? en : es}
    </span>
  )
}

export default AttendanceStatusChip
