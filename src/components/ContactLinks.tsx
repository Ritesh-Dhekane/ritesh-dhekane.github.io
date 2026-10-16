import { profile } from '../lib/content'
import { maskedPhone, mailtoUrl, whatsappUrl } from '../lib/contact'
import { track } from '../lib/analytics'

/** The two ways to reach Ritesh: WhatsApp (number masked on screen) and email. */
export default function ContactLinks({ subject }: { subject?: string }) {
  const { contact } = profile
  return (
    <div className="contact-links">
      <a href={whatsappUrl(contact)} rel="noopener" onClick={() => track({ name: 'contact_click', params: { channel: 'whatsapp' } })}>
        <strong>WhatsApp</strong> <span>{maskedPhone(contact.whatsapp)}</span>
      </a>
      <a href={mailtoUrl(contact, subject)} onClick={() => track({ name: 'contact_click', params: { channel: 'email' } })}>
        <strong>Email</strong> <span>{contact.email}</span>
      </a>
    </div>
  )
}
