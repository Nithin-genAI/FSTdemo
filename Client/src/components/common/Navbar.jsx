import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/home'

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav neu-card">
        <Link className="top-nav-brand" to={isHome ? '/home' : '/signup'}>
          <span className="top-nav-mark">C</span>
          <span className="top-nav-name">Curio</span>
        </Link>
        <span className="top-nav-tagline">Personalized AI Companion</span>
      </nav>
    </header>
  )
}

export default Navbar
