import { Outlet } from 'react-router-dom'
import { authHeroContent, heroMetrics } from '../../data/siteContent.js'
import '../../App.css'

function AuthLayout() {
  return (
    <main className="page-shell">
      <section className="auth-layout">
        <aside className="hero-panel neu-card">
          <div>
            <span className="brand-mark">C</span>
          </div>

          <div className="hero-copy">
            <span className="eyebrow">{authHeroContent.eyebrow}</span>
            <h1>{authHeroContent.title}</h1>
            <p>{authHeroContent.description}</p>
          </div>

          <div className="hero-metrics">
            {heroMetrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </aside>

        <section className="form-panel neu-card">
          <Outlet />
        </section>
      </section>
    </main>
  )
}

export default AuthLayout
