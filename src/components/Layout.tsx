import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { profile } from '../lib/content'
import { track } from '../lib/analytics'
import { relayProps } from '../lib/relay'
import { useReveal } from '../lib/useReveal'
import Backdrop from './Backdrop'
import { SocialLink } from './SocialLinks'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
  useReveal()
  const { pathname } = useLocation()

  // Relay reports opens and sends (never what was typed).
  useEffect(() => {
    const onOpen = () => track({ name: 'contact_form', params: { action: 'open' } })
    const onSend = (event: Event) => {
      const channel = (event as CustomEvent<{ channel: 'whatsapp' | 'email' }>).detail.channel
      track({ name: 'contact_form', params: { action: 'send', channel } })
    }
    window.addEventListener('relay:open', onOpen)
    window.addEventListener('relay:send', onSend)
    return () => {
      window.removeEventListener('relay:open', onOpen)
      window.removeEventListener('relay:send', onSend)
    }
  }, [])

  return (
    <>
      <Backdrop />
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
          {/* Background picker (gear) is hidden for now; restore with <BackdropMenu /> and MENU_ENABLED in lib/backdrop.ts. */}
        </div>
      </header>

      {/* Keyed by path so each page fades in on navigation. */}
      <main id="main" className="wrap page-enter" key={pathname}>
        <Outlet />
      </main>

      {/* "Let's talk" (bottom right) opens the contact form in a pop-up; /contact shows the form itself. */}
      {pathname.replace(/\/$/, '') !== '/contact' && (
        <relay-button
          {...relayProps}
          label="Let's talk"
          heading="Let's talk"
          intro="Tell me a little about what you need. Every field is optional."
        />
      )}

      <footer className="footer">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <nav aria-label="Elsewhere">
            <SocialLink social="github" className="footer-social" />
            <SocialLink social="linkedin" className="footer-social" />
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
