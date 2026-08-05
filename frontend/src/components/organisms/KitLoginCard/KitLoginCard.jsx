import KitField from '../../atoms/KitField/KitField'
import KitLogo from '../../atoms/KitLogo/KitLogo'
import KitTapIcon from '../../atoms/KitTapIcon/KitTapIcon'
import KitRoleButton from '../../molecules/KitRoleButton/KitRoleButton'
import { useLanguage } from '../../../i18n/LanguageContext'
import './KitLoginCard.css'

/* Roles de demostración del prototipo. Las iniciales son de los usuarios de
   ejemplo (Samuel Rodríguez, Claudia Torres, Andrés Cárdenas). */
const demoRoles = [
  { id: 'estudiante', initials: 'SR', labelKey: 'kit.demoStudent', variant: 'primary' },
  { id: 'profesor', initials: 'CT', labelKey: 'kit.demoTeacher', variant: 'dark' },
  { id: 'admin', initials: 'AC', labelKey: 'kit.demoAdmin', variant: 'ghost' },
]

function KitLoginCard({ onDemoAccess }) {
  const { t } = useLanguage()

  return (
    <section className="kit-login-card">
      <KitLogo />
      <p className="kit-login-card__sub">{t('kit.subtitle')}</p>

      {/* Campos de referencia: el acceso real todavía no está conectado, así
          que van deshabilitados como en el prototipo. */}
      <KitField
        id="kit-login-username"
        name="username"
        type="text"
        label={t('kit.username')}
        placeholder={t('kit.usernamePlaceholder')}
        autoComplete="username"
        disabled
      />
      <KitField
        id="kit-login-password"
        name="password"
        type="password"
        label={t('kit.password')}
        placeholder={t('kit.passwordPlaceholder')}
        autoComplete="current-password"
        disabled
      />

      <p className="kit-login-card__note">
        <KitTapIcon /> {t('kit.note')}
      </p>

      {demoRoles.map((role) => (
        <KitRoleButton
          key={role.id}
          initials={role.initials}
          label={t(role.labelKey)}
          variant={role.variant}
          onClick={() => onDemoAccess(role.id)}
        />
      ))}
    </section>
  )
}

export default KitLoginCard
