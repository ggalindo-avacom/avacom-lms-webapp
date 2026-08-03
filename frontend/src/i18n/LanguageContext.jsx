import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { translations } from './translations'

const LANGUAGE_STORAGE_KEY = 'lms_language'
const DEFAULT_LANGUAGE = 'es'

const LanguageContext = createContext(null)

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return translations[stored] ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readStoredLanguage)

  useEffect(() => {
    document.documentElement.lang = language

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // El idioma sigue funcionando aunque no se pueda recordar.
    }
  }, [language])

  const t = useCallback((key, vars) => {
    let text = translations[language][key] ?? translations[DEFAULT_LANGUAGE][key] ?? key

    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replace(`{${name}}`, value)
      }
    }

    return text
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook y provider comparten módulo a propósito
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider.')
  }

  return context
}
