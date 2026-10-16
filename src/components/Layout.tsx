import { Link, NavLink, Outlet } from 'react-router'
import { profile } from '../lib/content'
import { track } from '../lib/analytics'
import { useReveal } from '../lib/useReveal'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
  useReveal()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="wrap">
          <Link to="/" className="brand">
            {profile.name}
          </Link>
          <nav className="nav" aria-label="Main">
            <NavLink to="/work">Work</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          {profile.available && <span className="status">Available for new projects</span>}
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="wrap">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <nav aria-label="Elsewhere">
            <a href={profile.links.github} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'github' } })}>
              GitHub
            </a>
            <a href={profile.links.linkedin} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'linkedin' } })}>
              LinkedIn
            </a>
            {profile.links.resume && (
              <a href={profile.links.resume} onClick={() => track({ name: 'contact_click', params: { channel: 'resume' } })}>
                Résumé
              </a>
            )}
          </nav>
        </div>
      </footer>
    </>
  )
}
