import type { Profile } from './types'

/** wa.me link with the profile's prefilled opening line. */
export const whatsappUrl = (contact: Profile['contact']) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`

export const mailtoUrl = (contact: Profile['contact'], subject = 'Hello from your portfolio') =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`

/** "+91 ••••• ••567": enough to recognise the number without printing it in full on the page. */
export function maskedPhone(whatsapp: string) {
  const country = whatsapp.slice(0, whatsapp.length - 10)
  return `+${country} ••••• ••${whatsapp.slice(-3)}`
}
