/* Enciclopedia — datos de demostración de la biblioteca de recursos.

   ===== CONTRATO PARA EL BACKEND (usar este bloque como prompt) =====

   Modelo sugerido `EncyclopediaResource`:
     - id         slug estable
     - section    'class' | 'exam' | 'document'    ← a qué hilera pertenece
     - title      texto visible ({ es, en } en la demo; el backend puede
                  guardar string plano, el frontend acepta ambos)
     - meta       texto corto secundario (duración, autor, tipo de examen)
     - kind       'video' | 'interactive' | 'pdf'
     - grades     lista de grados a los que aplica ('1'..'11')
     - standards  lista de estándares/país: 'co' | 'mx' | 'us' | 'es' | 'cn'
     - tone       color de la carátula: 'red'|'blue'|'green'|'gold'|'violet'|'ink'

   Catálogos `grades` y `standards`: tablas simples id + nombre.

   Endpoints sugeridos (app nueva "encyclopedia" o dentro de courses):
     - GET /api/encyclopedia/bootstrap/
         → { data: { roleExperience, featured, filters,
                     classContent, stateExams, documents } }
         El rol real se toma del usuario autenticado. Esta respuesta completa
         puede hidratar directamente la prop `data` de EncyclopediaPage.
     - GET /api/encyclopedia/filters/
         → { data: { grades: [...], standards: [...] } }
     - GET /api/encyclopedia/resources/?grade=<id>&standard=<id>
         → { data: { classContent: [...], stateExams: [...], documents: [...] } }
         Sin parámetros devuelve todo; con ellos filtra por pertenencia
         (grade ∈ grades AND standard ∈ standards).
     - POST /api/encyclopedia/resources/<id>/open/
         → registra apertura/reproducción para estudiante.
     - POST /api/encyclopedia/resources/<id>/assignments/
         body: { courseId, dueAt? } → asignación creada por profesor.
     - PATCH /api/encyclopedia/resources/<id>/
         body: campos editables → gestión restringida a administrador.
   =================================================================== */

