/* Asistencia — datos de demostración del módulo /asistencia.

   ===== CONTRATO PARA EL BACKEND (usar este bloque como prompt) =====

   Modelos sugeridos:

     `Course` (ya existe como asignatura del profesor)
       - id, name, group, studentsCount

     `AttendanceSession`   ← una sesión = un curso en una fecha
       - id            slug/uuid
       - courseId      FK a Course
       - date          ISO 8601 (YYYY-MM-DD)
       - status        'open' | 'closed'   (open = se puede marcar)

     `AttendanceRecord`    ← una fila por estudiante y sesión
       - sessionId     FK a AttendanceSession
       - studentId     FK a Student
       - status        'present' | 'absent' | 'late' | 'excused'
       - markedBy      'teacher' | 'student'   ← quién lo marcó
       - markedAt      timestamp ISO (null si aún no se marca)
       - note          texto libre opcional (ej. excusa médica)
       constraint: unique(sessionId, studentId)

   Endpoints sugeridos (app nueva "attendance"):
     - GET  /api/attendance/courses/?role=<rol>
         → { data: [ { id, name, group, studentsCount } ] }
         Devuelve solo las asignaturas asignadas al profesor autenticado.

     - GET  /api/attendance/sessions/?courseId=<id>&date=<YYYY-MM-DD>
         → { data: { session: {...}, records: [ { studentId, name,
             initials, status, markedBy, markedAt, note } ] } }
         Si no existe la sesión del día, el backend la crea vacía
         (todos los registros en 'absent' sin markedAt).

     - PATCH /api/attendance/records/
         body: { sessionId, studentId, status, markedBy }
         Marca o corrige un estudiante. markedBy='student' es el modo
         "Llamar lista en clase" (pantalla táctil); 'teacher' es el modo
         "En computador".

     - GET  /api/attendance/sessions/<id>/export/?format=csv|xlsx
         → archivo descargable con las columnas
           Estudiante; Estado; Marcado por; Hora.

     - POST /api/attendance/sessions/<id>/import/
         multipart con el archivo CSV/XLSX; responde el resumen
         { updated: <n>, skipped: <n>, errors: [...] }.
   =================================================================== */

/* Cursos que dicta el profesor de la demo (fuente del filtro por asignatura). */
export const attendanceCourses = [
  { id: 'algebra-8a', name: 'Álgebra', group: '8°A', studentsCount: 6 },
  { id: 'algebra-8b', name: 'Álgebra', group: '8°B', studentsCount: 6 },
  { id: 'geometria-8c', name: 'Geometría', group: '8°C', studentsCount: 5 },
]

/* Sesión del día por curso + sus registros. */
export const attendanceDemoData = {
  date: '2026-08-06',
  sessions: {
    'algebra-8a': {
      id: 'ses-algebra-8a-2026-08-06',
      courseId: 'algebra-8a',
      status: 'open',
      records: [
        { studentId: 'olivia-b', name: 'Olivia Bennett', initials: 'OB', status: 'present', markedBy: 'teacher', markedAt: '2026-08-06T07:05:00', note: '' },
        { studentId: 'liam-a', name: 'Liam Anderson', initials: 'LA', status: 'late', markedBy: 'teacher', markedAt: '2026-08-06T07:18:00', note: '' },
        { studentId: 'sophia-m', name: 'Sophia Martinez', initials: 'SM', status: 'present', markedBy: 'student', markedAt: '2026-08-06T07:03:00', note: '' },
        { studentId: 'mason-c', name: 'Mason Clark', initials: 'MC', status: 'absent', markedBy: null, markedAt: null, note: '' },
        { studentId: 'mia-w', name: 'Mia Walker', initials: 'MW', status: 'present', markedBy: 'student', markedAt: '2026-08-06T07:02:00', note: '' },
        { studentId: 'james-y', name: 'James Young', initials: 'JY', status: 'present', markedBy: 'teacher', markedAt: '2026-08-06T07:06:00', note: '' },
      ],
    },
    'algebra-8b': {
      id: 'ses-algebra-8b-2026-08-06',
      courseId: 'algebra-8b',
      status: 'open',
      records: [
        { studentId: 'ethan-m', name: 'Ethan Miller', initials: 'EM', status: 'present', markedBy: 'student', markedAt: '2026-08-06T10:01:00', note: '' },
        { studentId: 'ava-r', name: 'Ava Robinson', initials: 'AR', status: 'present', markedBy: 'student', markedAt: '2026-08-06T10:02:00', note: '' },
        { studentId: 'noah-t', name: 'Noah Thompson', initials: 'NT', status: 'present', markedBy: 'teacher', markedAt: '2026-08-06T10:04:00', note: '' },
        { studentId: 'lucas-h', name: 'Lucas Harris', initials: 'LH', status: 'excused', markedBy: 'teacher', markedAt: '2026-08-06T10:05:00', note: 'Excusa médica' },
        { studentId: 'emma-l', name: 'Emma Lewis', initials: 'EL', status: 'absent', markedBy: null, markedAt: null, note: '' },
        { studentId: 'charlotte-k', name: 'Charlotte King', initials: 'CK', status: 'present', markedBy: 'student', markedAt: '2026-08-06T10:03:00', note: '' },
      ],
    },
    'geometria-8c': {
      id: 'ses-geometria-8c-2026-08-06',
      courseId: 'geometria-8c',
      status: 'open',
      records: [
        { studentId: 'sofia-p', name: 'Sofía Price', initials: 'SP', status: 'present', markedBy: 'teacher', markedAt: '2026-08-06T13:02:00', note: '' },
        { studentId: 'noah-b', name: 'Noah Bennett', initials: 'NB', status: 'absent', markedBy: null, markedAt: null, note: '' },
        { studentId: 'ella-d', name: 'Ella Davis', initials: 'ED', status: 'present', markedBy: 'student', markedAt: '2026-08-06T13:01:00', note: '' },
        { studentId: 'henry-s', name: 'Henry Scott', initials: 'HS', status: 'late', markedBy: 'teacher', markedAt: '2026-08-06T13:15:00', note: '' },
        { studentId: 'grace-h', name: 'Grace Hill', initials: 'GH', status: 'present', markedBy: 'student', markedAt: '2026-08-06T13:00:00', note: '' },
      ],
    },
  },
}

/* Vista del estudiante: su propio historial de asistencia. */
export const studentAttendanceDemo = {
  studentId: 'ethan-m',
  summary: { present: 34, late: 2, absent: 1, excused: 1, rate: 89 },
  history: [
    { date: '2026-08-06', course: 'Álgebra · 8°B', status: 'present' },
    { date: '2026-08-05', course: 'Álgebra · 8°B', status: 'present' },
    { date: '2026-08-04', course: 'Álgebra · 8°B', status: 'late' },
    { date: '2026-07-31', course: 'Álgebra · 8°B', status: 'excused' },
    { date: '2026-07-30', course: 'Álgebra · 8°B', status: 'present' },
  ],
}

/* Vista del administrador: cumplimiento por curso. */
export const adminAttendanceDemo = [
  { courseId: 'algebra-8a', course: 'Álgebra · 8°A', teacher: 'Ms. Carter', rate: 92, absentToday: 1 },
  { courseId: 'algebra-8b', course: 'Álgebra · 8°B', teacher: 'Ms. Carter', rate: 88, absentToday: 1 },
  { courseId: 'geometria-8c', course: 'Geometría · 8°C', teacher: 'Mr. Reed', rate: 95, absentToday: 1 },
]
