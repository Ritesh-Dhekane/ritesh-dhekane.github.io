import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import ContactLinks from '../components/ContactLinks'
import ProjectCard from '../components/ProjectCard'
import { categories, projects } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

export default function Work() {
  usePageMeta('Work', 'Products, tools and experiments: SaaS apps, business websites, AI tools, mobile apps and research.')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const { hash } = useLocation()

  // /work#slug (from Home or a card-only project link) scrolls to that project's card.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'center' })
  }, [hash])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter(
      (p) =>
        (category === 'All' || p.categories.includes(category)) &&
        (!q || [p.title, p.tagline, ...p.stack].some((s) => s.toLowerCase().includes(q))),
    )
  }, [category, query])

  return (
    <>
      <h1>Everything I've built</h1>
      <p className="lede">Products, tools and experiments — some for real users, some because I wanted to learn how.</p>

      <div className="filters">
        <div role="group" aria-label="Filter by type">
          {['All', ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={c === category} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <label>
          <span className="visually-hidden">Search projects</span>
          <input type="search" placeholder="Search by name or tech" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      <h2 className="visually-hidden">Projects</h2>
      <p aria-live="polite">
        {shown.length} {shown.length === 1 ? 'project' : 'projects'}
      </p>
      <div className="project-grid">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      <section aria-labelledby="work-cta">
        <h2 id="work-cta">Have a problem that isn't on this list yet? That's my favourite kind.</h2>
        <ContactLinks />
      </section>
    </>
  )
}
