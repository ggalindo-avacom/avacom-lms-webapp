import { useLanguage } from '../../../i18n/LanguageContext'
import './LanguageSwitch.css'

const languages = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
]

function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-switch" role="group" aria-label="Idioma / Language">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={language === code ? 'is-active' : ''}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitch
