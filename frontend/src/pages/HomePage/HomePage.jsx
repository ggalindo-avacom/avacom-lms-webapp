import HomeAccess from '../../components/organisms/HomeAccess/HomeAccess'
import HomeIntro from '../../components/organisms/HomeIntro/HomeIntro'
import { useHostNetwork } from '../../hooks/useHostNetwork'
import './HomePage.css'

function HomePage() {
  const hostNetwork = useHostNetwork()

  return (
    <main className="home-page">
      <HomeIntro />
      <HomeAccess hostNetwork={hostNetwork} />
    </main>
  )
}

export default HomePage
