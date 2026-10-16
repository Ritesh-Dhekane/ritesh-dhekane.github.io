import ContactLinks from '../components/ContactLinks'
import { profile } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

export default function About() {
  usePageMeta('About', `${profile.role} from Pune: experience, education, toolkit and how I work.`)
  return (
    <>
      <header className="page-head">
        <p className="label">About</p>
        <h1 className="h1">Curious by default. Stubborn about shipping.</h1>
      </header>

      <div className="about-intro section" style={{ paddingTop: 48 }}>
        {profile.about.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <section className="section" aria-labelledby="exp-title">
        <div className="section-head">
          <p className="label">Experience</p>
          <h2 id="exp-title" className="h2">
            Work
          </h2>
        </div>
        <div className="record">
          {profile.experience.map((e) => (
            <article key={e.title + e.start} className="reveal">
              <p className="label">
                {e.start} – {e.end} · {e.location}
              </p>
              <h3 className="h3">{e.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {e.team}
              </p>
              <ul>
                {e.highlights.map((h) => (
                  <li key={h.slice(0, 32)}>{h}</li>
                ))}
              </ul>
              {e.note && <p className="muted" style={{ fontSize: 14 }}>{e.note}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="edu-title">
        <div className="section-head">
          <p className="label">Education</p>
          <h2 id="edu-title" className="h2">
            Study
          </h2>
        </div>
        <div className="record">
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
      </section>

      <section className="section" aria-labelledby="skills-title">
        <div className="section-head">
          <p className="label">Toolkit</p>
          <h2 id="skills-title" className="h2">
            What I build with
          </h2>
        </div>
        <dl className="spec reveal">
          {profile.skills.map((g) => (
            <div key={g.group}>
              <dt className="label">{g.group}</dt>
              <dd>{g.items.join(' · ')}</dd>
            </div>
          ))}
          <div>
            <dt className="label">Languages</dt>
            <dd>{profile.spokenLanguages.join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <section className="section" aria-labelledby="think-title">
        <div className="section-head">
          <p className="label">Principles</p>
          <h2 id="think-title" className="h2">
            How I think
          </h2>
        </div>
        <div className="principles">
          {profile.principles.map((p) => (
            <article key={p.title} className="reveal">
              <h3 className="h3">{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing reveal" aria-labelledby="about-contact">
        <h2 id="about-contact" className="h2">
          Say hello.
        </h2>
        <ContactLinks />
      </section>
    </>
  )
}
