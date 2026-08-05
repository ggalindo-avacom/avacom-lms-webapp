import { useLayoutEffect, useRef } from 'react'
import anime from 'animejs'

import HomeAccess from '../../components/organisms/HomeAccess/HomeAccess'
import HomeIntro from '../../components/organisms/HomeIntro/HomeIntro'
import { useHostNetwork } from '../../hooks/useHostNetwork'
import './HomePage.css'

function HomePage() {
  const hostNetwork = useHostNetwork()
  const pageRef = useRef(null)

  /* Entrada del lienzo con anime.js: el logo de Avacom aparece primero
     (0 → 1 en 1.5s) y el resto de la pantalla lo sigue con 500ms de delay. */
  useLayoutEffect(() => {
    const page = pageRef.current

    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const logo = page.querySelector('.avacom-logo')
    const rest = [...page.querySelectorAll(
      '.home-intro__content, .home-intro__network, .home-intro__features, .home-access',
    )]
    const targets = [logo, ...rest].filter(Boolean)

    // Se ocultan antes del primer pintado para que no haya destello inicial.
    anime.set(targets, { opacity: 0 })
    anime({ targets: logo, opacity: [0, 1], duration: 1500, easing: 'easeOutQuad' })
    anime({ targets: rest, opacity: [0, 1], duration: 1500, delay: 500, easing: 'easeOutQuad' })

    return () => anime.remove(targets)
  }, [])

  return (
    <main className="home-page" ref={pageRef}>
      <HomeIntro hostNetwork={hostNetwork} />
      {/* HomeAccess incluye el contador en vivo de estudiantes. */}
      <HomeAccess hostNetwork={hostNetwork} />
    </main>
  )
}

export default HomePage
