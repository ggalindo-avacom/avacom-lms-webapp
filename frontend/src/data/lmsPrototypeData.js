export const prototypeProfiles = {
  estudiante: {
    area: null,
    chip: '#6b6b6b',
    grade: '8°B',
    initials: 'SR',
    name: 'Samuel Rodríguez Peña',
    shortName: 'Samuel',
    role: { es: 'Estudiante', en: 'Student' },
  },
  profesor: {
    area: 'Matemáticas',
    chip: '#8a6a2f',
    grade: null,
    initials: 'CT',
    name: 'Claudia Marcela Torres Naranjo',
    shortName: 'Prof. Claudia',
    role: { es: 'Profesora', en: 'Teacher' },
  },
  admin: {
    area: null,
    chip: '#7b2f75',
    grade: null,
    initials: 'AC',
    name: 'Andrés Felipe Cárdenas Gil',
    shortName: 'Andrés',
    role: { es: 'Administrador / Soporte TI', en: 'Administrator / IT Support' },
  },
}

export const students = [
  { name: 'Samuel Rodríguez Peña', connected: true, active: true, evaluation: 8.5, homework: 9.0, period: 8.2, observation: 'Participa activamente en clase.' },
  { name: 'Valentina Ortiz Cárdenas', connected: true, active: true, evaluation: 9.2, homework: 9.5, period: 9.0, observation: '' },
  { name: 'Juan Esteban Mora Díaz', connected: true, active: false, evaluation: 7.0, homework: 8.0, period: 7.4, observation: 'Se distrae con facilidad.' },
  { name: 'Mariana Gutiérrez López', connected: true, active: true, evaluation: 8.8, homework: 8.5, period: 8.6, observation: '' },
  { name: 'Santiago Rueda Castaño', connected: true, active: true, evaluation: 6.5, homework: 7.0, period: 6.8, observation: 'Requiere refuerzo en despeje.' },
  { name: 'Isabella Cano Restrepo', connected: true, active: true, evaluation: 9.5, homework: 9.8, period: 9.4, observation: '' },
  { name: 'Nicolás Pardo Jiménez', connected: true, active: false, evaluation: 7.8, homework: 7.5, period: 7.6, observation: '' },
  { name: 'Luciana Herrera Vargas', connected: true, active: true, evaluation: 8.0, homework: 8.8, period: 8.1, observation: '' },
  { name: 'Tomás Quintero Salazar', connected: false, active: false, evaluation: null, homework: 6.5, period: 6.9, observation: 'Ausente hoy — excusa médica.' },
  { name: 'Gabriela Zapata Osorio', connected: false, active: false, evaluation: null, homework: 7.8, period: 7.7, observation: '' },
  { name: 'Emiliano Suárez Rincón', connected: true, active: true, evaluation: 7.2, homework: 8.2, period: 7.5, observation: '' },
  { name: 'Sara Lucía Mejía Ángel', connected: true, active: true, evaluation: 9.0, homework: 9.2, period: 8.9, observation: '' },
]

export const subjectsByRole = {
  estudiante: [{ id: 'algebra', title: 'Álgebra', group: 'Octavo Grado · 8°B', progress: 60 }],
  profesor: [
    { id: 'algebra8a', title: 'Álgebra', group: '8°A · 32 estudiantes', progress: 55 },
    { id: 'algebra8b', title: 'Álgebra', group: '8°B · 12 estudiantes', progress: 60 },
  ],
}

export const courseUnits = [
  { title: 'Unidad 1 · Expresiones algebraicas', status: 'done', progress: 100, topics: ['Repaso de números reales', 'Términos semejantes', 'Valor numérico de expresiones'] },
  { title: 'Unidad 2 · Ecuaciones de primer grado', status: 'active', progress: 60, topics: ['Ecuaciones con una incógnita', 'Problemas de planteo', 'Verificación de soluciones'] },
  { title: 'Unidad 3 · Sistemas de ecuaciones 2×2', status: 'pending', progress: 0, topics: ['Método de sustitución', 'Método de igualación', 'Método gráfico'] },
  { title: 'Unidad 4 · Polinomios y factorización', status: 'pending', progress: 0, topics: ['Operaciones con polinomios', 'Casos de factorización', 'Productos notables'] },
]

