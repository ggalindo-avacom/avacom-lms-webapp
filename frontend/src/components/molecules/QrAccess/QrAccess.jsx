import QrCode from '../../atoms/QrCode/QrCode'
import { useLanguage } from '../../../i18n/LanguageContext'
import './QrAccess.css'

function QrAccess({ accessUrl = '', error = '', isLoading = false }) {
  const { t } = useLanguage()

  return (
    <div className="qr-access">
      <QrCode
        ariaLabel={t('qrAccess.aria')}
        status={isLoading ? t('qrAccess.loading') : t('qrAccess.unavailable')}
        value={accessUrl}
      />
      <p>
        {t('qrAccess.scanLine1')}
        <br />
        {t('qrAccess.scanLine2')}
      </p>
      {error && (
        <small className="qr-access__error">
          {t('qrAccess.errorPrefix')} {error}
        </small>
      )}
    </div>
  )
}

export default QrAccess
