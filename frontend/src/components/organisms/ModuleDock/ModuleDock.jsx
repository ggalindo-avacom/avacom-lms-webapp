import { createElement } from 'react'
import {
  BookOpen,
  Books,
  Broadcast,
  ChalkboardTeacher,
  Question,
  SignOut,
  SquaresFour,
  Student,
} from '@phosphor-icons/react'

const dockByRole = {
  estudiante: [
    { id: 'menu', Icon: SquaresFour, es: 'Menú', en: 'Menu' },
    { id: 'subjects', Icon: BookOpen, es: 'Asignaturas', en: 'Subjects' },
    { id: 'encyclopedia', Icon: Books, es: 'Enciclopedia', en: 'Encyclopedia' },
    { id: 'help', Icon: Question, es: 'Ayuda', en: 'Help' },
  ],
  profesor: [
    { id: 'menu', Icon: SquaresFour, es: 'Menú', en: 'Menu' },
    { id: 'subjects', Icon: BookOpen, es: 'Asignaturas', en: 'Subjects' },
    { id: 'classToday', Icon: Broadcast, es: 'Clase de hoy', en: "Today's class" },
    { id: 'encyclopedia', Icon: Books, es: 'Enciclopedia', en: 'Encyclopedia' },
    { id: 'help', Icon: Question, es: 'Ayuda', en: 'Help' },
  ],
  admin: [
    { id: 'menu', Icon: SquaresFour, es: 'Menú', en: 'Menu' },
    { id: 'teachers', Icon: ChalkboardTeacher, es: 'Profesores', en: 'Teachers' },
    { id: 'students', Icon: Student, es: 'Estudiantes', en: 'Students' },
    { id: 'help', Icon: Question, es: 'Ayuda', en: 'Help' },
  ],
}

function ModuleDock({ activeModule, language, onNavigate, onSignOut, role }) {
  const items = dockByRole[role] ?? dockByRole.estudiante

  return (
    <aside className="module-dock" aria-label={language === 'en' ? 'Module navigation' : 'Navegación de módulos'}>
      <nav>
        {items.map(({ id, Icon, es, en }) => (
          <button
            className={`module-dock__item${activeModule === id ? ' is-active' : ''}`}
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
          >
            {createElement(Icon, { 'aria-hidden': true, weight: 'regular' })}
            <span>{language === 'en' ? en : es}</span>
          </button>
        ))}
      </nav>
      <button className="module-dock__item module-dock__item--logout" type="button" onClick={onSignOut}>
        <SignOut aria-hidden="true" weight="regular" />
        <span>{language === 'en' ? 'Sign out' : 'Cerrar sesión'}</span>
      </button>
    </aside>
  )
}

export default ModuleDock
