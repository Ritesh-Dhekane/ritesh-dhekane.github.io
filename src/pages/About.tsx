import ContactLinks from '../components/ContactLinks'
import { profile } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

export default function About() {
  usePageMeta('About', `${profile.role} from Pune: experience, education, toolkit and how I work.`)
  return (
    <>
      <h1>About me</h1>
      {profile.about.map((p) => (
        <p key={p.slice(0, 24)} className="lede">
          {p}
        </p>
      ))}

      <section aria-labelledby="exp-title">
        <h2 id="exp-title">Experience</h2>
        {profile.experience.map((e) => (
          <article key={e.title + e.start} className="experience">
            <h3>
              {e.title} <span className="muted">· {e.team}</span>
            </h3>
            <p className="muted">
              {e.start} – {e.end} · {e.location}
            </p>
            <ul>
              {e.highlights.map((h) => (
                <li key={h.slice(0, 32)}>{h}</li>
              ))}
            </ul>
            {e.note && <p className="note">{e.note}</p>}
          </article>
        ))}
      </section>

      <section aria-labelledby="edu-title">
        <h2 id="edu-title">Education</h2>
        <ul>
          {profile.education.map((e) => (
            <li key={e.degree}>
              <strong>{e.degree}</strong>, {e.institution} · {e.years}
              {e.note && ` · ${e.note}`}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills-title">
        <h2 id="skills-title">Toolkit</h2>
        <dl className="skill-groups">
          {profile.skills.map((g) => (
            <div key={g.group}>
              <dt>{g.group}</dt>
              <dd>{g.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
        <p className="muted">Languages: {profile.spokenLanguages.join(', ')}</p>
      </section>

      <section aria-labelledby="think-title">
        <h2 id="think-title">How I think</h2>
        <ul>
          {profile.principles.map((p) => (
            <li key={p.title}>
              <strong>{p.title}.</strong> {p.text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-contact">
        <h2 id="about-contact">Say hello</h2>
        <ContactLinks />
      </section>
    </>
  )
}
