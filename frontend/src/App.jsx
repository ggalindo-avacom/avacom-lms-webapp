import LanguageSwitch from './components/atoms/LanguageSwitch/LanguageSwitch'
import { LanguageProvider } from './i18n/LanguageContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <LanguageProvider>
      <LanguageSwitch />
      <AppRoutes />
    </LanguageProvider>
  )
}

export default App
