/* El prototipo usa el icono "hand-tap" de Phosphor vía CDN. Aquí va dibujado
   en línea para que la pantalla no dependa de una fuente de iconos remota. */
function KitTapIcon() {
  return (
    <svg
      width="1.15em"
      height="1.15em"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="128" cy="128" r="30" fill="currentColor" stroke="none" />
      <path d="M74 74a76 76 0 0 0 0 108" />
      <path d="M182 182a76 76 0 0 0 0-108" />
    </svg>
  )
}

export default KitTapIcon
