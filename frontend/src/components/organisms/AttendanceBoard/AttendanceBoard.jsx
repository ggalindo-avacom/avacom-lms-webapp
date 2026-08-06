import { DesktopTower, DownloadSimple, FileXls, HandTap, UploadSimple } from '@phosphor-icons/react'

import AttendanceRollCall from '../../molecules/AttendanceRollCall/AttendanceRollCall'
import AttendanceTable from '../../molecules/AttendanceTable/AttendanceTable'
import './AttendanceBoard.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Organismo del profesor: filtro por asignatura, acciones de importar y
   exportar, resumen del día, la lista en el modo activo y el conmutador
   inferior entre "En computador" y "Llamar lista en clase". */
function AttendanceBoard({
  courses,
  courseId,
  language = 'es',
  mode,
  onCourseChange,
  onExportCsv,
  onExportXlsx,
  onImport,
  onMark,
  onModeChange,
  records,
}) {
  const present = records.filter((record) => record.status === 'present' || record.status === 'late').length

  return (
    <section className="attendance-board">
      <header className="attendance-board__toolbar">
        <label className="attendance-board__filter">
          <span>{localize(language, 'Asignatura', 'Subject')}</span>
          <select value={courseId} onChange={(event) => onCourseChange(event.target.value)}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name} · {course.group}</option>
            ))}
          </select>
        </label>

        <div className="attendance-board__actions">
          <button type="button" className="attendance-board__action" onClick={onImport}>
            <UploadSimple aria-hidden="true" weight="bold" /> {localize(language, 'Importar', 'Import')}
          </button>
          <button type="button" className="attendance-board__action" onClick={onExportCsv}>
            <DownloadSimple aria-hidden="true" weight="bold" /> {localize(language, 'Exportar CSV', 'Export CSV')}
          </button>
          <button type="button" className="attendance-board__action attendance-board__action--primary" onClick={onExportXlsx}>
            <FileXls aria-hidden="true" weight="bold" /> {localize(language, 'Exportar XLSX', 'Export XLSX')}
          </button>
        </div>
      </header>

      <p className="attendance-board__summary" aria-live="polite">
        <strong>{present}</strong> / {records.length} {localize(language, 'en clase', 'in class')}
      </p>

      {mode === 'rollcall'
        ? <AttendanceRollCall language={language} records={records} onMark={onMark} />
        : <AttendanceTable language={language} records={records} onMark={onMark} />}

      {/* Conmutador inferior de modo. */}
      <div className="attendance-board__modes" role="group" aria-label={localize(language, 'Forma de llamar lista', 'Roll call mode')}>
        <button
          type="button"
          className={`attendance-board__mode${mode === 'computer' ? ' is-active' : ''}`}
          aria-pressed={mode === 'computer'}
          onClick={() => onModeChange('computer')}
        >
          <DesktopTower aria-hidden="true" weight="duotone" /> {localize(language, 'En computador', 'On computer')}
        </button>
        <button
          type="button"
          className={`attendance-board__mode${mode === 'rollcall' ? ' is-active' : ''}`}
          aria-pressed={mode === 'rollcall'}
          onClick={() => onModeChange('rollcall')}
        >
          <HandTap aria-hidden="true" weight="duotone" /> {localize(language, 'Llamar lista en clase', 'Roll call in class')}
        </button>
      </div>
    </section>
  )
}

export default AttendanceBoard
