import ContactLinks from '../components/ContactLinks'
import { profile } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

export default function Contact() {
  usePageMeta()
  return (
    <>
      <header className="page-head">
        <p className="label">Contact</p>
        <h1 className="h1">Let's talk about what you're building.</h1>
        <p className="lede">Freelance project, a role in your startup, or a question about one of my projects — message me directly.</p>
        <div style={{ marginTop: 36 }}>
          <ContactLinks align="left" />
        </div>
      </header>

      <section className="section" aria-labelledby="include-title">
        <div className="section-head">
          <p className="label">Before you write</p>
          <h2 id="include-title" className="h2">
            Helpful to include
          </h2>
        </div>
        <dl className="spec">
          <div>
            <dt className="label">01 · What</dt>
            <dd>What you need, in a few lines.</dd>
          </div>
          <div>
            <dt className="label">02 · When</dt>
            <dd>A rough timeline.</dd>
          </div>
          <div>
            <dt className="label">03 · Examples</dt>
            <dd>Links or examples, if you have them.</dd>
          </div>
        </dl>
        <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
          {profile.available ? 'Currently available' : 'Currently busy'} · {profile.location} · {profile.timezone} · usually replies within a day
        </p>
      </section>
    </>
  )
}
