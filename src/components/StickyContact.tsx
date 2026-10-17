import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { profile } from '../lib/content'
import { mailtoUrl, whatsappUrl } from '../lib/contact'
import { track } from '../lib/analytics'

/**
 * Phones only (CSS): a slim WhatsApp / Email bar that slides up once the visitor has scrolled past the
 * top of the page, and hides whenever the page's own contact buttons are on screen.
 */
export default function StickyContact() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide while any in-page contact buttons are visible (re-run per page: they differ).
  useEffect(() => {
    const seen = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
      setContactVisible(seen.size > 0)
    })
    const t = window.setTimeout(() => document.querySelectorAll('main .contact-links').forEach((el) => io.observe(el)), 100)
    return () => {
      window.clearTimeout(t)
      io.disconnect()
      setContactVisible(false)
    }
  }, [pathname])

  const shown = scrolled && !contactVisible
  return (
    <div className={`sticky-contact${shown ? ' shown' : ''}`} aria-hidden={!shown}>
      <a
        className="btn btn-primary"
        href={whatsappUrl(profile.contact)}
        rel="noopener"
        tabIndex={shown ? 0 : -1}
        onClick={() => track({ name: 'contact_click', params: { channel: 'whatsapp' } })}
      >
        WhatsApp
      </a>
      <a
        className="btn btn-secondary"
        href={mailtoUrl(profile.contact)}
        tabIndex={shown ? 0 : -1}
        onClick={() => track({ name: 'contact_click', params: { channel: 'email' } })}
      >
        Email
      </a>
    </div>
  )
}
