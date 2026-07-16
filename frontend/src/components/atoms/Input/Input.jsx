import './Input.css'

function Input({ id, label, error, ...props }) {
  const errorId = `${id}-error`

  return (
    <div className="input-field">
      <label className="input-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className={`input-field__control${error ? ' input-field__control--error' : ''}`}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span className="input-field__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
