import logo from '../../../assets/avacom-lms-kit-logo.svg'
import './KitLogo.css'

function KitLogo({ width = 150 }) {
  return (
    <img
      className="kit-logo"
      src={logo}
      alt="AVACOM LMS"
      width={width}
    />
  )
}

export default KitLogo
