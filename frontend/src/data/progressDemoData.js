/* Datos de demostración del módulo Progreso.

   La estructura imita la respuesta que daría el backend
   (GET /api/progress/summary/?role=<rol> → { data: { ... } }):
   objetos planos serializables, fechas en ISO 8601, textos visibles en
   { es, en } y claves estables por id. Crear el endpoint es mapear estos
   mismos campos desde los modelos. */

export const progressDemoData = {
  estudiante: {
    lastClass: {
      id: 'algebra-8b-2026-08-05',
      courseId: 'algebra-8b',
      title: { es: 'Ecuaciones de primer grado — La balanza', en: 'Linear equations — The balance' },
      date: '2026-08-05',
      course: 'Álgebra · 8°B',
      teacher: 'Ms. Carter',
      summary: {
        es: 'Practicamos el despeje con la balanza de ecuaciones y quedó abierto el taller por equipos.',
        en: 'We practiced solving with the equation balance; the team workshop is still open.',
      },
      progress: 60,
    },
    indicators: [
      { id: 'achievement', label: { es: 'Logro acumulado', en: 'Overall achievement' }, value: '85%', tone: 'ok' },
      { id: 'last-grade', label: { es: 'Última nota', en: 'Latest grade' }, value: '8.5', tone: 'info' },
      { id: 'pending-tasks', label: { es: 'Tareas pendientes', en: 'Pending tasks' }, value: '2', tone: 'warn' },
      { id: 'streak', label: { es: 'Días seguidos conectado', en: 'Day streak' }, value: '4', tone: 'ok' },
    ],
    courses: [
      { id: 'algebra-8b', name: 'Álgebra', group: '8°B', progress: 82, grade: 8.5 },
      { id: 'geometria-8b', name: 'Geometría', group: '8°B', progress: 64, grade: 7.8 },
      { id: 'estadistica-8b', name: 'Estadística', group: '8°B', progress: 45, grade: 8.0 },
    ],
    pendingTasks: [
      {
        id: 'task-planteo',
        title: { es: 'Problemas de planteo (PDF)', en: 'Word problems (PDF)' },
        course: 'Álgebra · 8°B',
        dueDate: '2026-08-07',
        status: 'urgent',
      },
      {
        id: 'task-triangulos',
        title: { es: 'Guía de triángulos No. 4', en: 'Triangles worksheet No. 4' },
        course: 'Geometría · 8°B',
        dueDate: '2026-08-12',
        status: 'open',
      },
    ],
  },

  profesor: {
    lastClass: {
      id: 'algebra-8b-2026-08-06',
      courseId: 'algebra-8b',
      title: { es: 'Clase de hoy · Taller de ecuaciones por equipos', en: "Today's class · Team equations workshop" },
      date: '2026-08-06',
      course: 'Álgebra · 8°B',
      teacher: null,
      summary: {
        es: '10 de 12 estudiantes conectados. El taller por equipos quedó calificado a medias.',
        en: '10 of 12 students connected. The team workshop is half graded.',
      },
      progress: 50,
    },
    indicators: [
      { id: 'group-average', label: { es: 'Promedio del grupo', en: 'Group average' }, value: '8.1', tone: 'ok' },
      { id: 'attendance', label: { es: 'Asistencia de hoy', en: "Today's attendance" }, value: '10/12', tone: 'info' },
      { id: 'to-grade', label: { es: 'Entregas por calificar', en: 'Submissions to grade' }, value: '5', tone: 'warn' },
      { id: 'at-risk', label: { es: 'Estudiantes en riesgo', en: 'Students at risk' }, value: '3', tone: 'bad' },
    ],
    failingByCourse: [
      {
        courseId: 'algebra-8b',
        course: 'Álgebra · 8°B',
        students: [
          { id: 'lucas-h', name: 'Lucas Harris', average: 5.4, pendingTasks: 3 },
          { id: 'sofia-p', name: 'Sofía Price', average: 5.8, pendingTasks: 2 },
        ],
      },
      {
        courseId: 'algebra-9a',
        course: 'Álgebra · 9°A',
        students: [
          { id: 'noah-b', name: 'Noah Bennett', average: 5.1, pendingTasks: 4 },
        ],
      },
    ],
  },

  admin: {
    lastClass: {
      id: 'plataforma-2026-08-06',
      courseId: 'algebra-8b',
      title: { es: 'Última clase registrada en la plataforma', en: 'Latest class recorded on the platform' },
      date: '2026-08-06',
      course: 'Álgebra · 8°B',
      teacher: 'Ms. Carter',
      summary: {
        es: 'La sincronización nocturna terminó correctamente y no hay incidencias abiertas.',
        en: 'The nightly sync finished correctly and there are no open incidents.',
      },
      progress: null,
    },
    indicators: [
      { id: 'active-courses', label: { es: 'Cursos activos', en: 'Active courses' }, value: '6', tone: 'info' },
      { id: 'teacher-hours', label: { es: 'Horas activas profesores', en: 'Teacher active hours' }, value: '118 h', tone: 'ok' },
      { id: 'student-hours', label: { es: 'Horas activas estudiantes', en: 'Student active hours' }, value: '642 h', tone: 'ok' },
      { id: 'open-alerts', label: { es: 'Alertas abiertas', en: 'Open alerts' }, value: '1', tone: 'warn' },
    ],
    coursesOverview: [
      { id: 'algebra-8b', course: 'Álgebra · 8°B', teacher: 'Ms. Carter', average: 8.1, atRisk: 2 },
      { id: 'algebra-9a', course: 'Álgebra · 9°A', teacher: 'Ms. Carter', average: 7.6, atRisk: 1 },
      { id: 'geometria-8b', course: 'Geometría · 8°B', teacher: 'Mr. Reed', average: 7.9, atRisk: 2 },
    ],
  },
}
