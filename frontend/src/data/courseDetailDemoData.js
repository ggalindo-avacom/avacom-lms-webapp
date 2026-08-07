/* Detalle de asignatura — datos de /lista-asignaturas/<assignmentId>/.

   ===== CONTRATO PARA EL BACKEND (usar este bloque como prompt) =====

   Modelos sugeridos:

     `Unit`
       - id, courseId, number, title { es, en }
       - color   hex de la unidad (se usa en la ruta de aprendizaje)
       - status  'done' | 'active' | 'locked'
       - grade   nota de la unidad (null si aún no hay)

     `UnitNode`      ← cada hito de la ruta de aprendizaje
       - id, unitId, order
       - kind    'topic' | 'exam'
       - label   { es, en } texto corto del hexágono ("Tema 1")
       - title   { es, en } descripción larga (tooltip)
       - status  'done' | 'current' | 'locked'
       - ring    0–100 avance del anillo verde del hexágono

     `UnitResource`  ← lo que se lista en la vista general
       - id, unitId
       - type    'document' | 'task' | 'quiz'
       - title   { es, en }
       - meta    { es, en } (páginas, fecha de entrega, número de preguntas)
       - state   'done' | 'pending' | 'graded'
       - score   nota obtenida (solo task/quiz calificados)

   Endpoint sugerido:
     - GET /api/courses/<assignmentId>/detail/?role=<rol>
         → { data: { course: {...}, progress: {...}, units: [ {
               ...unit, nodes: [...], documents: [...], tasks: [...],
               quizzes: [...] } ] } }
       El frontend arma la ruta de aprendizaje concatenando units[].nodes
       en orden; el color de cada tramo sale del color de su unidad.
   =================================================================== */

const unit = (number, title, color, status, grade, nodes, documents, tasks, quizzes) => ({
  id: `u${number}`,
  number,
  title,
  color,
  status,
  grade,
  nodes,
  documents,
  tasks,
  quizzes,
})