export const encyclopediaDemoData = {
  /* Contexto del usuario. En backend puede llegar en `viewer` desde
     GET /api/encyclopedia/bootstrap/ y debe derivarse de permisos, no de un
     parámetro enviado por el cliente. Mantener las mismas claves por rol. */
  roleExperience: {
    estudiante: {
      badge: { es: 'Modo estudiante', en: 'Student mode' },
      helper: { es: 'Explora, reproduce y lee recursos.', en: 'Explore, play and read resources.' },
      action: { es: 'Abrir recurso', en: 'Open resource' },
      confirmation: { es: 'Recurso listo para abrir', en: 'Resource ready to open' },
    },
    profesor: {
      badge: { es: 'Modo profesor', en: 'Teacher mode' },
      helper: { es: 'Previsualiza y asigna contenido a tus clases.', en: 'Preview and assign content to your classes.' },
      action: { es: 'Asignar a una clase', en: 'Assign to a class' },
      confirmation: { es: 'Recurso listo para asignar', en: 'Resource ready to assign' },
    },
    admin: {
      badge: { es: 'Modo administrador', en: 'Administrator mode' },
      helper: { es: 'Revisa la disponibilidad del catálogo.', en: 'Review catalog availability.' },
      action: { es: 'Gestionar recurso', en: 'Manage resource' },
      confirmation: { es: 'Recurso listo para gestionar', en: 'Resource ready to manage' },
    },
  },

  /* GET /api/encyclopedia/featured/?role=<rol> puede devolver este bloque. */
  featured: {
    resourceId: 'exam-icfes',
    eyebrow: { es: 'Destacado · Exámenes estatales', en: 'Featured · State exams' },
    title: { es: 'Prepárate para las Pruebas Saber · ICFES', en: 'Prepare for Saber · ICFES exams' },
    description: { es: 'Simulacros cronometrados y bancos de preguntas para avanzar con confianza.', en: 'Timed practice tests and question banks to move forward with confidence.' },
    cta: { es: 'Empezar a aprender', en: 'Start learning' },
  },

  filters: {
    grades: [
      { id: '1', label: { es: 'Primero', en: 'First' } },
      { id: '2', label: { es: 'Segundo', en: 'Second' } },
      { id: '3', label: { es: 'Tercero', en: 'Third' } },
      { id: '4', label: { es: 'Cuarto', en: 'Fourth' } },
      { id: '5', label: { es: 'Quinto', en: 'Fifth' } },
      { id: '6', label: { es: 'Sexto', en: 'Sixth' } },
      { id: '7', label: { es: 'Séptimo', en: 'Seventh' } },
      { id: '8', label: { es: 'Octavo', en: 'Eighth' } },
      { id: '9', label: { es: 'Noveno', en: 'Ninth' } },
      { id: '10', label: { es: 'Décimo', en: 'Tenth' } },
      { id: '11', label: { es: 'Once', en: 'Eleventh' } },
    ],
    standards: [
      { id: 'co', label: { es: 'Colombia', en: 'Colombia' } },
      { id: 'mx', label: { es: 'México', en: 'Mexico' } },
      { id: 'us', label: { es: 'Estados Unidos', en: 'United States' } },
      { id: 'es', label: { es: 'España', en: 'Spain' } },
      { id: 'cn', label: { es: 'China', en: 'China' } },
    ],
  },

  /* Sección 1 · Contenido de clases */
  classContent: [
    { id: 'clase-balanza', section: 'class', title: { es: 'La balanza de ecuaciones', en: 'The equation balance' }, meta: '12 min', kind: 'interactive', grades: ['8'], standards: ['co', 'mx', 'es'], tone: 'red' },
    { id: 'clase-fracciones', section: 'class', title: { es: 'Fracciones con pizza', en: 'Fractions with pizza' }, meta: '8 min', kind: 'video', grades: ['3', '4', '5'], standards: ['co', 'mx', 'us', 'es', 'cn'], tone: 'gold' },
    { id: 'clase-celula', section: 'class', title: { es: 'La célula por dentro', en: 'Inside the cell' }, meta: '15 min', kind: 'video', grades: ['6', '7'], standards: ['co', 'mx', 'es'], tone: 'green' },
    { id: 'clase-sistemas', section: 'class', title: { es: 'Sistemas de ecuaciones 2×2', en: '2×2 equation systems' }, meta: '18 min', kind: 'interactive', grades: ['8', '9'], standards: ['co', 'mx'], tone: 'blue' },
    { id: 'clase-lectura', section: 'class', title: { es: 'Lectura crítica de noticias', en: 'Critical news reading' }, meta: '10 min', kind: 'video', grades: ['9', '10', '11'], standards: ['co', 'es', 'us'], tone: 'violet' },
    { id: 'clase-estadistica', section: 'class', title: { es: 'Estadística con dados', en: 'Statistics with dice' }, meta: '9 min', kind: 'interactive', grades: ['7', '8'], standards: ['co', 'mx', 'us'], tone: 'ink' },
  ],

  /* Sección 2 · Exámenes estatales */
  stateExams: [
    { id: 'exam-icfes', section: 'exam', title: { es: 'Saber 11 · ICFES', en: 'Saber 11 · ICFES' }, meta: { es: 'Simulacro cronometrado', en: 'Timed practice test' }, kind: 'interactive', grades: ['10', '11'], standards: ['co'], tone: 'red' },
    { id: 'exam-unal', section: 'exam', title: { es: 'Examen Universidad Nacional', en: 'National University exam' }, meta: { es: 'Banco de preguntas', en: 'Question bank' }, kind: 'interactive', grades: ['11'], standards: ['co'], tone: 'green' },
    { id: 'exam-pisa', section: 'exam', title: { es: 'Pruebas PISA', en: 'PISA tests' }, meta: { es: 'Internacional · OCDE', en: 'International · OECD' }, kind: 'interactive', grades: ['9', '10'], standards: ['co', 'mx', 'us', 'es', 'cn'], tone: 'blue' },
    { id: 'exam-sat', section: 'exam', title: { es: 'SAT · ACT', en: 'SAT · ACT' }, meta: { es: 'Admisión universitaria EE. UU.', en: 'US college admission' }, kind: 'interactive', grades: ['10', '11'], standards: ['us'], tone: 'violet' },
    { id: 'exam-naep', section: 'exam', title: { es: 'NAEP', en: 'NAEP' }, meta: { es: 'Evaluación nacional EE. UU.', en: 'US national assessment' }, kind: 'interactive', grades: ['4', '8', '11'], standards: ['us'], tone: 'gold' },
    { id: 'exam-pau', section: 'exam', title: { es: 'PAU · Selectividad', en: 'PAU · Selectividad' }, meta: { es: 'Acceso universidad España', en: 'Spanish university access' }, kind: 'interactive', grades: ['11'], standards: ['es'], tone: 'ink' },
  ],

  /* Sección 3 · Documentos (PDF, mostrados como carátulas) */
  documents: [
    { id: 'doc-baldor', section: 'document', title: { es: 'Álgebra de Baldor', en: 'Baldor’s Algebra' }, meta: 'Aurelio Baldor', kind: 'pdf', grades: ['8', '9', '10'], standards: ['co', 'mx', 'es'], tone: 'red' },
    { id: 'doc-calculo', section: 'document', title: { es: 'Cálculo diferencial', en: 'Differential calculus' }, meta: { es: 'Libro de texto', en: 'Textbook' }, kind: 'pdf', grades: ['10', '11'], standards: ['co', 'mx', 'us', 'es'], tone: 'blue' },
    { id: 'doc-biologia', section: 'document', title: { es: 'Biología general', en: 'General biology' }, meta: { es: 'Libro ilustrado', en: 'Illustrated book' }, kind: 'pdf', grades: ['6', '7', '8'], standards: ['co', 'mx', 'es'], tone: 'green' },
    { id: 'doc-geometria', section: 'document', title: { es: 'Geometría plana', en: 'Plane geometry' }, meta: { es: 'Guía de ejercicios', en: 'Exercise guide' }, kind: 'pdf', grades: ['7', '8'], standards: ['co', 'mx'], tone: 'gold' },
    { id: 'doc-cuentos', section: 'document', title: { es: 'Cuentos para leer en voz alta', en: 'Read-aloud stories' }, meta: { es: 'Antología', en: 'Anthology' }, kind: 'pdf', grades: ['1', '2', '3'], standards: ['co', 'mx', 'es'], tone: 'violet' },
    { id: 'doc-quimica', section: 'document', title: { es: 'Química orgánica básica', en: 'Basic organic chemistry' }, meta: { es: 'Libro de texto', en: 'Textbook' }, kind: 'pdf', grades: ['10', '11'], standards: ['co', 'us', 'cn'], tone: 'ink' },
  ],
}
