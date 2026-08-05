const modulePathsByRole = {
  estudiante: {
    subjects: '/lista-asignaturas/',
    encyclopedia: '/enciclopedia/',
    progress: '/progreso/',
    calendar: '/calendario/',
    communication: '/comunicacion/',
    help: '/ayuda/',
    profile: '/perfil/',
  },
  profesor: {
    subjects: '/lista-asignaturas/',
    classToday: '/clase-de-hoy/',
    attendance: '/asistencia/',
    students: '/estudiantes/',
    progress: '/progreso/',
    reports: '/reportes/',
    encyclopedia: '/enciclopedia/',
    communication: '/comunicacion/',
    calendar: '/calendario/',
    history: '/historial/',
    help: '/ayuda/',
    profile: '/perfil/',
  },
  admin: {
    teachers: '/profesores/',
    students: '/administracion/estudiantes/',
    reports: '/reportes/',
    certificates: '/certificados/',
    communication: '/comunicacion/',
    auditLogs: '/logs-bitacora/',
    settings: '/configuraciones/',
    help: '/ayuda/',
    profile: '/perfil/',
  },
}

export function getMainMenuPath(role = 'estudiante') {
  return role === 'estudiante' ? '/mainmenu' : `/mainmenu?role=${role}`
}

export function getModulePath(role = 'estudiante', moduleId) {
  if (moduleId === 'menu') return getMainMenuPath(role)

  const path = modulePathsByRole[role]?.[moduleId]
  if (!path) return getMainMenuPath(role)

  return role === 'estudiante' ? path : `${path}?role=${role}`
}

export function getAssignmentPath(role, assignmentId) {
  const path = `/lista-asignaturas/${assignmentId}/`
  return role === 'estudiante' ? path : `${path}?role=${role}`
}

export { modulePathsByRole }
