import { profile } from '../lib/content'
import { mailtoUrl, whatsappUrl } from '../lib/contact'
import { track } from '../lib/analytics'
import { openRelay } from '../lib/relay'
import { SocialLink } from './SocialLinks'

/**
 * "Send a message" opens the Relay contact form (with `topic` filled in). Without the Relay script it's a
 * plain WhatsApp link. Direct WhatsApp and email links stay underneath for people who prefer them.
 */
export default function ContactLinks({ topic, align }: { topic?: string; align?: 'left' }) {
  const { contact } = profile
  const whatsapp = whatsappUrl(contact, topic)
  return (
    <div className={`contact-links${align === 'left' ? ' left' : ''}`}>
      <a
        className="btn btn-primary"
        href={whatsapp}
        rel="noopener"
        onClick={(event) => {
          if (openRelay(topic)) event.preventDefault()
          else track({ name: 'contact_click', params: { channel: 'whatsapp' } })
        }}
      >
        Send a message
      </a>
      <SocialLink social="github" />
      <SocialLink social="linkedin" />
      <p className="contact-direct">
        or message me directly on{' '}
        <a href={whatsapp} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'whatsapp' } })}>
          WhatsApp
        </a>{' '}
        or by{' '}
        <a
          href={mailtoUrl(contact, topic ? `About ${topic}` : undefined)}
          onClick={() => track({ name: 'contact_click', params: { channel: 'email' } })}
        >
          email
        </a>
      </p>
    </div>
  )
}
