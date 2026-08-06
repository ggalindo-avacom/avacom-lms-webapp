import { GraduationCap, ShieldCheck, User } from '@phosphor-icons/react'

import HexIndicator from '../../atoms/HexIndicator/HexIndicator'
import ModuleChip from '../../atoms/ModuleChip/ModuleChip'
import './ProfileIdentity.css'

function pick(language, texts) {
  if (typeof texts === 'string') return texts
  return language === 'en' ? texts.en : texts.es
}

/* Organismo de identidad: reutiliza el átomo hexagonal del sistema AVACOM
   para presentar identidad, contexto académico y estado de cuenta. */
function ProfileIdentity({ language = 'es', profile }) {
  return (
    <section className="profile-identity" aria-labelledby="profile-identity-name">
      <div className="profile-identity__hexagons" aria-label={language === 'en' ? 'Profile summary' : 'Resumen del perfil'}>
        <HexIndicator color={profile.color} icon={<User weight="duotone" />} value={profile.initials} label={profile.name} />
        <HexIndicator color="violet" icon={<GraduationCap weight="duotone" />} value={pick(language, profile.contextValue)} label={pick(language, profile.contextLabel)} />
        <HexIndicator color="green" icon={<ShieldCheck weight="duotone" />} value={pick(language, profile.status)} label={language === 'en' ? 'Account' : 'Cuenta'} />
      </div>

      <div className="profile-identity__details">
        <ModuleChip tone="info">{pick(language, profile.role)}</ModuleChip>
        <h2 id="profile-identity-name">{profile.name}</h2>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <dl>
          {profile.details.map((detail) => (
            <div key={pick(language, detail.label)}>
              <dt>{pick(language, detail.label)}</dt>
              <dd>{pick(language, detail.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default ProfileIdentity
