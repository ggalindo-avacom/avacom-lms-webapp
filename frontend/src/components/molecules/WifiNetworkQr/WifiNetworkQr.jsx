import QrCode from '../../atoms/QrCode/QrCode'
import { useLanguage } from '../../../i18n/LanguageContext'
import './WifiNetworkQr.css'

function WifiNetworkQr({ error, isLoading, wifi }) {
  const { t } = useLanguage()
  const qrPayload = wifi?.qr_payload || ''
  const networkName = wifi?.ssid || ''

  return (
    <div className="wifi-network-qr">
      <p className="wifi-network-qr__label">{t('wifiQr.label')}</p>
      <QrCode
        ariaLabel={networkName ? t('wifiQr.aria', { name: networkName }) : t('wifiQr.ariaFallback')}
        size={140}
        status={isLoading ? t('wifiQr.loading') : t('wifiQr.unavailable')}
        value={qrPayload}
      />
      {networkName && <p className="wifi-network-qr__name" title={networkName}>{networkName}</p>}
      {error && <small className="wifi-network-qr__error">{t('wifiQr.error')}</small>}
    </div>
  )
}

export default WifiNetworkQr
