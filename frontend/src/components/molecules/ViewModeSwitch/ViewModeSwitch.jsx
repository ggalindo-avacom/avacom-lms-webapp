import './ViewModeSwitch.css'

/* Molécula: conmutador segmentado entre dos modos de vista.
   options = [{ id, label, icon }]. */
function ViewModeSwitch({ label, onChange, options, value }) {
  return (
    <div className="view-mode-switch" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`view-mode-switch__option${value === option.id ? ' is-active' : ''}`}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default ViewModeSwitch
