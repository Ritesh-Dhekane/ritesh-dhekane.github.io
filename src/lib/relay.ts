// Relay (https://github.com/Ritesh-Dhekane/relay): the shared contact form. The script is loaded in
// index.html (VITE_RELAY_SRC); <relay-button> lives in the layout and <relay-form> on /contact.
import { profile } from './content'

declare global {
  interface Window {
    Relay?: { open: (options?: Record<string, string | undefined>) => boolean }
  }
}

/** Attributes shared by every Relay element on the site. */
export const relayProps = {
  source: 'portfolio',
  kind: 'contact',
  whatsapp: profile.contact.whatsapp,
  email: profile.contact.email,
  greeting: 'Hi Ritesh,',
  subject: 'Portfolio enquiry',
  fields: 'name,email,phone,company,topic,budget,timeline,message',
}

/** Opens the Relay pop-up; false if the script hasn't loaded, so callers can fall back to a plain link. */
export function openRelay(topic?: string): boolean {
  return window.Relay?.open(topic ? { topic } : {}) ?? false
}
