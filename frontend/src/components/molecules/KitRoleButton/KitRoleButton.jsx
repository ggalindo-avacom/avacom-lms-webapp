import KitAvatar from '../../atoms/KitAvatar/KitAvatar'
import KitButton from '../../atoms/KitButton/KitButton'

function KitRoleButton({ initials, label, variant, onClick }) {
  return (
    <KitButton size="big" variant={variant} onClick={onClick}>
      <KitAvatar initials={initials} />
      {label}
    </KitButton>
  )
}

export default KitRoleButton
