import HomeAccess from '../../components/organisms/HomeAccess/HomeAccess'
import HomeIntro from '../../components/organisms/HomeIntro/HomeIntro'
import StudentsCounterCard from '../../components/organisms/StudentsCounterCard/StudentsCounterCard'
import { useHostNetwork } from '../../hooks/useHostNetwork'
import './HomePage.css'

function HomePage() {
  const hostNetwork = useHostNetwork()

  return (
    <main className="home-page">
      <HomeIntro hostNetwork={hostNetwork} />
      <HomeAccess hostNetwork={hostNetwork} />
      {/* Paso 7: contador en vivo de estudiantes conectados al login. */}
      <StudentsCounterCard />
    </main>
  )
}

export default HomePage
