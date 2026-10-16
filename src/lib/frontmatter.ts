import { parse } from 'yaml'
import type { Project, ProjectStatus } from './types'

const STATUSES: ProjectStatus[] = ['Live', 'In progress', 'Open source', 'Complete']

/** Splits a Markdown file into its YAML frontmatter object and body. */
export function splitFrontmatter(text: string): { data: Record<string, unknown>; body: string } {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error('missing frontmatter')
  return { data: (parse(match[1]) ?? {}) as Record<string, unknown>, body: match[2].trim() }
}

const str = (v: unknown) => (v == null ? '' : String(v))
const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : [])

/** Parses one project file. Throws with the file name on missing or invalid fields. */
export function parseProject(file: string, text: string): Project {
  const { data, body } = splitFrontmatter(text)
  const links = (data.links ?? {}) as Record<string, unknown>
  const project: Project = {
    slug: str(data.slug),
    title: str(data.title),
    tagline: str(data.tagline),
    problem: str(data.problem),
    categories: list(data.categories),
    stack: list(data.stack),
    status: str(data.status) as ProjectStatus,
    role: str(data.role),
    featured: data.featured === true,
    order: Number(data.order),
    page: data.page === true,
    image: str(data.image),
    links: { code: str(links.code), live: str(links.live) },
    body,
  }
  const missing = (['slug', 'title', 'tagline', 'problem'] as const).filter((k) => !project[k])
  if (missing.length) throw new Error(`${file}: missing ${missing.join(', ')}`)
  if (!STATUSES.includes(project.status)) throw new Error(`${file}: unknown status "${project.status}"`)
  if (!Number.isFinite(project.order)) throw new Error(`${file}: order must be a number`)
  return project
}
