function ModuleCard({ children, className = '', title }) {
  return (
    <section className={`module-card${className ? ` ${className}` : ''}`}>
      {title && <h3>{title}</h3>}
      {children}
    </section>
  )
}

export default ModuleCard
