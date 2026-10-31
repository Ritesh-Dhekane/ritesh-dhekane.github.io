import labJson from '../../content/lab.json'
import profileJson from '../../content/profile.json'
import { parseProject } from './frontmatter'
import type { LabItem, Profile, Project } from './types'

// All content is bundled at build time: the profile JSON and every Markdown file in content/projects.
const files = import.meta.glob('../../content/projects/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

export const profile = profileJson as Profile

export const lab = labJson as LabItem[]

export const projects: Project[] = Object.entries(files)
  .map(([path, text]) => parseProject(path.split('/').pop() ?? path, text))
  .sort((a, b) => a.order - b.order)

export const featuredProjects = projects.filter((p) => p.featured)

export const findProject = (slug: string | undefined) => projects.find((p) => p.slug === slug)

/** Every category used by at least one project, in first-seen order (for the Work page filters). */
export const categories = [...new Set(projects.flatMap((p) => p.categories))]
