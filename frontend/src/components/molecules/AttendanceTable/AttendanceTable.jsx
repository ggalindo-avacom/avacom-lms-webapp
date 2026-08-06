import AttendanceStatusChip from '../../atoms/AttendanceStatusChip/AttendanceStatusChip'
import './AttendanceTable.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

const cycleOrder = ['present', 'late', 'excused', 'absent']

/* Molécula: modo "En computador" — el profesor marca desde la tabla.
   Cada fila ofrece los cuatro estados como botones. */
function AttendanceTable({ language = 'es', onMark, records }) {
  const timeOf = (record) => (record.markedAt
    ? new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', { hour: 'numeric', minute: '2-digit' }).format(new Date(record.markedAt))
    : '—')

  return (
    <div className="attendance-table-wrap">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>{localize(language, 'Estudiante', 'Student')}</th>
            <th>{localize(language, 'Estado', 'Status')}</th>
            <th>{localize(language, 'Marcar', 'Mark')}</th>
            <th>{localize(language, 'Hora', 'Time')}</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.studentId}>
              <td>
                <div className="attendance-table__student">
                  <span className="attendance-table__avatar" aria-hidden="true">{record.initials}</span>
                  <div>
                    <strong>{record.name}</strong>
                    {record.note && <small>{record.note}</small>}
                  </div>
                </div>
              </td>
              <td><AttendanceStatusChip language={language} status={record.status} /></td>
              <td>
                <div className="attendance-table__marks" role="group" aria-label={`${localize(language, 'Marcar a', 'Mark')} ${record.name}`}>
                  {cycleOrder.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`attendance-table__mark attendance-table__mark--${status}${record.status === status ? ' is-active' : ''}`}
                      aria-pressed={record.status === status}
                      onClick={() => onMark(record.studentId, status)}
                    >
                      {localize(language, { present: 'P', late: 'T', excused: 'E', absent: 'A' }[status], { present: 'P', late: 'L', excused: 'E', absent: 'A' }[status])}
                    </button>
                  ))}
                </div>
              </td>
              <td className="attendance-table__time">{timeOf(record)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AttendanceTable
