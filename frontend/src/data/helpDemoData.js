/* Centro de ayuda — data de demostración y prompt para backend.

   =================== CONTRATO PARA BACKEND ===================

   Modelos sugeridos:
     HelpCategory:
       id, slug, label, description, icon, sortOrder, isActive
     HelpDocument:
       id, slug, categoryId, title, question, summary, body[], keywords[],
       audiences[] ('estudiante'|'profesor'|'admin'), type
       ('article'|'guide'|'faq'), sortOrder, publishedAt, isPublished
     HelpVideo (relación opcional 1:1 con HelpDocument):
       title, duration, sourceUrl, posterUrl, transcript, captionsUrl

   Endpoints sugeridos:
     - GET /api/help/bootstrap/
         → { data: { categories, documents } } filtrado por rol autenticado.
     - GET /api/help/documents/?q=<texto>&category=<slug>
         → búsqueda por título, pregunta, resumen y keywords.
     - GET /api/help/documents/<slug>/
         → documento completo con texto, vídeo y adjuntos.
     - POST/PATCH /api/help/documents/ y /api/help/categories/
         → restringidos a administradores/editor de contenido.
     - POST /api/help/documents/<slug>/view/
         → analítica de apertura; nunca almacenar términos sensibles.

   Carga sencilla de documentos demo:
     1. Agregar un objeto a `documents` con categoryId y audiences.
     2. `body` acepta uno o varios párrafos localizados.
     3. `video` es opcional. Con `sourceUrl: null` se muestra el reproductor
        demo; al conectar backend basta enviar una URL y subtítulos válidos.
     4. No se requieren cambios en HelpPage ni en sus componentes.
   ============================================================= */

