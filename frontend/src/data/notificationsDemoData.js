/* Notificaciones — datos de demostración del módulo Comunicación.

   ===== CONTRATO PARA EL BACKEND (usar este bloque como prompt) =====

   Modelo sugerido `Notification`:
     - id            slug/uuid estable
     - channel       'institutional' | 'teacher'   ← quién la emite
     - sender        nombre visible del emisor (Administración o el profesor)
     - audience      a quién va dirigida:
                       { type: 'all' }                                → todos
                       { type: 'course',  courseId, courseName }      → una clase
                       { type: 'student', studentId, studentName }    → un estudiante
     - title / body  textos visibles. La demo los guarda en { es, en };
                     el backend puede guardar un solo idioma (string plano:
                     el frontend acepta ambas formas).
     - date          ISO 8601 (YYYY-MM-DD)

   Endpoints sugeridos (app network o una app nueva "communication"):
     - GET  /api/communication/notifications/?role=<rol>
         → { data: { institutional: [...], teacher: [...] } }
         El backend filtra por audiencia según el usuario del rol.
     - POST /api/communication/notifications/
         body: { channel, audience, title, body }
         Reglas: el profesor solo puede channel='teacher' con audience
         course|student de sus cursos; el admin solo channel='institutional'
         con audience all. Respuesta: { data: <notificación creada> }.
   =================================================================== */

export const notificationsDemoData = {
  institutional: [
    {
      id: 'inst-dia-profesor',
      channel: 'institutional',
      sender: { es: 'Administración', en: 'Administration' },
      audience: { type: 'all' },
      title: { es: 'Día del profesor · 27 de agosto', en: "Teachers' day · August 27" },
      body: {
        es: 'El 27 de agosto es el día del profesor: solo habrá clases hasta el mediodía.',
        en: "August 27 is teachers' day: classes run only until noon.",
      },
      date: '2026-08-04',
    },
    {
      id: 'inst-dia-familia',
      channel: 'institutional',
      sender: { es: 'Administración', en: 'Administration' },
      audience: { type: 'all' },
      title: { es: 'Día de la familia AVACOM', en: 'AVACOM family day' },
      body: {
        es: 'El 15 de agosto no hay clases: ¡los esperamos con sus familias en el colegio!',
        en: 'No classes on August 15: join us at school with your families!',
      },
      date: '2026-08-01',
    },
  ],

  teacher: [
    {
      id: 'teach-polinomios-ethan',
      channel: 'teacher',
      sender: 'Ms. Carter',
      audience: { type: 'student', studentId: 'ethan-m', studentName: 'Ethan' },
      title: { es: 'Tarea de polinomios pendiente', en: 'Polynomials homework pending' },
      body: {
        es: 'Ethan, recuerda que para hoy tienes pendiente la tarea de polinomios que te envié a corregir.',
        en: 'Ethan, remember the polynomials homework I sent you to correct is due today.',
      },
      date: '2026-08-06',
    },
    {
      id: 'teach-eval-8b',
      channel: 'teacher',
      sender: 'Ms. Carter',
      audience: { type: 'course', courseId: 'algebra-8b', courseName: 'Álgebra · 8°B' },
      title: { es: 'Evaluación de la Unidad 2 calificada', en: 'Unit 2 evaluation graded' },
      body: {
        es: 'Ya pueden ver la nota de la evaluación en su módulo de progreso. ¡Buen trabajo, 8°B!',
        en: 'Your evaluation grade is now visible in the progress module. Great job, 8°B!',
      },
      date: '2026-08-05',
    },
  ],
}
