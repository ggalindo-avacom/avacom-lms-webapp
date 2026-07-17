import QrCode from '../../atoms/QrCode/QrCode'
import './WifiNetworkQr.css'

function WifiNetworkQr({ error, isLoading, wifi }) {
  const qrPayload = wifi?.qr_payload || ''
  const networkName = wifi?.ssid || ''

  return (
    <div className="wifi-network-qr">
      <p className="wifi-network-qr__label">Conéctate a la misma red</p>
      <QrCode
        ariaLabel={networkName ? `Conectar a la red ${networkName}` : 'Código QR de red Wi-Fi'}
        size={140}
        status={isLoading ? 'Consultando red…' : 'Red Wi-Fi no disponible'}
        value={qrPayload}
      />
      {networkName && <p className="wifi-network-qr__name" title={networkName}>{networkName}</p>}
      {error && <small className="wifi-network-qr__error">No se pudo consultar la red del servidor.</small>}
    </div>
  )
}

export default WifiNetworkQr
