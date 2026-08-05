import {
  Bell,
  BookOpen,
  Books,
  Broadcast,
  CalendarDots,
  ChartLineUp,
  CheckSquareOffset,
  ClockCounterClockwise,
  Files,
  Question,
  User,
  UsersThree,
} from '@phosphor-icons/react'

const studentMenuItems = [
  { id: 'subjects', Icon: BookOpen, color: '#e5282c', labelKey: 'main.subjects', x: -0.5585, y: -0.973 },
  { id: 'encyclopedia', Icon: Books, color: '#f2c600', labelKey: 'main.encyclopedia', x: -1.117, y: 0 },
  { id: 'progress', Icon: ChartLineUp, color: '#a62080', labelKey: 'main.progress', x: 1.117, y: 0 },
  { id: 'calendar', Icon: CalendarDots, color: '#009c60', labelKey: 'main.calendar', x: -0.5585, y: 0.973 },
  { id: 'communication', Icon: Bell, color: '#c8222f', labelKey: 'main.communication', x: 0.5585, y: -0.973 },
  { id: 'help', Icon: Question, color: '#15a3dd', labelKey: 'main.help', x: 0.5585, y: 0.973 },
  { id: 'profile', Icon: User, color: '#18181b', labelKey: 'main.profile', x: 0, y: 0 },
]

const teacherMenuItems = [
  { id: 'subjects', Icon: BookOpen, color: '#e5282c', labelKey: 'main.subjects', x: -0.5585, y: -0.973 },
  { id: 'encyclopedia', Icon: Books, color: '#52525b', labelKey: 'main.encyclopedia', x: -1.6755, y: -0.973 },
  { id: 'progress', Icon: ChartLineUp, color: '#a62080', labelKey: 'main.progress', x: 1.117, y: 0 },
  { id: 'calendar', Icon: CalendarDots, color: '#009c60', labelKey: 'main.calendar', x: -0.5585, y: 0.973 },
  { id: 'communication', Icon: Bell, color: '#c8222f', labelKey: 'main.communication', x: 0.5585, y: -0.973 },
  { id: 'help', Icon: Question, color: '#52525b', labelKey: 'main.help', x: -2.7925, y: 0.973 },
  { id: 'profile', Icon: User, color: '#18181b', labelKey: 'main.profile', x: 0, y: 0 },
  { id: 'classToday', Icon: Broadcast, color: '#52525b', labelKey: 'main.classToday', x: -1.6755, y: 0.973 },
  { id: 'history', Icon: ClockCounterClockwise, color: '#52525b', labelKey: 'main.history', x: -2.234, y: 0 },
  { id: 'reports', Icon: Files, color: '#52525b', labelKey: 'main.reports', x: -2.7925, y: -0.973 },
  { id: 'students', Icon: UsersThree, color: '#15a3dd', labelKey: 'main.students', x: 0.5585, y: 0.973 },
  { id: 'attendance', Icon: CheckSquareOffset, color: '#f2c600', labelKey: 'main.attendance', x: -1.117, y: 0 },
]

export function getMenuItems(role) {
  return role === 'profesor' ? teacherMenuItems : studentMenuItems
}
