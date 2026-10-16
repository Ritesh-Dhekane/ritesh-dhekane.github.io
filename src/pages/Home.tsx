import { useState } from 'react'
import { Link } from 'react-router'
import ContactLinks from '../components/ContactLinks'
import ProjectCard from '../components/ProjectCard'
import { featuredProjects, findProject, profile } from '../lib/content'
import { track } from '../lib/analytics'
import { usePageMeta } from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(null, `${profile.role} from Pune. ${profile.intro}`)
  const [intentId, setIntentId] = useState(profile.intents[0].id)
  const intent = profile.intents.find((i) => i.id === intentId) ?? profile.intents[0]
  const current = profile.experience[0]

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">{profile.headline}</h1>
        <p className="lede">
          {profile.role}. {profile.intro}
        </p>
        <p className="actions">
          <Link to="/work">See my work</Link>
          <Link to="/contact">Get in touch</Link>
        </p>
      </section>

      <section aria-labelledby="intent-title">
        <h2 id="intent-title">What brings you here?</h2>
        <div className="intents" role="radiogroup" aria-labelledby="intent-title">
          {profile.intents.map((i) => (
            <button
              key={i.id}
              type="button"
              role="radio"
              aria-checked={i.id === intentId}
              onClick={() => {
                setIntentId(i.id)
                track({ name: 'intent_select', params: { intent: i.id } })
              }}
            >
              {i.label}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          {intent.message}{' '}
          {intent.highlight.map((slug, n) => {
            const p = findProject(slug)
            return p ? (
              <span key={slug}>
                {n > 0 && ', '}
                <Link to={`/work#${slug}`}>{p.title}</Link>
              </span>
            ) : null
          })}
        </p>
      </section>

      <section aria-labelledby="work-title">
        <h2 id="work-title">Things I've built</h2>
        <div className="project-grid">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <p>
          <Link to="/work">All projects →</Link>
        </p>
      </section>

      <section aria-labelledby="build-title">
        <h2 id="build-title">What I can build for you</h2>
        <ol className="capabilities">
          {profile.capabilities.map((c) => (
            <li key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <p className="example">e.g. {findProject(c.example)?.title}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills-title">
        <h2 id="skills-title">Toolkit</h2>
        <ul className="skills">
          {profile.skills.flatMap((g) => g.items).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p>And whatever the project needs next.</p>
      </section>

      <section aria-labelledby="process-title">
        <h2 id="process-title">How I work</h2>
        <ol className="process">
          {profile.process.map((p) => (
            <li key={p.step}>
              <strong>{p.step}</strong> — {p.text}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="exp-title">
        <h2 id="exp-title">Experience</h2>
        <p>
          <strong>{current.title}</strong> · {current.team} · {current.start} – {current.end}
        </p>
        <p>
          {profile.education.map((e) => `${e.degree}${e.note ? ` (${e.note})` : ''}`).join(' · ')}
        </p>
        <p>
          <Link to="/about">Learn more about me →</Link>
        </p>
      </section>

      <section aria-labelledby="contact-title">
        <h2 id="contact-title">Got something that needs building?</h2>
        <ContactLinks />
        <p className="note">Usually replies within a day.</p>
      </section>
    </>
  )
}
