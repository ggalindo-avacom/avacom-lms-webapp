import './KitButton.css'

function KitButton({
  children,
  size = 'md',
  type = 'button',
  variant = 'ghost',
  ...props
}) {
  const className = [
    'kit-btn',
    `kit-btn--${variant}`,
    size === 'md' ? '' : `kit-btn--${size}`,
  ].filter(Boolean).join(' ')

  return (
    <button className={className} type={type} {...props}>
      {children}
    </button>
  )
}

export default KitButton
