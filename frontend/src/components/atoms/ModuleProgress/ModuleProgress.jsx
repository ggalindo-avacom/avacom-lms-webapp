function ModuleProgress({ value }) {
  return (
    <div className="module-progress" aria-label={`${value}%`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export default ModuleProgress
