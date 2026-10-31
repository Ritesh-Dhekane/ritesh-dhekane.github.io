import { lab } from '../lib/content'
import type { LabItem } from '../lib/types'
import { usePageMeta } from '../lib/usePageMeta'

const KIND: Record<LabItem['kind'], string> = { tool: 'Tool', experiment: 'Experiment', wip: 'Work in progress' }

export default function Lab() {
  usePageMeta()
  return (
    <>
      <header className="page-head">
        <p className="label">Lab · {lab.length} {lab.length === 1 ? 'item' : 'items'}</p>
        <h1 className="h1">Small things.</h1>
        <p className="lede">Quick tools, experiments and mini projects — too small for the Work page, useful enough to keep.</p>
      </header>

      <h2 className="visually-hidden">Lab items</h2>
      <div className="cards lab-cards">
        {lab.map((item, i) => {
          const external = /^https?:\/\//.test(item.href)
          return (
            <article key={item.href} className="card reveal" style={{ ['--i' as string]: i % 3 }}>
              <div className="card-top">
                <span className="label">{KIND[item.kind]}</span>
                {item.date && <span className="label">{item.date}</span>}
              </div>
              <h3 className="h3">
                {/* A plain link, not a router Link: internal Lab pages are standalone static files, not app routes. */}
                <a href={item.href} {...(external ? { rel: 'noopener' } : {})}>
                  {item.title}
                </a>
              </h3>
              <p>{item.description}</p>
              <ul className="tags" aria-label="Tags">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </>
  )
}
