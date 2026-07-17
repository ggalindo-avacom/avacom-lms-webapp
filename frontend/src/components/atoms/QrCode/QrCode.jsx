import { QRCodeSVG } from 'qrcode.react'

import './QrCode.css'

function QrCode({ ariaLabel, size = 180, status, value }) {
  return (
    <div className="qr-code" style={{ '--qr-code-size': `${size + 30}px` }}>
      {value ? (
        <QRCodeSVG
          aria-label={ariaLabel}
          level="M"
          marginSize={1}
          role="img"
          size={size}
          title={ariaLabel}
          value={value}
        />
      ) : (
        <span className="qr-code__status" role="status">{status}</span>
      )}
    </div>
  )
}

export default QrCode
