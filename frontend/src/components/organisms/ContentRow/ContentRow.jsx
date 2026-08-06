import './ContentRow.css'

/* Organismo: sección de la videoteca — título + hilera horizontal con
   scroll (estilo fila de streaming). children = mosaicos o carátulas. */
function ContentRow({ children, count, emptyMessage, title }) {
  const hasContent = Array.isArray(children) ? children.some(Boolean) && children.flat().length > 0 : Boolean(children)

  return (
    <section className="content-row">
      <div className="content-row__heading">
        <h2 className="content-row__title">{title}</h2>
        {typeof count === 'number' && <span className="content-row__count">{count}</span>}
      </div>
      {hasContent
        ? <div className="content-row__scroller">{children}</div>
        : <p className="content-row__empty">{emptyMessage}</p>}
    </section>
  )
}

export default ContentRow