export const courseDetailDemoData = {
  course: {
    id: 'algebra-8b',
    name: { es: 'Matemáticas', en: 'Mathematics' },
    subtitle: { es: 'Álgebra · Octavo Grado', en: 'Algebra · Eighth Grade' },
    group: '8°B',
    term: { es: 'Periodo 2 · 2026', en: 'Term 2 · 2026' },
    teacher: 'Ms. Carter',
  },

  progress: {
    percent: 31,
    completedNodes: 5,
    totalNodes: 16,
    currentUnit: 2,
    todayNode: { es: 'Uni 2 · Tema 5: tienes taller pendiente en este tema.', en: 'Unit 2 · Topic 5: you have a pending workshop here.' },
  },

  units: [
    unit(1, { es: 'Números y operaciones', en: 'Numbers and operations' }, '#f2c600', 'done', 8.6,
      [
        { id: 'u1-t1', kind: 'topic', label: { es: 'Tema 1', en: 'Topic 1' }, title: { es: 'Números irracionales y sus propiedades', en: 'Irrational numbers and their properties' }, status: 'done', ring: 100 },
        { id: 'u1-t2', kind: 'topic', label: { es: 'Tema 2', en: 'Topic 2' }, title: { es: 'Representaciones de racionales e irracionales', en: 'Representing rationals and irrationals' }, status: 'done', ring: 100 },
        { id: 'u1-t3', kind: 'topic', label: { es: 'Tema 3', en: 'Topic 3' }, title: { es: 'Signo igual, equivalencia y ecuaciones', en: 'Equals sign, equivalence and equations' }, status: 'done', ring: 100 },
        { id: 'u1-ex', kind: 'exam', label: { es: 'Bimestral 1', en: 'Term test 1' }, title: { es: 'Evaluación bimestral · Unidad 1', en: 'Term evaluation · Unit 1' }, status: 'done', ring: 100 },
      ],
      [
        { id: 'u1-d1', title: { es: 'Guía de números reales', en: 'Real numbers guide' }, meta: { es: 'PDF · 12 páginas', en: 'PDF · 12 pages' } },
        { id: 'u1-d2', title: { es: 'Álgebra de Baldor · cap. 1', en: 'Baldor’s Algebra · ch. 1' }, meta: { es: 'PDF · 24 páginas', en: 'PDF · 24 pages' } },
      ],
      [
        { id: 'u1-a1', title: { es: 'Taller · Términos semejantes', en: 'Workshop · Like terms' }, meta: { es: 'Entregada 12 jul', en: 'Submitted Jul 12' }, state: 'graded', score: 9.0 },
      ],
      [
        { id: 'u1-q1', title: { es: 'Quiz · Valor numérico', en: 'Quiz · Numeric value' }, meta: { es: '10 preguntas', en: '10 questions' }, state: 'graded', score: 7.8 },
      ]),

    unit(2, { es: 'Geometría y medida', en: 'Geometry and measurement' }, '#e5282c', 'active', null,
      [
        { id: 'u2-t4', kind: 'topic', label: { es: 'Tema 4', en: 'Topic 4' }, title: { es: 'Área y volumen con lenguaje algebraico', en: 'Area and volume with algebraic language' }, status: 'done', ring: 100 },
        { id: 'u2-t5', kind: 'topic', label: { es: 'Tema 5', en: 'Topic 5' }, title: { es: 'Volumen de objetos regulares e irregulares', en: 'Volume of regular and irregular objects' }, status: 'current', ring: 20 },
        { id: 'u2-t6', kind: 'topic', label: { es: 'Tema 6', en: 'Topic 6' }, title: { es: 'Congruencia y semejanza en diseños', en: 'Congruence and similarity in designs' }, status: 'locked', ring: 0 },
        { id: 'u2-ex', kind: 'exam', label: { es: 'Bimestral 2', en: 'Term test 2' }, title: { es: 'Evaluación bimestral · Unidad 2', en: 'Term evaluation · Unit 2' }, status: 'locked', ring: 0 },
      ],
      [
        { id: 'u2-d1', title: { es: 'Fichas de sólidos geométricos', en: 'Solid shapes worksheets' }, meta: { es: 'PDF · 8 páginas', en: 'PDF · 8 pages' } },
      ],
      [
        { id: 'u2-a1', title: { es: 'Problemas de planteo (PDF)', en: 'Word problems (PDF)' }, meta: { es: 'Vence 7 ago', en: 'Due Aug 7' }, state: 'pending', score: null },
        { id: 'u2-a2', title: { es: 'Taller por equipos · Ecuaciones', en: 'Team workshop · Equations' }, meta: { es: 'En clase hoy', en: 'In class today' }, state: 'pending', score: null },
      ],
      [
        { id: 'u2-q1', title: { es: 'Quiz · Volumen', en: 'Quiz · Volume' }, meta: { es: '8 preguntas', en: '8 questions' }, state: 'pending', score: null },
      ]),

    unit(3, { es: 'Pensamiento variacional', en: 'Variational thinking' }, '#a62080', 'locked', null,
      [
        { id: 'u3-t7', kind: 'topic', label: { es: 'Tema 7', en: 'Topic 7' }, title: { es: 'Teoremas de Pitágoras y Tales', en: 'Pythagoras and Thales theorems' }, status: 'locked', ring: 0 },
        { id: 'u3-t8', kind: 'topic', label: { es: 'Tema 8', en: 'Topic 8' }, title: { es: 'Expresiones algebraicas y covariación', en: 'Algebraic expressions and covariation' }, status: 'locked', ring: 0 },
        { id: 'u3-t9', kind: 'topic', label: { es: 'Tema 9', en: 'Topic 9' }, title: { es: 'Patrones, conjeturas y generalización', en: 'Patterns, conjectures and generalization' }, status: 'locked', ring: 0 },
        { id: 'u3-ex', kind: 'exam', label: { es: 'Bimestral 3', en: 'Term test 3' }, title: { es: 'Evaluación bimestral · Unidad 3', en: 'Term evaluation · Unit 3' }, status: 'locked', ring: 0 },
      ],
      [{ id: 'u3-d1', title: { es: 'Guía de patrones', en: 'Patterns guide' }, meta: { es: 'PDF · 10 páginas', en: 'PDF · 10 pages' } }],
      [{ id: 'u3-a1', title: { es: 'Taller de generalización', en: 'Generalization workshop' }, meta: { es: 'Sin abrir', en: 'Not open yet' }, state: 'pending', score: null }],
      [{ id: 'u3-q1', title: { es: 'Quiz · Pitágoras', en: 'Quiz · Pythagoras' }, meta: { es: '6 preguntas', en: '6 questions' }, state: 'pending', score: null }]),

    unit(4, { es: 'Datos y azar', en: 'Data and chance' }, '#15a3dd', 'locked', null,
      [
        { id: 'u4-t10', kind: 'topic', label: { es: 'Tema 10', en: 'Topic 10' }, title: { es: 'Modelos funcionales y covariación', en: 'Functional models and covariation' }, status: 'locked', ring: 0 },
        { id: 'u4-t11', kind: 'topic', label: { es: 'Tema 11', en: 'Topic 11' }, title: { es: 'Datos agrupados y tendencia central', en: 'Grouped data and central tendency' }, status: 'locked', ring: 0 },
        { id: 'u4-t12', kind: 'topic', label: { es: 'Tema 12', en: 'Topic 12' }, title: { es: 'Eventos compuestos y regla de adición', en: 'Compound events and addition rule' }, status: 'locked', ring: 0 },
        { id: 'u4-ex', kind: 'exam', label: { es: 'Bimestral 4', en: 'Term test 4' }, title: { es: 'Evaluación bimestral · Unidad 4', en: 'Term evaluation · Unit 4' }, status: 'locked', ring: 0 },
      ],
      [{ id: 'u4-d1', title: { es: 'Tablas de frecuencia', en: 'Frequency tables' }, meta: { es: 'PDF · 6 páginas', en: 'PDF · 6 pages' } }],
      [{ id: 'u4-a1', title: { es: 'Encuesta y gráficos', en: 'Survey and charts' }, meta: { es: 'Sin abrir', en: 'Not open yet' }, state: 'pending', score: null }],
      [{ id: 'u4-q1', title: { es: 'Quiz · Probabilidad', en: 'Quiz · Probability' }, meta: { es: '8 preguntas', en: '8 questions' }, state: 'pending', score: null }]),
  ],
}
