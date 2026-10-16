import { findProject, profile, projects } from './content'

// Search metadata for every page, used in two places: usePageMeta (client-side navigation) and the
// build (scripts/postbuild.mjs via entry-server.tsx), which writes it into each page's static HTML.

export const SITE = 'https://ritesh-dhekane.github.io'
const NAME = profile.name

/** Search Console / Webmaster verification tokens (meta tag method). Empty = not added. */
export const VERIFICATION = { google: '', bing: '' }

export interface PageMeta {
  title: string
  description: string
  /** Share image path under the site root. */
  image: string
}

const STATIC: Record<string, PageMeta> = {
  '/': {
    title: `${NAME} — Full-stack Developer in Pune | Web Apps, SaaS & AI`,
    description: `${NAME}, full-stack developer in Pune, India: web apps, SaaS, CRMs, ERPs, business websites and AI tools with React, TypeScript and Java Spring Boot.`,
    image: '/og/default.png',
  },
  '/work': {
    title: `Projects by ${NAME} — Web Apps, SaaS & AI Tools`,
    description: `Portfolio of ${NAME}: ${projects.length} projects — SaaS platforms, business websites, AI tools, mobile apps and developer tools, with live demos and code.`,
    image: '/og/default.png',
  },
  '/about': {
    title: `About ${NAME} — Full-stack Developer (React, Java, AI)`,
    description: `${NAME} is a software engineer from Pune building full-stack products with Java, Spring Boot, React, TypeScript, PostgreSQL, AWS and AI.`,
    image: '/og/default.png',
  },
  '/contact': {
    title: `Hire ${NAME} — Freelance Full-stack Developer, Pune`,
    description: `Contact ${NAME} for freelance web, SaaS, CRM, ERP, mobile and AI projects, or full-time roles. WhatsApp or email; replies within a day.`,
    image: '/og/default.png',
  },
}

const NOT_FOUND: PageMeta = { title: `Page not found — ${NAME}`, description: "This page doesn't exist.", image: '/og/default.png' }

/** Paths that exist as pages (pre-rendered and listed in the sitemap). */
export function pagePaths(): string[] {
  return [...Object.keys(STATIC), ...projects.filter((p) => p.page).map((p) => `/work/${p.slug}`)]
}

export function metaFor(pathname: string): PageMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (STATIC[path]) return STATIC[path]
  const slug = path.match(/^\/work\/([^/]+)$/)?.[1]
  const project = findProject(slug)
  if (project?.page) {
    return {
      title: `${project.title} — Case Study by ${NAME}`,
      description: `${project.tagline} Built by ${NAME} with ${project.stack.slice(0, 3).join(', ')}.`,
      image: `/og/${project.slug}.png`,
    }
  }
  return NOT_FOUND
}

const person = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: NAME,
  url: `${SITE}/`,
  image: `${SITE}/og/default.png`,
  jobTitle: 'Full-stack Developer',
  description: profile.hero.line,
  email: `mailto:${profile.contact.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressRegion: 'Maharashtra', addressCountry: 'IN' },
  alumniOf: profile.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  knowsAbout: profile.skills.flatMap((g) => g.items).slice(0, 30),
  knowsLanguage: profile.spokenLanguages,
  sameAs: [profile.links.github, profile.links.linkedin],
}

/** schema.org JSON-LD for a page: the Person everywhere, plus the website, profile or project. */
export function jsonLdFor(pathname: string): object[] {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const graph: object[] = [person]
  if (path === '/') {
    graph.push({ '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: NAME, author: { '@id': `${SITE}/#person` } })
  }
  if (path === '/about') {
    graph.push({ '@type': 'ProfilePage', url: `${SITE}/about`, mainEntity: { '@id': `${SITE}/#person` } })
  }
  if (path === '/work') {
    graph.push({
      '@type': 'CollectionPage',
      url: `${SITE}/work`,
      name: STATIC['/work'].title,
      hasPart: projects.map((p) => ({ '@type': 'CreativeWork', name: p.title, description: p.tagline, url: p.page ? `${SITE}/work/${p.slug}` : p.links.live || undefined })),
    })
  }
  const slug = path.match(/^\/work\/([^/]+)$/)?.[1]
  const project = findProject(slug)
  if (project?.page) {
    graph.push(
      {
        '@type': project.links.live ? 'SoftwareApplication' : 'CreativeWork',
        name: project.title,
        description: project.tagline,
        url: `${SITE}/work/${project.slug}`,
        image: `${SITE}${project.image || '/og/default.png'}`,
        ...(project.links.live ? { applicationCategory: 'WebApplication', operatingSystem: 'Web', sameAs: project.links.live } : {}),
        ...(project.links.code ? { codeRepository: project.links.code } : {}),
        keywords: project.stack.join(', '),
        author: { '@id': `${SITE}/#person` },
        creator: { '@id': `${SITE}/#person` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Work', item: `${SITE}/work` },
          { '@type': 'ListItem', position: 2, name: project.title, item: `${SITE}/work/${project.slug}` },
        ],
      },
    )
  }
  return [{ '@context': 'https://schema.org', '@graph': graph }]
}
