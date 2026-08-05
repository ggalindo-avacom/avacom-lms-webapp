function ModuleInfoRow({ label, value }) {
  return (
    <div className="module-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default ModuleInfoRow
