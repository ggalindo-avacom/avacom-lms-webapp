/* Perfil — datos de demostración y prompt de implementación para backend.

   ================= CONTRATO BACKEND + JWT =================

   Autenticación existente:
     - POST /api/auth/token/         body: { email, password }
       → { access, refresh }
     - POST /api/auth/token/refresh/ body: { refresh }
       → { access }
     - Las rutas privadas reciben `Authorization: Bearer <access>`.
     - El rol SIEMPRE se deriva del usuario autenticado. `?role=` y
       `forcedRole` existen exclusivamente para esta demostración visual.

   Modelo de respuesta sugerido `ProfileBootstrapResponse`:
     - profile: id, name, shortName, initials, email, role, status,
                contextLabel, contextValue, details[]
     - capabilities: canViewTeachingCourses, canResetStudentPassword,
                     canRequestOwnRecovery, canChangeAccessibility
     - teachingCourses[]: id, title, group, schedule, students, progress, tone
     - accessibilityOptions[]: id, label, description

   Endpoints sugeridos:
     - GET /api/profile/me/
         → { data: { profile, capabilities, teachingCourses,
                     accessibilityOptions, accessibilityPreferences } }
     - PATCH /api/profile/me/
         body: campos editables permitidos; requiere JWT del propietario.
     - GET /api/profile/teaching-courses/
         requiere JWT + rol profesor; devolver solo sus asignaciones.
     - POST /api/auth/account-recovery/
         body: { email }; respuesta genérica para no revelar si existe.
         Aplicar rate limit y enviar enlace de un solo uso con expiración.
     - POST /api/profile/students/temporary-password/
         body: { studentEmail, temporaryPassword }
         requiere JWT + permiso `students.reset_password`; validar que el
         estudiante pertenezca a un curso del profesor. Guardar con hash,
         marcar cambio obligatorio al iniciar sesión y registrar auditoría.
     - PATCH /api/profile/accessibility/
         body: { largeText, highContrast, reducedMotion }; requiere JWT.

   Seguridad:
     - Nunca devolver, registrar ni persistir contraseñas en texto plano.
     - `temporaryPassword` es write-only y no forma parte de esta data.
     - Responder 401 para JWT ausente/expirado y 403 para rol sin permiso.
     - El frontend debe refrescar el access token una sola vez ante 401 y,
       si falla, limpiar la sesión y regresar al login.
   =========================================================== */

export const profileDemoData = {
  profiles: {
    estudiante: {
      id: 'usr-ethan-miller',
      name: 'Ethan Miller',
      shortName: 'Ethan',
      initials: 'EM',
      email: 'ethan.miller@avacom.edu',
      role: { es: 'Estudiante', en: 'Student' },
      status: { es: 'Activa', en: 'Active' },
      contextLabel: { es: 'Grupo', en: 'Group' },
      contextValue: '8°B',
      color: 'green',
      details: [
        { label: { es: 'Institución', en: 'Institution' }, value: 'AVACOM Classroom' },
        { label: { es: 'Jornada', en: 'Schedule' }, value: { es: 'Mañana', en: 'Morning' } },
      ],
    },
    profesor: {
      id: 'usr-emily-carter',
      name: 'Emily Carter',
      shortName: 'Ms. Carter',
      initials: 'EC',
      email: 'emily.carter@avacom.edu',
      role: { es: 'Profesora', en: 'Teacher' },
      status: { es: 'Activa', en: 'Active' },
      contextLabel: { es: 'Área', en: 'Area' },
      contextValue: { es: 'Matemáticas', en: 'Mathematics' },
      color: 'gold',
      details: [
        { label: { es: 'Sede', en: 'Campus' }, value: { es: 'Principal', en: 'Main' } },
        { label: { es: 'Cursos activos', en: 'Active courses' }, value: '3' },
      ],
    },
    admin: {
      id: 'usr-michael-johnson',
      name: 'Michael Johnson',
      shortName: 'Michael',
      initials: 'MJ',
      email: 'michael.johnson@avacom.edu',
      role: { es: 'Administrador / Soporte TI', en: 'Administrator / IT Support' },
      status: { es: 'Protegida', en: 'Protected' },
      contextLabel: { es: 'Área', en: 'Area' },
      contextValue: 'TI',
      color: 'violet',
      details: [
        { label: { es: 'Alcance', en: 'Scope' }, value: { es: 'Toda la institución', en: 'Institution-wide' } },
        { label: { es: 'Último acceso', en: 'Last access' }, value: { es: 'Hoy · 08:42', en: 'Today · 08:42' } },
      ],
    },
  },

  capabilitiesByRole: {
    estudiante: { canRequestOwnRecovery: true, canResetStudentPassword: false, canViewTeachingCourses: false },
    profesor: { canRequestOwnRecovery: true, canResetStudentPassword: true, canViewTeachingCourses: true },
    admin: { canRequestOwnRecovery: true, canResetStudentPassword: false, canViewTeachingCourses: false },
  },

  teachingCourses: [
    { id: 'algebra8a', title: 'Álgebra', group: '8°A', schedule: { es: 'Lun y mié · 8:00', en: 'Mon & Wed · 8:00' }, students: 32, progress: 55, tone: 'red' },
    { id: 'algebra8b', title: 'Álgebra', group: '8°B', schedule: { es: 'Mar y jue · 10:00', en: 'Tue & Thu · 10:00' }, students: 12, progress: 60, tone: 'violet' },
    { id: 'geometria8', title: { es: 'Geometría', en: 'Geometry' }, group: '8°C', schedule: { es: 'Vie · 9:00', en: 'Fri · 9:00' }, students: 28, progress: 42, tone: 'green' },
  ],

  accessibilityOptions: [
    { id: 'largeText', label: { es: 'Texto grande', en: 'Large text' }, description: { es: 'Aumenta el tamaño del contenido.', en: 'Increase content size.' } },
    { id: 'highContrast', label: { es: 'Alto contraste', en: 'High contrast' }, description: { es: 'Refuerza colores y separación.', en: 'Strengthen colors and separation.' } },
    { id: 'reducedMotion', label: { es: 'Reducir movimiento', en: 'Reduce motion' }, description: { es: 'Evita animaciones innecesarias.', en: 'Avoid unnecessary animation.' } },
  ],
}
