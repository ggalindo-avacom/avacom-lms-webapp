import QrCode from '../../atoms/QrCode/QrCode'
import './QrAccess.css'

function QrAccess({ accessUrl, error, isLoading }) {
  return (
    <div className="qr-access">
      <QrCode
        ariaLabel="Código QR de acceso"
        status={isLoading ? 'Generando código QR…' : 'Código QR no disponible'}
        value={accessUrl}
      />
      <p>
        Escanea este código con tu dispositivo
        <br />
        AVACOM para iniciar sesión.
      </p>
      {error ? (
        <small className="qr-access__error">No se pudo conectar con el backend.</small>
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
