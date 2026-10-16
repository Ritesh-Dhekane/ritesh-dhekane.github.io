import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, Navigate, useParams } from 'react-router'
import ContactLinks from '../components/ContactLinks'
import { findProject, projects } from '../lib/content'
import { track } from '../lib/analytics'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  usePageMeta(project?.title ?? 'Not found', project?.tagline ?? 'This project does not exist.')

  if (!project) return <NotFound />
  // Card-only projects have no page; send visitors to their card on the Work page.
  if (!project.page) return <Navigate to={`/work#${project.slug}`} replace />

  const withPages = projects.filter((p) => p.page)
  const next = withPages[(withPages.indexOf(project) + 1) % withPages.length]

  return (
    <article className="case-study">
      <p className="breadcrumb">
        <Link to="/work">Work</Link> / {project.title}
      </p>
      <h1>{project.title}</h1>
      <p className="lede">{project.tagline}</p>
      <dl className="facts">
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{project.stack.join(', ')}</dd>
        </div>
      </dl>
      {(project.links.live || project.links.code) && (
        <p className="actions">
          {project.links.live && (
            <a href={project.links.live} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug: project.slug, kind: 'live' } })}>
              Live site ↗
            </a>
          )}
          {project.links.code && (
            <a href={project.links.code} rel="noopener" onClick={() => track({ name: 'outbound_project_link', params: { slug: project.slug, kind: 'code' } })}>
              Source code ↗
            </a>
          )}
        </p>
      )}

      <div className="prose">
        <Markdown remarkPlugins={[remarkGfm]}>{project.body}</Markdown>
      </div>

      <nav aria-label="Next project" className="next">
        <Link to={`/work/${next.slug}`}>Next project: {next.title} →</Link>
      </nav>

      <section aria-labelledby="case-cta">
        <h2 id="case-cta">Need something like this?</h2>
        <ContactLinks subject={`About something like ${project.title}`} />
      </section>
    </article>
  )
}
