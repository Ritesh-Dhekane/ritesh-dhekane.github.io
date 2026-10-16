import ContactLinks from '../components/ContactLinks'
import { profile } from '../lib/content'
import { usePageMeta } from '../lib/usePageMeta'

export default function Contact() {
  usePageMeta('Contact', 'Message Ritesh on WhatsApp or email about a project, a role, or anything you saw here.')
  return (
    <>
      <h1>Let's talk about what you're building.</h1>
      <p className="lede">
        Freelance project, a role in your startup, or just a question about one of my projects — message me directly.
      </p>
      <ContactLinks />
      <h2>Helpful to include</h2>
      <ul>
        <li>What you need, in a few lines</li>
        <li>A rough timeline</li>
        <li>Links or examples, if you have them</li>
      </ul>
      <p className="muted">
        {profile.available ? 'Currently available' : 'Currently busy'} · {profile.location} · {profile.timezone} · usually replies
        within a day
      </p>
    </>
  )
}
