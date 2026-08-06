import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Lifebuoy, RocketLaunch } from '@phosphor-icons/react'

import helpLogo from '../../assets/help/white-logo.svg?no-inline'
import HelpArticleCard from '../../components/molecules/HelpArticleCard/HelpArticleCard'
import HelpCategoryCard from '../../components/molecules/HelpCategoryCard/HelpCategoryCard'
import HelpSearch from '../../components/molecules/HelpSearch/HelpSearch'
import HelpArticleViewer from '../../components/organisms/HelpArticleViewer/HelpArticleViewer'
import ModuleLayout from '../../components/templates/ModuleLayout/ModuleLayout'
import { helpDemoData } from '../../data/helpDemoData'
import { prototypeProfiles } from '../../data/lmsPrototypeData'
import { useLanguage } from '../../i18n/LanguageContext'
import './HelpPage.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

function pick(language, texts) {
  if (!texts) return ''
  return language === 'en' ? texts.en : texts.es
}

function normalize(value) {
  return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/* View independiente del centro de ayuda.
   Entradas: data normalizada, rol de demo, categoría inicial y callbacks de
   analítica/apertura. En producción el backend filtra documentos por rol. */
function HelpPage({
  data = helpDemoData,
  forcedRole,
  initialCategory = 'getting-started',
  onArticleOpen,
  onVideoPlay,
}) {
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()
  const requestedRole = searchParams.get('role')
  const role = forcedRole ?? (prototypeProfiles[requestedRole] ? requestedRole : 'estudiante')
  const [categoryId, setCategoryId] = useState(initialCategory)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const roleDocuments = useMemo(
    () => data.documents.filter((document) => document.audiences.includes(role)),
    [data.documents, role],
  )

  const categories = data.categories.filter((category) => roleDocuments.some((document) => document.categoryId === category.id))
  const normalizedQuery = normalize(query.trim())
  const matchingDocuments = roleDocuments.filter((document) => {
    if (!normalizedQuery) return document.categoryId === categoryId
    const searchable = [document.title.es, document.title.en, document.question.es, document.question.en, document.summary.es, document.summary.en, ...document.keywords].join(' ')
    return normalize(searchable).includes(normalizedQuery)
  })
  const selectedArticle = matchingDocuments.find((document) => document.id === selectedId) ?? matchingDocuments[0] ?? null

  const chooseCategory = (nextCategory) => {
    setCategoryId(nextCategory)
    setQuery('')
    setSelectedId(null)
  }

  const chooseArticle = (article) => {
    setSelectedId(article.id)
    onArticleOpen?.(article, { role })
  }

  return (
    <ModuleLayout
      activeModule="help"
      language={language}
      logoSrc={helpLogo}
      navigation="main"
      role={role}
      title={localize(language, 'Centro de ayuda', 'Help center')}
      variant="help"
    >
      <div className="help-page">
        <header className="help-page__hero">
          <div className="help-page__hero-copy">
            <span><Lifebuoy aria-hidden="true" weight="fill" /> {localize(language, 'Estamos para ayudarte', 'We are here to help')}</span>
            <h1>{localize(language, '¿Qué quieres aprender hoy?', 'What would you like to learn today?')}</h1>
            <p>{localize(language, 'Encuentra respuestas sencillas, guías paso a paso y vídeos cortos.', 'Find simple answers, step-by-step guides and short videos.')}</p>
            <HelpSearch language={language} value={query} onChange={(value) => { setQuery(value); setSelectedId(null) }} />
          </div>
          <button className="help-page__start" type="button" onClick={() => chooseCategory('getting-started')}>
            <RocketLaunch aria-hidden="true" weight="duotone" />
            <span><small>{localize(language, 'Acceso rápido', 'Quick access')}</small><strong>{localize(language, 'Primeros pasos', 'Getting started')}</strong></span>
            <ArrowRight aria-hidden="true" weight="bold" />
          </button>
        </header>

        <section className="help-categories" aria-labelledby="help-categories-title">
          <div className="help-page__heading">
            <div>
              <span>{localize(language, 'Explora por tema', 'Explore by topic')}</span>
              <h2 id="help-categories-title">{localize(language, 'Categorías', 'Categories')}</h2>
            </div>
            <small>{categories.length} {localize(language, 'categorías', 'categories')}</small>
          </div>
          <div className="help-categories__row">
            {categories.map((category) => (
              <HelpCategoryCard
                key={category.id}
                active={!query && categoryId === category.id}
                category={category}
                count={roleDocuments.filter((document) => document.categoryId === category.id).length}
                language={language}
                onSelect={chooseCategory}
              />
            ))}
          </div>
        </section>

        <section className="help-library" aria-labelledby="help-results-title">
          <div className="help-library__list">
            <div className="help-page__heading">
              <div>
                <span>{query ? localize(language, 'Resultados de búsqueda', 'Search results') : localize(language, 'Preguntas frecuentes', 'Frequently asked questions')}</span>
                <h2 id="help-results-title">
                  {query ? `“${query}”` : pick(language, data.categories.find((category) => category.id === categoryId)?.label)}
                </h2>
              </div>
              <small>{matchingDocuments.length}</small>
            </div>

            <div className="help-library__cards">
              {matchingDocuments.map((article) => (
                <HelpArticleCard
                  key={article.id}
                  active={selectedArticle?.id === article.id}
                  article={article}
                  language={language}
                  onSelect={chooseArticle}
                />
              ))}
              {matchingDocuments.length === 0 && (
                <div className="help-library__empty">
                  <Lifebuoy aria-hidden="true" weight="duotone" />
                  <strong>{localize(language, 'No encontramos esa respuesta', 'We could not find that answer')}</strong>
                  <span>{localize(language, 'Prueba con palabras como contraseña, tarea, notas o mensajes.', 'Try words such as password, homework, grades or messages.')}</span>
                </div>
              )}
            </div>
          </div>

          <HelpArticleViewer article={selectedArticle} language={language} onVideoPlay={(article) => onVideoPlay?.(article, { role })} />
        </section>
      </div>
    </ModuleLayout>
  )
}

export default HelpPage
