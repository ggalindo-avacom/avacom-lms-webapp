import KitAvatar from '../../atoms/KitAvatar/KitAvatar'
import KitButton from '../../atoms/KitButton/KitButton'

/* Botón de acceso de demostración: avatar con iniciales + etiqueta del rol. */
function KitRoleButton({ initials, label, variant, onClick }) {
  return (
    <KitButton size="big" variant={variant} onClick={onClick}>
      <KitAvatar initials={initials} />
      {label}
    </KitButton>
  )
}

export default KitRoleButton