export const syllabus = [
  'Pensamiento variacional y sistemas algebraicos (EBC)',
  'Resolución de problemas con ecuaciones lineales',
  'Modelación de situaciones cotidianas',
  'Comunicación matemática y argumentación',
]

export const calendarData = {
  program: [['30 jul', 'Evaluación Unidad 2 — Ecuaciones'], ['7 ago', 'Entrega: Problemas de planteo (PDF)'], ['18 ago', 'Inicio Unidad 3 — Sistemas 2×2']],
  institutional: [['15 ago', 'Día de la familia AVACOM'], ['11 sep', 'Cierre del Periodo 2'], ['5–9 oct', 'Semana de receso escolar']],
}

export const encyclopediaData = {
  state: ['Saber 11 · Matemáticas', 'Saber 11 · Lectura crítica', 'Saber 11 · Ciencias naturales', 'Saber 11 · Sociales y ciudadanas', 'Saber 11 · Inglés', 'Simulacro ICFES cronometrado', 'Banco de preguntas liberadas ICFES'],
  level: ['Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Once'],
  topic: ['Álgebra', 'Geometría', 'Estadística', 'Aritmética', 'Lectura crítica', 'Ciencias'],
}

export const notifications = {
  estudiante: [['Prof. Claudia', 'Tu evaluación de la Unidad 2 ya fue calificada: 8.5/10. ¡Buen trabajo!', 'hoy'], ['Administración', 'El 15 de agosto es el Día de la familia. No hay clases.', 'ayer']],
  profesor: [['Administración', 'Recuerda cerrar notas del Periodo 2 antes del 11 de septiembre.', 'hoy'], ['Sistema', 'Se restableció la contraseña de Tomás Quintero.', 'ayer']],
  admin: [['Sistema', 'La sincronización nocturna terminó correctamente.', 'hoy'], ['Soporte', 'Hay un nuevo ticket pendiente de revisión.', 'ayer']],
}

export const helpData = {
  videos: ['Cómo crear una evaluación paso a paso', 'Cómo asignar estudiantes a tu asignatura', 'Cómo proyectar resultados en clase'],
  guides: ['Guía rápida de inicio de sesión', 'Manual del módulo de tareas', 'Preguntas frecuentes de calificaciones'],
}

export const teacherHistory = [
  ['Hoy 10:42', 'Calificó la evaluación U2 de Samuel Rodríguez'],
  ['Hoy 10:15', 'Proyectó resultados del taller grupal'],
  ['Hoy 9:50', 'Tomó asistencia de 8°B'],
  ['Ayer 16:20', 'Creó tarea: Problemas de planteo (PDF)'],
  ['Ayer 15:05', 'Editó ponderación de la pregunta 4'],
  ['28 jul', 'Importó lista de estudiantes (CSV)'],
]

export const teachers = [
  { name: 'Claudia Marcela Torres Naranjo', subjects: 'Álgebra 8°A, Álgebra 8°B', own: 1, active: true },
  { name: 'Ricardo Peláez Montoya', subjects: 'Geometría 8°', own: 0, active: true },
  { name: 'Diana Carolina Reyes Puentes', subjects: 'Estadística 9°', own: 2, active: false },
]

export const systemLogs = {
  behavior: [['Hoy 10:42', 'claudia.torres', 'Calificación manual registrada (eval U2)'], ['Hoy 10:02', 'samuel.rodriguez', 'Inicio de sesión — tablet aula 802'], ['Hoy 9:58', '12 usuarios', 'Sesión iniciada en sede principal'], ['Ayer 16:20', 'claudia.torres', 'Creación de tarea con archivo']],
  errors: [['29 jul 14:11', 'BUG-1042', 'El visor PDF no carga en tablets con poca memoria', 'En revisión'], ['27 jul 09:30', 'BUG-1038', 'Exportación XLSX duplica encabezado', 'Corregido']],
}
