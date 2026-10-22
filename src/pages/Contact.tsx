import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { profile } from '../lib/content'
import { mailtoUrl, whatsappUrl } from '../lib/contact'
import { relayProps } from '../lib/relay'
import { track } from '../lib/analytics'
import { SocialIcon, SocialLink } from '../components/SocialLinks'
import { usePageMeta } from '../lib/usePageMeta'

type Capability = (typeof profile.capabilities)[number]

const cardAlt = `${profile.name}'s GitHub activity: contributions, streaks and top languages (live Streakline card)`

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
        <div className="contact-form" style={{ marginTop: about ? 20 : 36 }}>
          <relay-form {...relayProps} topic={about?.topic} />
          <p className="contact-direct">
            or message me directly on{' '}
            <a href={whatsappUrl(profile.contact, about?.topic)} rel="noopener">
              WhatsApp
            </a>{' '}
            or by <a href={mailtoUrl(profile.contact, about ? `About ${about.topic}` : undefined)}>email</a>
          </p>
        </div>
      </header>

      <section className="section" aria-labelledby="elsewhere-title">
        <div className="section-head">
          <p className="label">Elsewhere</p>
          <h2 id="elsewhere-title" className="h2">
            Find me online
          </h2>
        </div>
        <div className="social-cards">
          <article className="social-card">
            <h3>
              <SocialIcon social="github" /> GitHub
            </h3>
            <p>My own products, experiments and open-source work, shipped in public.</p>
            {profile.links.githubCard && (
              <a className="social-card-media" href={profile.links.github} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'github' } })}>
                {/* The card comes in both themes; CSS shows the one matching the site. */}
                <img className="card-dark" src={profile.links.githubCard} alt={cardAlt} loading="lazy" width="520" height="200" />
                <img className="card-light" src={`${profile.links.githubCard}?theme=light`} alt={cardAlt} loading="lazy" width="520" height="200" />
              </a>
            )}
            <SocialLink social="github" className="btn btn-primary">
              Follow on GitHub
            </SocialLink>
          </article>
          <article className="social-card">
            <h3>
              <SocialIcon social="linkedin" /> LinkedIn
            </h3>
            <p>Work history, what I'm building now and the occasional write-up. Happy to connect.</p>
            <SocialLink social="linkedin" className="btn btn-primary">
              Connect on LinkedIn
            </SocialLink>
          </article>
        </div>
      </section>

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
