import qrIcon from '../../../assets/codigo-qr.png'
import './AccessTabs.css'

function AccessTabs({ activeTab, onChange }) {
  return (
    <div className="access-tabs" role="tablist" aria-label="Método de acceso">
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
        Código QR
      </button>
      <button
        className={activeTab === 'credentials' ? 'is-active' : ''}
        type="button"
        role="tab"
        aria-selected={activeTab === 'credentials'}
        onClick={() => onChange('credentials')}
      >
        <span aria-hidden="true">♙</span>
        Credenciales
      </button>
    </div>
  )
}

export default AccessTabs
