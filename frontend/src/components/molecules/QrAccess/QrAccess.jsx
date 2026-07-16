import './QrAccess.css'

const cells = [
  [8,2],[10,2],[13,2],[9,3],[11,4],[14,4],[7,6],[9,6],[12,6],[15,6],[17,6],
  [4,7],[6,7],[8,7],[11,7],[14,7],[17,7],[3,8],[5,8],[9,8],[12,8],[15,8],
  [6,10],[8,10],[10,10],[13,10],[16,10],[5,11],[9,11],[12,11],[15,11],[17,11],
  [7,13],[10,13],[12,13],[14,13],[17,13],[8,14],[11,14],[15,14],[7,16],
  [10,16],[13,16],[16,16],[18,16],[8,17],[11,17],[15,17],[9,18],[13,18],[17,18],
]

function Finder({ x, y }) {
  return <><rect x={x} y={y} width="30" height="30" rx="5" fill="none" stroke="currentColor" strokeWidth="6" /><rect x={x + 10} y={y + 10} width="10" height="10" rx="2" fill="currentColor" /></>
}

function QrAccess() {
  return (
    <div className="qr-access">
      <div className="qr-access__code">
        <svg viewBox="0 0 200 200" role="img" aria-label="Código QR de acceso">
          <Finder x={12} y={12} /><Finder x={158} y={12} /><Finder x={12} y={158} />
          {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x * 10} y={y * 10} width="8" height="8" rx="1.5" fill="currentColor" />)}
        </svg>
      </div>
      <p>Escanea este código con tu dispositivo<br />AVACOM para iniciar sesión.</p>
      <small><i aria-hidden="true" /> Esperando escaneo...</small>
    </div>
  )
}

export default QrAccess
