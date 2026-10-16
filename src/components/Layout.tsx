import { Link, NavLink, Outlet } from 'react-router'
import { profile } from '../lib/content'
import { track } from '../lib/analytics'

// Plain structure only: the visual design (from Stitch) replaces the styling later.
export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label={`${profile.name}, home`}>
          RD
        </Link>
        <nav aria-label="Main">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        {profile.available && <span className="status">Available for new projects</span>}
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <nav aria-label="Elsewhere">
          <a href={profile.links.github} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'github' } })}>
            GitHub
          </a>
          <a href={profile.links.linkedin} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'linkedin' } })}>
            LinkedIn
          </a>
          {profile.links.resume && (
            <a href={profile.links.resume} onClick={() => track({ name: 'contact_click', params: { channel: 'resume' } })}>
              Résumé (PDF)
            </a>
          )}
        </nav>
      </footer>
    </>
  )
}
