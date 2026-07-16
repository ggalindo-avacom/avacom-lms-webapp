import './Button.css'

function Button({ children, isLoading = false, ...props }) {
  return (
    <button className="button" disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Ingresando...' : children}
    </button>
  )
}

export default Button
