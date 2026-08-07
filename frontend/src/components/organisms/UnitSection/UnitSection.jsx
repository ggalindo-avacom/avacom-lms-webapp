import { ClipboardText, FilePdf, Question } from '@phosphor-icons/react'

import ModuleChip from '../../atoms/ModuleChip/ModuleChip'
import ModuleProgress from '../../atoms/ModuleProgress/ModuleProgress'
import './UnitSection.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function pick(language, texts) {
  if (!texts) return ''
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

function stateChip(item, language) {
  if (item.state === 'graded') return <ModuleChip tone="ok">{item.score?.toFixed(1)}</ModuleChip>
  if (item.state === 'done') return <ModuleChip tone="ok">{localize(language, 'Hecho', 'Done')}</ModuleChip>
  return <ModuleChip tone="warn">{localize(language, 'Pendiente', 'Pending')}</ModuleChip>
}

function ResourceList({ Icon, items, language, title }) {
  if (!items?.length) return null

  return (
    <div className="unit-section__group">
      <h4 className="unit-section__group-title">{Icon && <Icon aria-hidden="true" weight="duotone" />} {title}</h4>
      {items.map((item) => (
        <div className="unit-section__row" key={item.id}>
          <div className="unit-section__copy">
            <strong>{pick(language, item.title)}</strong>
            <small>{pick(language, item.meta)}</small>
          </div>
          {item.state ? stateChip(item, language) : <ModuleChip tone="info">PDF</ModuleChip>}
        </div>
      ))}
    </div>
  )
}

/* Organismo: una unidad en la vista general, con sus documentos, tareas,
   quizzes y la nota de la unidad. */
function UnitSection({ language = 'es', unit }) {
  const nodesDone = unit.nodes.filter((node) => node.status === 'done').length
  const progress = Math.round((nodesDone / unit.nodes.length) * 100)

  return (
    <section className="unit-section" style={{ '--unit-color': unit.color }}>
      <header className="unit-section__header">
        <div>
          <span className="unit-section__eyebrow">
            {localize(language, 'Unidad', 'Unit')} {unit.number}
          </span>
          <h3 className="unit-section__title">{pick(language, unit.title)}</h3>
        </div>
        <div className="unit-section__status">
          {unit.status === 'done' && <ModuleChip tone="ok">{localize(language, 'Dictada', 'Completed')}</ModuleChip>}
          {unit.status === 'active' && <ModuleChip tone="info">{localize(language, 'En curso', 'In progress')}</ModuleChip>}
          {unit.status === 'locked' && <ModuleChip tone="warn">{localize(language, 'Pendiente', 'Pending')}</ModuleChip>}
          <span className="unit-section__grade">
            {localize(language, 'Nota', 'Grade')}: <strong>{unit.grade === null ? '—' : unit.grade.toFixed(1)}</strong>
          </span>
        </div>
      </header>

      <ModuleProgress value={progress} />

      <div className="unit-section__groups">
        <ResourceList Icon={FilePdf} items={unit.documents} language={language} title={localize(language, 'Documentos', 'Documents')} />
        <ResourceList Icon={ClipboardText} items={unit.tasks} language={language} title={localize(language, 'Tareas', 'Tasks')} />
        <ResourceList Icon={Question} items={unit.quizzes} language={language} title={localize(language, 'Quizzes', 'Quizzes')} />
      </div>
    </section>
  )
}

export default UnitSection
