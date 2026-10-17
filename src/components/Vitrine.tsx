import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { Project } from '../lib/types'
import BrowserFrame from './BrowserFrame'
import { track } from '../lib/analytics'

const initials = (title: string) =>
  title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/**
 * The display case: the selected project stands in the lit case with its details beside it;
 * the rail below lets visitors pick another. Projects without a screenshot show an engraved plate.
 * Pieces slide in from the side you're moving towards; the case advances on its own every 6 s while it
 * is on screen and not being hovered or focused (never with reduced motion).
 */
const AUTO_MS = 6000
export default function Vitrine({ projects }: { projects: Project[] }) {
  // Open on the first piece that has a screenshot, so the case never starts on a placeholder.
  const [selected, setSelected] = useState(() => Math.max(0, projects.findIndex((x) => x.image)))
  const [dir, setDir] = useState<1 | -1>(1)
  const [paused, setPaused] = useState(false)
  const [auto, setAuto] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const p = projects[selected]

  const choose = (i: number) => {
    setDir(i >= selected ? 1 : -1)
    setSelected(i)
  }

  // Auto-advance only while the case is visible, the tab is active and motion is allowed.
  useEffect(() => {
    const el = box.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => setAuto(e.isIntersecting && !document.hidden), { threshold: 0.4 })
    io.observe(el)
    const onVis = () => document.hidden && setAuto(false)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    if (!auto || paused) return
    const id = window.setTimeout(() => {
      setDir(1)
      setSelected((i) => (i + 1) % projects.length)
    }, AUTO_MS)
    return () => window.clearTimeout(id)
  }, [auto, paused, selected, projects.length])

  const running = auto && !paused

  return (
    <div
      className="vitrine"
      ref={box}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
    >
      <div className="vitrine-stage">
        <div className="vitrine-object">
          <div className={`vitrine-piece from-${dir === 1 ? 'right' : 'left'}`} key={p.slug}>
            {p.image ? (
              <BrowserFrame src={p.image} alt={`${p.title} screenshot`} />
            ) : (
              <div className="plate" aria-hidden="true">
                <span className="label">
                  <span>{String(selected + 1).padStart(2, '0')}</span>
                  <span>{p.categories[0]}</span>
                </span>
                <span className="initials">{initials(p.title)}</span>
                <span className="label">Screenshots soon</span>
              </div>
            )}
            <div className="plinth-shadow" aria-hidden="true" />
          </div>
        </div>
        <div className={`vitrine-detail from-${dir === 1 ? 'right' : 'left'}`} key={p.slug} aria-live="polite">
          <span className="status-pill" data-status={p.status}>
            {p.status}
          </span>
          <h3 className="h2">{p.title}</h3>
          <p className="lede">{p.tagline}</p>
          <p className="problem">{p.problem}</p>
          <ul className="tags" aria-label="Built with">
            {p.stack.slice(0, 5).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="actions">
            {p.page && (
              <Link className="link-arrow" to={`/work/${p.slug}`} onClick={() => track({ name: 'project_open', params: { slug: p.slug } })}>
                View project
              </Link>
            )}
            {p.links.live && (
              <a className="link-arrow" href={p.links.live} rel="noopener">
                Live site
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="vitrine-rail" role="group" aria-label="Choose a project">
        {projects.map((proj, i) => (
          <button key={proj.slug} type="button" aria-pressed={i === selected} onClick={() => choose(i)}>
            <span className="label">{String(i + 1).padStart(2, '0')}</span>
            <span className="name">{proj.title}</span>
            {i === selected && <span className={`rail-progress${running ? ' running' : ''}`} key={`${selected}-${running}`} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  )
}
