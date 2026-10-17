import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation } from 'react-router'
import ContactLinks from '../components/ContactLinks'
import ProjectCard from '../components/ProjectCard'
import { categories, projects } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

export default function Work() {
  usePageMeta()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const { hash } = useLocation()

  // /work#slug (from Home or a card-only project link) scrolls to that project's card.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'center' })
  }, [hash])

  // Filter changes animate cards into their new places where the browser supports View Transitions.
  const pick = (c: string) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
    if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(() => flushSync(() => setCategory(c)))
    else setCategory(c)
  }

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
      <header className="page-head">
        <p className="label">Work · {projects.length} projects</p>
        <h1 className="h1">Everything I've built.</h1>
        <p className="lede">Products, tools and experiments — some for real users, some because I wanted to learn how.</p>
      </header>

      <div className="filters">
        <div role="group" aria-label="Filter by type">
          {['All', ...categories].map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={c === category} onClick={() => pick(c)}>
              {c}
            </button>
          ))}
        </div>
        <label>
          <span className="visually-hidden">Search projects</span>
          <input className="search" type="search" placeholder="Search by name or technology" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      <h2 className="visually-hidden">Projects</h2>
      <p className="count" aria-live="polite">
        Showing {shown.length} of {projects.length}
      </p>
      <div className="cards">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} />
        ))}
      </div>

      <section className="closing reveal" aria-labelledby="work-cta">
        <h2 id="work-cta" className="h2">
          A problem that isn't on this list yet? That's my favourite kind.
        </h2>
        <ContactLinks />
      </section>
    </>
  )
}