export const helpDemoData = {
  categories: [
    { id: 'getting-started', label: { es: 'Primeros pasos', en: 'Getting started' }, description: { es: 'Conoce lo esencial en pocos minutos.', en: 'Learn the essentials in minutes.' }, icon: 'rocket', color: 'yellow' },
    { id: 'account', label: { es: 'Cuenta y acceso', en: 'Account and access' }, description: { es: 'Ingreso, perfil y seguridad.', en: 'Sign-in, profile and security.' }, icon: 'key', color: 'violet' },
    { id: 'classes', label: { es: 'Clases y asignaturas', en: 'Classes and subjects' }, description: { es: 'Contenido, tareas y clases.', en: 'Content, homework and classes.' }, icon: 'class', color: 'green' },
    { id: 'progress', label: { es: 'Evaluaciones y progreso', en: 'Assessments and progress' }, description: { es: 'Notas, exámenes y reportes.', en: 'Grades, exams and reports.' }, icon: 'progress', color: 'red' },
    { id: 'communication', label: { es: 'Comunicación', en: 'Communication' }, description: { es: 'Mensajes y notificaciones.', en: 'Messages and notifications.' }, icon: 'chat', color: 'blue' },
    { id: 'management', label: { es: 'Administración', en: 'Administration' }, description: { es: 'Usuarios, permisos y soporte.', en: 'Users, permissions and support.' }, icon: 'settings', color: 'ink' },
  ],

  documents: [
    {
      id: 'start-student', slug: 'primeros-pasos-estudiante', categoryId: 'getting-started', type: 'guide',
      audiences: ['estudiante'], keywords: ['inicio', 'menú', 'asignaturas', 'estudiante'],
      title: { es: 'Tu primer recorrido como estudiante', en: 'Your first student tour' },
      question: { es: '¿Cómo empiezo a usar AVACOM?', en: 'How do I start using AVACOM?' },
      summary: { es: 'Aprende a entrar a tus asignaturas, encontrar tareas y revisar tu progreso.', en: 'Learn to open subjects, find homework and review progress.' },
      body: [
        { es: 'Abre el menú principal y elige Asignaturas. Allí encontrarás cada curso con su avance actual.', en: 'Open the main menu and choose Subjects. You will find every course and its current progress.' },
        { es: 'Usa el navbar inferior para volver al menú, abrir la enciclopedia o pedir ayuda en cualquier momento.', en: 'Use the bottom navbar to return to the menu, open the encyclopedia or ask for help at any time.' },
      ],
      video: { title: { es: 'Recorrido rápido del estudiante', en: 'Quick student tour' }, duration: '2:15', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'start-teacher', slug: 'primeros-pasos-profesor', categoryId: 'getting-started', type: 'guide',
      audiences: ['profesor'], keywords: ['inicio', 'clase', 'profesor', 'asignar'],
      title: { es: 'Prepara tu primera clase', en: 'Prepare your first class' },
      question: { es: '¿Qué debo configurar antes de enseñar?', en: 'What should I set up before teaching?' },
      summary: { es: 'Revisa cursos, contenido y estudiantes antes de iniciar una sesión.', en: 'Review courses, content and students before starting a session.' },
      body: [
        { es: 'Entra a Perfil para verificar tus cursos y usa Ir a la clase para abrir cada asignatura.', en: 'Open Profile to verify your courses and use Go to class to open each subject.' },
        { es: 'Antes de comenzar, revisa asistencia, material principal y recursos complementarios.', en: 'Before starting, review attendance, primary material and complementary resources.' },
      ],
      video: { title: { es: 'Tu primera clase paso a paso', en: 'Your first class step by step' }, duration: '3:40', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'start-admin', slug: 'primeros-pasos-administrador', categoryId: 'getting-started', type: 'guide',
      audiences: ['admin'], keywords: ['inicio', 'admin', 'usuarios', 'seguridad'],
      title: { es: 'Panel esencial de administración', en: 'Administration essentials' },
      question: { es: '¿Cómo verifico que todo esté funcionando?', en: 'How do I verify everything is working?' },
      summary: { es: 'Una ruta breve por usuarios, registros y configuración.', en: 'A short route through users, logs and settings.' },
      body: [
        { es: 'Empieza por los registros de actividad, confirma las sincronizaciones y revisa usuarios pendientes.', en: 'Start with activity logs, confirm synchronizations and review pending users.' },
        { es: 'Los cambios de permisos deben quedar registrados y aplicarse siempre desde endpoints protegidos.', en: 'Permission changes must be logged and always applied through protected endpoints.' },
      ],
      video: { title: { es: 'Chequeo diario del administrador', en: 'Administrator daily check' }, duration: '4:05', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'recover-access', slug: 'recuperar-acceso', categoryId: 'account', type: 'faq',
      audiences: ['estudiante', 'profesor', 'admin'], keywords: ['contraseña', 'password', 'correo', 'acceso'],
      title: { es: 'Recuperar el acceso a tu cuenta', en: 'Recover access to your account' },
      question: { es: '¿Qué hago si olvidé mi contraseña?', en: 'What if I forgot my password?' },
      summary: { es: 'Solicita un enlace seguro desde Perfil y revisa tu correo institucional.', en: 'Request a secure link from Profile and check your institution email.' },
      body: [
        { es: 'Abre Perfil y busca Recuperar mi cuenta. Escribe tu correo institucional y envía la solicitud.', en: 'Open Profile and find Recover my account. Enter your institution email and submit the request.' },
        { es: 'Por seguridad, el sistema muestra el mismo mensaje aunque el correo no esté registrado.', en: 'For security, the system shows the same message even when the email is not registered.' },
      ],
      video: { title: { es: 'Recuperación segura de cuenta', en: 'Secure account recovery' }, duration: '1:35', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'submit-homework', slug: 'entregar-una-tarea', categoryId: 'classes', type: 'faq',
      audiences: ['estudiante'], keywords: ['tarea', 'archivo', 'entrega', 'fecha'],
      title: { es: 'Entregar una tarea', en: 'Submit homework' },
      question: { es: '¿Cómo envío mi tarea correctamente?', en: 'How do I submit homework correctly?' },
      summary: { es: 'Adjunta el archivo, confirma la entrega y conserva el comprobante.', en: 'Attach the file, confirm submission and keep the receipt.' },
      body: [{ es: 'Abre la asignatura, selecciona la tarea y verifica la fecha límite antes de adjuntar tu archivo.', en: 'Open the subject, select the homework and verify the due date before attaching your file.' }],
      video: { title: { es: 'Enviar una tarea en tres pasos', en: 'Submit homework in three steps' }, duration: '2:05', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'organize-class-content', slug: 'organizar-contenido-clase', categoryId: 'classes', type: 'guide',
      audiences: ['profesor'], keywords: ['clase', 'contenido', 'recurso', 'profesor'],
      title: { es: 'Organizar el contenido de una clase', en: 'Organize class content' },
      question: { es: '¿Cómo preparo materiales para mis estudiantes?', en: 'How do I prepare materials for my students?' },
      summary: { es: 'Combina contenido principal, recursos complementarios y tareas.', en: 'Combine primary content, complementary resources and homework.' },
      body: [{ es: 'Abre la asignatura, selecciona la unidad activa y ordena los recursos según el momento de la clase.', en: 'Open the subject, select the active unit and order resources according to the class flow.' }],
      video: { title: { es: 'Una clase clara y ordenada', en: 'A clear, organized class' }, duration: '3:10', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'read-progress', slug: 'leer-progreso-reportes', categoryId: 'progress', type: 'faq',
      audiences: ['estudiante', 'admin'], keywords: ['progreso', 'notas', 'reportes', 'resultados'],
      title: { es: 'Comprender el progreso y los reportes', en: 'Understand progress and reports' },
      question: { es: '¿Qué significan los indicadores de avance?', en: 'What do progress indicators mean?' },
      summary: { es: 'Interpreta porcentajes, resultados recientes y tendencias.', en: 'Interpret percentages, recent results and trends.' },
      body: [{ es: 'El porcentaje resume el contenido completado. Revisa también las evaluaciones recientes para entender fortalezas y oportunidades.', en: 'The percentage summarizes completed content. Also review recent assessments to understand strengths and opportunities.' }],
      video: { title: { es: 'Cómo leer el progreso', en: 'How to read progress' }, duration: '2:25', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'create-evaluation', slug: 'crear-evaluacion', categoryId: 'progress', type: 'guide',
      audiences: ['profesor'], keywords: ['evaluación', 'quiz', 'notas', 'preguntas'],
      title: { es: 'Crear y publicar una evaluación', en: 'Create and publish an assessment' },
      question: { es: '¿Cómo preparo una evaluación para mi curso?', en: 'How do I prepare an assessment for my class?' },
      summary: { es: 'Configura preguntas, ponderación, tiempo y publicación.', en: 'Configure questions, weighting, time and publication.' },
      body: [{ es: 'Crea la evaluación dentro de la asignatura, añade preguntas y revisa la ponderación antes de publicarla.', en: 'Create the assessment inside the subject, add questions and review weighting before publishing.' }],
      video: { title: { es: 'Evaluaciones de principio a fin', en: 'Assessments from start to finish' }, duration: '5:20', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'notifications', slug: 'gestionar-notificaciones', categoryId: 'communication', type: 'faq',
      audiences: ['estudiante', 'profesor', 'admin'], keywords: ['mensaje', 'aviso', 'notificación', 'comunicación'],
      title: { es: 'Entender las notificaciones', en: 'Understand notifications' },
      question: { es: '¿Dónde encuentro avisos y mensajes?', en: 'Where can I find notices and messages?' },
      summary: { es: 'Consulta mensajes personales, del curso e institucionales.', en: 'Review personal, course and institution messages.' },
      body: [{ es: 'Abre Comunicación desde el menú. Los avisos más recientes aparecen primero y muestran su origen.', en: 'Open Communication from the menu. Recent notices appear first and show their source.' }],
      video: { title: { es: 'Tu bandeja de comunicación', en: 'Your communication inbox' }, duration: '1:50', sourceUrl: null, captionsUrl: null },
    },
    {
      id: 'manage-users', slug: 'gestionar-usuarios', categoryId: 'management', type: 'guide',
      audiences: ['admin'], keywords: ['usuarios', 'roles', 'permisos', 'admin'],
      title: { es: 'Gestionar usuarios y permisos', en: 'Manage users and permissions' },
      question: { es: '¿Cómo modifico un rol de forma segura?', en: 'How do I safely change a role?' },
      summary: { es: 'Valida identidad, aplica el permiso mínimo y revisa la auditoría.', en: 'Validate identity, apply least privilege and review the audit log.' },
      body: [{ es: 'Busca al usuario, revisa su institución y asigna únicamente los permisos necesarios para su función.', en: 'Find the user, review their institution and assign only the permissions required for their function.' }],
      video: { title: { es: 'Administración segura de usuarios', en: 'Secure user administration' }, duration: '4:30', sourceUrl: null, captionsUrl: null },
    },
  ],
}
