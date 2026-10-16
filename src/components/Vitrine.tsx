import { useState } from 'react'
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
 */
export default function Vitrine({ projects }: { projects: Project[] }) {
  // Open on the first piece that has a screenshot, so the case never starts on a placeholder.
  const [selected, setSelected] = useState(() => Math.max(0, projects.findIndex((x) => x.image)))
  const p = projects[selected]

  return (
    <div className="vitrine">
      <div className="vitrine-stage">
        <div className="vitrine-object">
          <div className="vitrine-piece" key={p.slug}>
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
        <div className="vitrine-detail" key={p.slug} aria-live="polite">
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
          <button key={proj.slug} type="button" aria-pressed={i === selected} onClick={() => setSelected(i)}>
            <span className="label">{String(i + 1).padStart(2, '0')}</span>
            <span className="name">{proj.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
