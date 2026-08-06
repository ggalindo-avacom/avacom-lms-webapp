import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import AttendanceStatusChip from '../../components/atoms/AttendanceStatusChip/AttendanceStatusChip'
import TodayDateCard from '../../components/atoms/TodayDateCard/TodayDateCard'
import HexIndicator from '../../components/atoms/HexIndicator/HexIndicator'
import ModuleCard from '../../components/organisms/ModuleCard/ModuleCard'
import AttendanceBoard from '../../components/organisms/AttendanceBoard/AttendanceBoard'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import {
  adminAttendanceDemo,
  attendanceCourses,
  attendanceDemoData,
  studentAttendanceDemo,
} from '../../data/attendanceDemoData'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { useLanguage } from '../../i18n/LanguageContext'
import './AttendancePage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Paso 1: exportación local (en producción la sirve
   GET /api/attendance/sessions/<id>/export/?format=csv|xlsx). */
function downloadFile(rows, filename, mimeType) {
  const content = rows.map((row) => row.join(';')).join('\n')
  /* BOM para que Excel abra bien los acentos. */
  const url = URL.createObjectURL(new Blob([`﻿${content}`], { type: mimeType }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/* Página propia del módulo Asistencia. El rol de la demo entra por
   forcedRole o ?role=; los datos llegan con la forma del backend
   (ver src/data/attendanceDemoData.js, que documenta los endpoints). */
function AttendancePage({
  adminData = adminAttendanceDemo,
  courses = attendanceCourses,
  data = attendanceDemoData,
  forcedRole,
  studentData = studentAttendanceDemo,
}) {
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'profesor')
  const title = localize(language, 'Asistencia', 'Attendance')

  /* Paso 2: estado local = lo que en producción sería PATCH + refetch. */
  const [courseId, setCourseId] = useState(courses[0].id)
  const [mode, setMode] = useState('computer')
  const [sessions, setSessions] = useState(data.sessions)

  const session = sessions[courseId]
  const course = courses.find((item) => item.id === courseId)

  /* Paso 3: marcar un estudiante (markedBy distingue quién lo marcó). */
  const markStudent = (studentId, status, markedBy = 'teacher') => {
    setSessions((current) => ({
      ...current,
      [courseId]: {
        ...current[courseId],
        records: current[courseId].records.map((record) => (
          record.studentId === studentId
            ? { ...record, status, markedBy, markedAt: status === 'absent' ? null : new Date().toISOString() }
            : record
        )),
      },
    }))
  }

  const exportRows = () => [
    [localize(language, 'Estudiante', 'Student'), localize(language, 'Estado', 'Status'), localize(language, 'Marcado por', 'Marked by')],
    ...session.records.map((record) => [record.name, record.status, record.markedBy ?? '—']),
  ]

  const baseName = `asistencia_${course.name}_${course.group}_${data.date}`.replace(/\s+/g, '')

  return (
    <ModuleLayout activeModule="attendance" language={language} role={role} title={title}>
      {/* Tarjeta fija con la fecha del día. */}
      <TodayDateCard date={data.date} language={language} />

      <h1>{title}</h1>
      <p className="module-subtitle">
        {role === 'profesor'
          ? localize(language, 'Marca la lista desde tu computador o deja que cada estudiante la marque en la pantalla.', 'Take attendance from your computer or let each student mark it on the screen.')
          : role === 'admin'
            ? localize(language, 'Cumplimiento de asistencia por curso.', 'Attendance compliance by course.')
            : localize(language, 'Así va tu asistencia este periodo.', 'This is your attendance this term.')}
      </p>

      {/* Paso 4: vista del profesor — tablero completo. */}
      {role === 'profesor' && (
        <AttendanceBoard
          courses={courses}
          courseId={courseId}
          language={language}
          mode={mode}
          records={session.records}
          onCourseChange={setCourseId}
          onExportCsv={() => downloadFile(exportRows(), `${baseName}.csv`, 'text/csv;charset=utf-8')}
          onExportXlsx={() => downloadFile(exportRows(), `${baseName}.xls`, 'application/vnd.ms-excel')}
          onImport={() => document.getElementById('attendance-import')?.click()}
          onMark={markStudent}
          onModeChange={setMode}
        />
      )}

      {/* Entrada de archivo para "Importar" (CSV/XLSX). */}
      {role === 'profesor' && (
        <input className="attendance-page__file" id="attendance-import" type="file" accept=".csv,.xlsx,.xls" />
      )}

      {/* Paso 5: vista del estudiante — su propia asistencia. */}
      {role === 'estudiante' && (
        <>
          <div className="attendance-page__indicators">
            <HexIndicator color="green" label={localize(language, 'Asistencia', 'Attendance')} value={`${studentData.summary.rate}%`} />
            <HexIndicator color="violet" label={localize(language, 'Clases asistidas', 'Classes attended')} value={studentData.summary.present} />
            <HexIndicator color="gold" label={localize(language, 'Llegadas tarde', 'Late arrivals')} value={studentData.summary.late} />
          </div>

          <ModuleCard title={localize(language, 'Mis últimas clases', 'My latest classes')}>
            {studentData.history.map((entry) => (
              <div className="attendance-page__row" key={entry.date}>
                <div>
                  <strong>{new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', { dateStyle: 'long' }).format(new Date(`${entry.date}T12:00:00`))}</strong>
                  <small>{entry.course}</small>
                </div>
                <AttendanceStatusChip language={language} status={entry.status} />
              </div>
            ))}
          </ModuleCard>
        </>
      )}

      {/* Paso 6: vista del administrador — cumplimiento por curso. */}
      {role === 'admin' && (
        <ModuleCard title={localize(language, 'Cumplimiento por curso', 'Compliance by course')}>
          {adminData.map((item) => (
            <div className="attendance-page__row" key={item.courseId}>
              <div>
                <strong>{item.course}</strong>
                <small>{item.teacher}</small>
              </div>
              <div className="attendance-page__rate">
                <span>{item.rate}%</span>
                <small>{item.absentToday} {localize(language, 'ausente(s) hoy', 'absent today')}</small>
              </div>
            </div>
          ))}
        </ModuleCard>
      )}
    </ModuleLayout>
  )
}

export default AttendancePage
