import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import ContactLinks from '../components/ContactLinks'
import { profile } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

type Capability = (typeof profile.capabilities)[number]

export default function Contact() {
  usePageMeta()
  // "Talk about this" on Home links here with ?about=<n>. Read after mount: the page is pre-rendered
  // without it, and hydration must match that HTML.
  const { search } = useLocation()
  const [about, setAbout] = useState<Capability | null>(null)
  useEffect(() => {
    const n = Number(new URLSearchParams(search).get('about'))
    setAbout(profile.capabilities[n - 1] ?? null)
  }, [search])
  return (
    <>
      <header className="page-head">
        <p className="label">Contact</p>
        <h1 className="h1">Let's talk about what you're building.</h1>
        <p className="lede">Freelance project, a role in your startup, or a question about one of my projects — message me directly.</p>
        {about && (
          <p className="contact-about">
            <span className="label">About</span> {about.title}
          </p>
        )}
        <div style={{ marginTop: about ? 20 : 36 }}>
          <ContactLinks align="left" topic={about?.topic} />
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
