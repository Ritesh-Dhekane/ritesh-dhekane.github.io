import { Link } from 'react-router'
import ContactLinks from '../components/ContactLinks'
import HeroMechanism from '../components/HeroMechanism'
import ProcessSteps from '../components/ProcessSteps'
import Vitrine from '../components/Vitrine'
import { featuredProjects, findProject, profile } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

function SectionHead({ label, title, index }: { label: string; title: string; index?: string }) {
  return (
    <div className="section-head">
      <p className="label">{label}</p>
      <h2 className="h2">{title}</h2>
      {index && <span className="index">{index}</span>}
    </div>
  )
}

export default function Home() {
  usePageMeta()

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="label">
            {profile.name} · {profile.role} · Pune
          </p>
          <h1 id="hero-title" className="display">
            {profile.hero.title} <span className="accent">{profile.hero.accent}</span>
          </h1>
          <p className="lede">{profile.hero.line}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/work">
              See the work
            </Link>
            <Link className="link-arrow" to="/contact">
              Start a conversation
            </Link>
          </div>
        </div>
        <HeroMechanism />
      </section>

      <dl className="facts reveal">
        {profile.facts.map((f) => (
          <div key={f.label}>
            <dt className="label">{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* "What brings you here?" is hidden for now (Ritesh, 2026-10-17); restore with: <IntentPicker /> */}

      <section className="section" aria-labelledby="work-title">
        <SectionHead label="Selected work" title="Things I've built" index={`${String(featuredProjects.length).padStart(2, '0')} pieces`} />
        <div className="reveal">
          <Vitrine projects={featuredProjects} />
        </div>
        <p style={{ marginTop: 24 }}>
          <Link className="link-arrow" to="/work">
            See all projects
          </Link>
        </p>
      </section>

      <section className="section" aria-labelledby="build-title">
        <SectionHead label="What I can build for you" title="Problems I like solving" />
        <div className="grid-2x2">
          {profile.capabilities.map((c, i) => {
            const example = findProject(c.example)
            return (
              <article key={c.title} className="reveal">
                <p className="label">{String(i + 1).padStart(2, '0')}</p>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                {example && (
                  <p className="example">
                    For example{' '}
                    <Link to={example.page ? `/work/${example.slug}` : `/work#${example.slug}`}>{example.title} →</Link>
                  </p>
                )}
              </article>
            )
          })}
        </div>
        <p className="capabilities-note reveal">{profile.capabilitiesNote}</p>
      </section>

      <section className="section" aria-labelledby="tool-title">
        <SectionHead label="Toolkit" title="What I build with" />
        <dl className="spec reveal">
          {profile.skills.map((g) => (
            <div key={g.group}>
              <dt className="label">{g.group}</dt>
              <dd>{g.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
        <p className="muted" style={{ marginTop: 20 }}>
          And whatever the next project needs — I learn it on the way.
        </p>
      </section>

      <section className="section" aria-labelledby="process-title">
        <SectionHead label="How I work" title="From first call to support" />
        <ProcessSteps steps={profile.process} />
      </section>

      <section className="section" aria-labelledby="exp-title">
        <SectionHead label="Experience" title="Where I've worked and studied" />
        <div className="record">
          <div>
            {profile.experience.map((e) => (
              <article key={e.title + e.start} className="reveal">
                <p className="label">
                  {e.start} – {e.end}
                </p>
                <h3 className="h3">{e.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {e.team}
                </p>
              </article>
            ))}
          </div>
          <div>
            {profile.education.map((e) => (
              <article key={e.degree} className="reveal">
                <p className="label">{e.years}</p>
                <h3 className="h3">{e.degree}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {e.institution}
                  {e.note && ` · ${e.note}`}
                </p>
              </article>
            ))}
          </div>
        </div>
        <p style={{ marginTop: 24 }}>
          <Link className="link-arrow" to="/about">
            More about me
          </Link>
        </p>
      </section>

      <section className="closing reveal" aria-labelledby="contact-title">
        <p className="label">Contact</p>
        <h2 id="contact-title" className="h2" style={{ marginTop: 16 }}>
          Have something that needs to be built well?
        </h2>
        <p className="lede">Tell me what you need. I usually reply within a day.</p>
        <ContactLinks />
      </section>
    </>
  )
}
