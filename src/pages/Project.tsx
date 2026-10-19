import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, Navigate, useParams } from 'react-router'
import BrowserFrame from '../components/BrowserFrame'
import ContactLinks from '../components/ContactLinks'
import { findProject, projects } from '../lib/content'
import { track } from '../lib/analytics'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  usePageMeta()

  if (!project) return <NotFound />
  // Card-only projects have no page; send visitors to their card on the Work page.
  if (!project.page) return <Navigate to={`/work#${project.slug}`} replace />

  const withPages = projects.filter((p) => p.page)
  const next = withPages[(withPages.indexOf(project) + 1) % withPages.length]

  return (
    <article>
      <header className="case-head">
        <p className="breadcrumb">
          <Link to="/work">Work</Link> / {project.title}
        </p>
        <span className="status-pill" data-status={project.status}>
          {project.status}
        </span>
        <h1 className="h1">{project.title}</h1>
        <p className="lede">{project.tagline}</p>
        {(project.links.live || project.links.code) && (
          <div className="actions">
            {project.links.live && (
              <a className="btn btn-primary" href={project.links.live} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug: project.slug, kind: 'live' } })}>
                Open live site ↗
              </a>
            )}
            {project.links.code && (
              <a className="btn btn-secondary" href={project.links.code} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug: project.slug, kind: 'code' } })}>
                Source code ↗
              </a>
            )}
          </div>
        )}
        <dl className="facts-sheet">
          <div>
            <dt className="label">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="label">Built with</dt>
            <dd>{project.stack.join(', ')}</dd>
          </div>
          <div>
            <dt className="label">Type</dt>
            <dd>{project.categories.join(', ')}</dd>
          </div>
        </dl>
      </header>

      {project.image && (
        <div className="case-shot">
          <BrowserFrame src={project.image} alt={`${project.title} screenshot`} eager />
        </div>
      )}

      <div className="prose">
        <Markdown remarkPlugins={[remarkGfm]}>{project.body}</Markdown>
      </div>

      <Link className="next-card" to={`/work/${next.slug}`}>
        <span>
          <span className="label">Next project</span>
          <span className="h3" style={{ display: 'block', marginTop: 6 }}>
            {next.title}
          </span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>

      <section className="closing" aria-labelledby="case-cta">
        <h2 id="case-cta" className="h2">
          Need something like {project.title}?
        </h2>
        <ContactLinks topic={`something like ${project.title}`} />
      </section>
    </article>
  )
}
