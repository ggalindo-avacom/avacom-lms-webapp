import { QRCodeSVG } from 'qrcode.react'

import './QrAccess.css'

function QrAccess({ accessUrl, error, isLoading }) {
  return (
    <div className="qr-access">
      <div className="qr-access__code">
        {accessUrl ? (
          <QRCodeSVG
            aria-label="Código QR de acceso"
            level="M"
            marginSize={1}
            role="img"
            size={180}
            title="Código QR de acceso"
            value={accessUrl}
          />
        ) : (
          <span className="qr-access__status" role="status">
            {isLoading ? 'Generando código QR…' : 'Código QR no disponible'}
          </span>
        )}
      </div>
      <p>
        Escanea este código con tu dispositivo
        <br />
        AVACOM para iniciar sesión.
      </p>
      {error ? (
        <small className="qr-access__error">
          No se pudo conectar con el backend.
        </small>
      ) : (
        <small>
          <i aria-hidden="true" />
          {isLoading ? 'Consultando red...' : 'Esperando escaneo...'}
        </small>
      )}
    </div>
  )
}

export default QrAccess
