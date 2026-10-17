import { Link } from 'react-router'
import type { Project } from '../lib/types'
import { track } from '../lib/analytics'
import BrowserFrame from './BrowserFrame'

/** One project in the catalogue. Links to its case study when it has one; otherwise to live site / code. */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { slug, title, tagline, stack, status, page, links, categories, image } = project
  return (
    <article className="card reveal" id={slug} style={{ viewTransitionName: `card-${slug}`, ['--i' as string]: index % 3 }}>
      {image && <BrowserFrame src={image} alt={`${title} screenshot`} />}
      <div className="card-top">
        <span className="label">
          {String(index + 1).padStart(2, '0')} · {categories[0]}
        </span>
        <span className="status-pill" data-status={status}>
          {status}
        </span>
      </div>
      <h3 className="h3">
        {page ? (
          <Link to={`/work/${slug}`} onClick={() => track({ name: 'project_open', params: { slug } })}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p>{tagline}</p>
      <ul className="tags" aria-label="Built with">
        {stack.slice(0, 4).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {(links.live || links.code) && (
        <p className="links">
          {links.live && (
            <a href={links.live} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug, kind: 'live' } })}>
              Live site ↗
            </a>
          )}
          {links.code && (
            <a href={links.code} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug, kind: 'code' } })}>
              Source ↗
            </a>
          )}
        </p>
      )}
    </article>
  )
}
