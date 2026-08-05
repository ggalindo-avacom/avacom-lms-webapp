function ModuleChip({ children, tone = 'info' }) {
  return <span className={`module-chip module-chip--${tone}`}>{children}</span>
}

export default ModuleChip
