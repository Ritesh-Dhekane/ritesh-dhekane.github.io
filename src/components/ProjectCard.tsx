import { Link } from 'react-router'
import type { Project } from '../lib/types'
import { track } from '../lib/analytics'

/** One project. Links to its case-study page when it has one; otherwise to its live site or code. */
export default function ProjectCard({ project }: { project: Project }) {
  const { slug, title, tagline, stack, status, page, links } = project
  return (
    <article className="project-card" id={slug}>
      <p className="meta">
        <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
      </p>
      <h3>
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
              Live ↗
            </a>
          )}
          {links.code && (
            <a href={links.code} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug, kind: 'code' } })}>
              Code ↗
            </a>
          )}
        </p>
      )}
    </article>
  )
}
