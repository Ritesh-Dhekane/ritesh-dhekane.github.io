import { profile } from '../lib/content'
import { maskedPhone, mailtoUrl, whatsappUrl } from '../lib/contact'
import { track } from '../lib/analytics'

/** The two ways to reach Ritesh: WhatsApp (number masked on screen) and email. */
/** `topic` (e.g. from a "Talk about this" link) finishes the WhatsApp message and becomes the email subject. */
export default function ContactLinks({ subject, align, topic }: { subject?: string; align?: 'left'; topic?: string }) {
  const { contact } = profile
  return (
    <div className={`contact-links${align === 'left' ? ' left' : ''}`}>
      <a
        className="btn btn-primary"
        href={whatsappUrl(contact, topic)}
        rel="noopener"
        aria-label={`WhatsApp ${maskedPhone(contact.whatsapp)}`}
        onClick={() => track({ name: 'contact_click', params: { channel: 'whatsapp' } })}
      >
        WhatsApp <span>{maskedPhone(contact.whatsapp)}</span>
      </a>
      <a className="btn btn-secondary" href={mailtoUrl(contact, topic ? `About ${topic}` : subject)} onClick={() => track({ name: 'contact_click', params: { channel: 'email' } })}>
        Email <span>{contact.email}</span>
      </a>
    </div>
  )
}
