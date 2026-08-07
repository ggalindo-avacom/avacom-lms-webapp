/* Asignaturas — datos del panal de /lista-asignaturas.

   ===== CONTRATO PARA EL BACKEND (usar este bloque como prompt) =====

   Modelo sugerido `Subject`:
     - id           slug estable (se usa en la URL /lista-asignaturas/<id>/)
     - name         { es, en } nombre visible de la asignatura
     - description  { es, en } texto de la tarjeta de ayuda (hover)
     - icon         nombre del icono Phosphor ('BookBookmark', 'Atom', …).
                    El frontend lo mapea a su componente; guardar el nombre
                    evita acoplar el backend a la librería de iconos.
     - accent       color hex del icono
     - teacher      nombre del docente (null para el rol admin)
     - units        número de unidades del curso
     - topics       número de temas
     - progress     0–100 (avance del estudiante; null para profesor/admin)

   Endpoint sugerido:
     - GET /api/courses/subjects/?role=<rol>
         → { data: [ Subject, ... ] }
         Estudiante: sus asignaturas matriculadas (con progress).
         Profesor: SOLO los cursos que dicta, identificados por
                   asignatura + grupo (Álgebra 8°A, Álgebra 8°B,
                   Geometría 7°A), con teacher null y progress del grupo.
         Admin: todas las del colegio.

   El orden del arreglo define la posición en el panal: la vista coloca los
   hexágonos en filas de 2 / 3 / 2 y va creciendo hacia los lados.
   =================================================================== */

const studentSubjects = [
  {
    id: 'lengua-castellana',
    name: { es: 'Lengua Castellana', en: 'Spanish Language' },
    description: { es: 'Lectura crítica, escritura y comunicación oral.', en: 'Critical reading, writing and oral communication.' },
    icon: 'BookBookmark',
    accent: '#e5282c',
    teacher: 'Ms. Rivera',
    units: 4,
    topics: 12,
    progress: 72,
  },
  {
    id: 'ciencias-sociales',
    name: { es: 'Ciencias Sociales', en: 'Social Studies' },
    description: { es: 'Historia, geografía y formación ciudadana.', en: 'History, geography and citizenship.' },
    icon: 'GlobeHemisphereWest',
    accent: '#c8222f',
    teacher: 'Mr. Duarte',
    units: 4,
    topics: 10,
    progress: 65,
  },
  {
    id: 'ingles',
    name: { es: 'Inglés', en: 'English' },
    description: { es: 'Vocabulario, gramática y conversación.', en: 'Vocabulary, grammar and conversation.' },
    icon: 'Translate',
    accent: '#f2c600',
    teacher: 'Ms. Doyle',
    units: 5,
    topics: 15,
    progress: 58,
  },
  {
    id: 'algebra-8b',
    name: { es: 'Matemáticas', en: 'Mathematics' },
    description: { es: 'Álgebra, ecuaciones y pensamiento variacional.', en: 'Algebra, equations and variational thinking.' },
    icon: 'MathOperations',
    accent: '#18181b',
    teacher: 'Ms. Carter',
    units: 4,
    topics: 12,
    progress: 60,
  },
  {
    id: 'fisica',
    name: { es: 'Física', en: 'Physics' },
    description: { es: 'Movimiento, fuerzas y energía en la vida diaria.', en: 'Motion, forces and energy in daily life.' },
    icon: 'Atom',
    accent: '#a62080',
    teacher: 'Mr. Reed',
    units: 3,
    topics: 9,
    progress: 41,
  },
  {
    id: 'quimica',
    name: { es: 'Química', en: 'Chemistry' },
    description: { es: 'Materia, reacciones y laboratorio seguro.', en: 'Matter, reactions and safe lab work.' },
    icon: 'Flask',
    accent: '#009c60',
    teacher: 'Mr. Reed',
    units: 3,
    topics: 8,
    progress: 37,
  },
  {
    id: 'tecnologia',
    name: { es: 'Tecnología e Informática', en: 'Technology and Computing' },
    description: { es: 'Pensamiento computacional y herramientas digitales.', en: 'Computational thinking and digital tools.' },
    icon: 'Cpu',
    accent: '#15a3dd',
    teacher: 'Ms. Nova',
    units: 4,
    topics: 11,
    progress: 80,
  },
  {
    id: 'biologia',
    name: { es: 'Biología', en: 'Biology' },
    description: { es: 'Seres vivos, células y ecosistemas.', en: 'Living beings, cells and ecosystems.' },
    icon: 'Leaf',
    accent: '#52525b',
    teacher: 'Ms. Peña',
    units: 4,
    topics: 10,
    progress: 54,
  },
  {
    id: 'educacion-artistica',
    name: { es: 'Educación Artística', en: 'Arts Education' },
    description: { es: 'Dibujo, color y expresión creativa.', en: 'Drawing, color and creative expression.' },
    icon: 'Palette',
    accent: '#52525b',
    teacher: 'Ms. Lira',
    units: 3,
    topics: 7,
    progress: 88,
  },
  {
    id: 'educacion-fisica',
    name: { es: 'Educación Física', en: 'Physical Education' },
    description: { es: 'Deporte, salud y trabajo en equipo.', en: 'Sports, health and teamwork.' },
    icon: 'PersonSimpleRun',
    accent: '#52525b',
    teacher: 'Mr. Salas',
    units: 3,
    topics: 6,
    progress: 92,
  },
  {
    id: 'etica',
    name: { es: 'Ética y Competencias Ciudadanas', en: 'Ethics and Citizenship' },
    description: { es: 'Convivencia, valores y participación.', en: 'Coexistence, values and participation.' },
    icon: 'Scales',
    accent: '#52525b',
    teacher: 'Mr. Duarte',
    units: 2,
    topics: 6,
    progress: 76,
  },
  {
    id: 'preparacion-saber',
    name: { es: 'Preparación Saber', en: 'Saber Exam Prep' },
    description: { es: 'Simulacros y estrategias para las pruebas Saber.', en: 'Practice tests and strategies for Saber exams.' },
    icon: 'Exam',
    accent: '#52525b',
    teacher: 'Ms. Carter',
    units: 3,
    topics: 9,
    progress: 33,
  },
  {
    id: 'proyectos',
    name: { es: 'Proyectos', en: 'Projects' },
    description: { es: 'Retos por equipos que integran varias materias.', en: 'Team challenges that combine several subjects.' },
    icon: 'Lightbulb',
    accent: '#52525b',
    teacher: 'Ms. Nova',
    units: 2,
    topics: 5,
    progress: 45,
  },
]

