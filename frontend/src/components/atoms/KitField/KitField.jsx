import './KitField.css'

function KitField({ id, label, ...props }) {
  return (
    <label className="kit-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} />
    </label>
  )
}

export default KitField
