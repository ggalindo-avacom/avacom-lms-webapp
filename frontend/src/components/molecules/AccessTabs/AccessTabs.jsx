import qrIcon from '../../../assets/codigo-qr.png'
import { useLanguage } from '../../../i18n/LanguageContext'
import './AccessTabs.css'

function AccessTabs({ activeTab, onChange }) {
  const { t } = useLanguage()

  return (
    <div className="access-tabs" role="tablist" aria-label={t('access.tabsAria')}>
      <button
        className={activeTab === 'qr' ? 'is-active' : ''}
        type="button"
        role="tab"
        aria-selected={activeTab === 'qr'}
        onClick={() => onChange('qr')}
      >
        <img
          className="access-tabs__qr-icon"
          src={qrIcon}
          alt=""
          aria-hidden="true"
        />
        {t('access.tabQr')}
      </button>
      <button
        className={activeTab === 'credentials' ? 'is-active' : ''}
        type="button"
        role="tab"
        aria-selected={activeTab === 'credentials'}
        onClick={() => onChange('credentials')}
      >
        <span aria-hidden="true">♙</span>
        {t('access.tabCredentials')}
      </button>
    </div>
  )
}

export default AccessTabs