/* El profesor solo ve los cursos que dicta: asignatura + grupo. */
const teacherSubjects = [
  {
    id: 'algebra-8a',
    name: { es: 'Álgebra 8°A', en: 'Algebra 8°A' },
    description: { es: 'Ecuaciones de primer grado con el grupo 8°A.', en: 'Linear equations with group 8°A.' },
    icon: 'MathOperations',
    accent: '#e5282c',
    teacher: null,
    units: 4,
    topics: 12,
    progress: 55,
  },
  {
    id: 'algebra-8b',
    name: { es: 'Álgebra 8°B', en: 'Algebra 8°B' },
    description: { es: 'Ecuaciones de primer grado con el grupo 8°B.', en: 'Linear equations with group 8°B.' },
    icon: 'MathOperations',
    accent: '#18181b',
    teacher: null,
    units: 4,
    topics: 12,
    progress: 60,
  },
  {
    id: 'geometria-7a',
    name: { es: 'Geometría 7°A', en: 'Geometry 7°A' },
    description: { es: 'Figuras planas y construcción con el grupo 7°A.', en: 'Plane figures and construction with group 7°A.' },
    icon: 'Triangle',
    accent: '#009c60',
    teacher: null,
    units: 3,
    topics: 9,
    progress: 42,
  },
]

/* La vista pide las asignaturas por rol; el admin ve el catálogo completo. */
export const subjectsDemoData = {
  estudiante: studentSubjects,
  profesor: teacherSubjects,
  admin: studentSubjects,
}
