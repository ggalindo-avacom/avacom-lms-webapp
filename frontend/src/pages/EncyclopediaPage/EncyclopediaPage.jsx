import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Play } from '@phosphor-icons/react'

import ModuleChip from '../../components/atoms/ModuleChip/ModuleChip'
import ContentFilters from '../../components/molecules/ContentFilters/ContentFilters'
import ContentTile from '../../components/molecules/ContentTile/ContentTile'
import DocumentCover from '../../components/molecules/DocumentCover/DocumentCover'
import ResourcePreview from '../../components/molecules/ResourcePreview/ResourcePreview'
import ContentRow from '../../components/organisms/ContentRow/ContentRow'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { encyclopediaDemoData } from '../../data/encyclopediaDemoData'
import { useLanguage } from '../../i18n/LanguageContext'
import './EncyclopediaPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function pick(language, texts) {
  if (!texts) return ''
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Mismo criterio de filtrado que aplicará el backend en
   GET /api/encyclopedia/resources/?grade=&standard=. */
function matchesFilters(resource, { grade, standard }) {
  const gradeOk = grade === 'all' || resource.grades?.includes(grade)
  const standardOk = standard === 'all' || resource.standards?.includes(standard)
  return gradeOk && standardOk
}

/* View pública y reutilizable del módulo Enciclopedia.
   Entradas del prototipo:
   - data: contrato completo de filtros, experiencia por rol y recursos.
   - forcedRole: permite montar la demo de estudiante/profesor/admin.
   - initialFilters: permite abrir la biblioteca en un contexto curricular.
   - onResourceSelect/onResourceAction: puntos de integración con analítica,
     reproductor, asignaciones del profesor o administración del catálogo. */
function EncyclopediaPage({
  data = encyclopediaDemoData,
  forcedRole,
  initialFilters = { grade: 'all', standard: 'all' },
  onResourceAction,
  onResourceSelect,
}) {
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const experience = data.roleExperience[role] ?? data.roleExperience.estudiante
  const title = localize(language, 'Enciclopedia', 'Encyclopedia')
  const [filters, setFilters] = useState(initialFilters)
  const [selectedResource, setSelectedResource] = useState(null)
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => ({
    classContent: data.classContent.filter((item) => matchesFilters(item, filters)),
    documents: data.documents.filter((item) => matchesFilters(item, filters)),
    stateExams: data.stateExams.filter((item) => matchesFilters(item, filters)),
  }), [data, filters])

  const allResources = [...data.classContent, ...data.stateExams, ...data.documents]
  const featuredResource = allResources.find((item) => item.id === data.featured.resourceId) ?? data.stateExams[0]
  const totalResults = filtered.classContent.length + filtered.stateExams.length + filtered.documents.length
  const emptyMessage = localize(language, 'No hay contenido para este filtro todavía.', 'No content for this filter yet.')

  const selectResource = (resource) => {
    setNotice('')
    setSelectedResource(resource)
    onResourceSelect?.(resource, { role })
  }

  const completeAction = (resource) => {
    onResourceAction?.(resource, { role })
    setSelectedResource(null)
    setNotice(`${pick(language, experience.confirmation)}: ${pick(language, resource.title)}`)
  }

  return (
    <ModuleLayout activeModule="encyclopedia" language={language} navigation="main" role={role} title={title}>
      <header className="encyclopedia-intro">
        <div>
          <h1>{title}</h1>
          <p className="module-subtitle">
            {localize(language, 'Aprende con una biblioteca clara, visual y hecha para explorar.', 'Learn with a clear, visual library made for exploring.')}
          </p>
        </div>
        <div className="encyclopedia-role" aria-label={pick(language, experience.badge)}>
          <ModuleChip tone="info">{pick(language, experience.badge)}</ModuleChip>
          <span>{pick(language, experience.helper)}</span>
        </div>
      </header>

      <section className="encyclopedia-hero" aria-labelledby="encyclopedia-featured-title">
        <div className="encyclopedia-hero__content">
          <ModuleChip tone="warn">{pick(language, data.featured.eyebrow)}</ModuleChip>
          <h2 id="encyclopedia-featured-title">{pick(language, data.featured.title)}</h2>
          <p>{pick(language, data.featured.description)}</p>
          <button className="encyclopedia-hero__cta" type="button" onClick={() => selectResource(featuredResource)}>
            <Play aria-hidden="true" weight="fill" /> {pick(language, data.featured.cta)}
          </button>
        </div>
        <div className="encyclopedia-hero__art" aria-hidden="true">
          <span>ICFES</span>
          <strong>11°</strong>
        </div>
      </section>

      <div className="encyclopedia-toolbar">
        <ContentFilters
          grade={filters.grade}
          grades={data.filters.grades}
          language={language}
          standard={filters.standard}
          standards={data.filters.standards}
          onChange={setFilters}
          onReset={() => setFilters({ grade: 'all', standard: 'all' })}
        />
        <p className="encyclopedia-results" aria-live="polite">
          {totalResults} {localize(language, totalResults === 1 ? 'recurso' : 'recursos', totalResults === 1 ? 'resource' : 'resources')}
        </p>
      </div>

      {notice && (
        <p className="encyclopedia-notice" role="status">
          <CheckCircle aria-hidden="true" weight="fill" /> {notice}
        </p>
      )}

      <ContentRow title={localize(language, 'Contenido de clases', 'Class content')} count={filtered.classContent.length} emptyMessage={emptyMessage}>
        {filtered.classContent.map((item) => (
          <ContentTile
            key={item.id}
            eyebrow={localize(language, 'Clase', 'Class')}
            kind={item.kind}
            language={language}
            meta={item.meta}
            title={item.title}
            tone={item.tone}
            onSelect={() => selectResource(item)}
          />
        ))}
      </ContentRow>

      <ContentRow title={localize(language, 'Exámenes estatales', 'State exams')} count={filtered.stateExams.length} emptyMessage={emptyMessage}>
        {filtered.stateExams.map((item) => (
          <ContentTile
            key={item.id}
            eyebrow={localize(language, 'Preparación', 'Preparation')}
            kind={item.kind}
            language={language}
            meta={item.meta}
            title={item.title}
            tone={item.tone}
            onSelect={() => selectResource(item)}
          />
        ))}
      </ContentRow>

      <ContentRow title={localize(language, 'Documentos y libros', 'Documents and books')} count={filtered.documents.length} emptyMessage={emptyMessage}>
        {filtered.documents.map((item) => (
          <DocumentCover
            key={item.id}
            language={language}
            meta={item.meta}
            title={item.title}
            tone={item.tone}
            onSelect={() => selectResource(item)}
          />
        ))}
      </ContentRow>

      <ResourcePreview
        experience={experience}
        language={language}
        resource={selectedResource}
        onAction={completeAction}
        onClose={() => setSelectedResource(null)}
      />
    </ModuleLayout>
  )
}

export default EncyclopediaPage
