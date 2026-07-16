import HomeAccess from '../../components/organisms/HomeAccess/HomeAccess'
import HomeIntro from '../../components/organisms/HomeIntro/HomeIntro'
import './HomePage.css'

function HomePage() {
  return (
    <main className="home-page">
      <HomeIntro />
      <HomeAccess />
    </main>
  )
}

export default HomePage
