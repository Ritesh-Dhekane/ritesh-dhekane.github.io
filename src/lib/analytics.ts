// Google Analytics 4 (property "Portfolio", G-9KZST70QGT; VITE_GA_MEASUREMENT_ID overrides it), privacy-safe:
// never on localhost; no Google Signals or ad personalisation; IP-based features off by GA4 default.
// Events carry only page paths and fixed labels (channel, project slug, intent id), never anything a
// visitor typed.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const id = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || 'G-9KZST70QGT'
const enabled = Boolean(id) && typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)

export function initAnalytics() {
  if (!enabled || window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, {
    send_page_view: false, // sent per route change instead
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)
}

export function trackPageView(path: string, title: string) {
  window.gtag?.('event', 'page_view', { page_path: path, page_title: title, page_location: window.location.origin + path })
}

export type TrackedEvent =
  | { name: 'contact_click'; params: { channel: 'whatsapp' | 'email' | 'github' | 'linkedin' | 'resume' } }
  | { name: 'contact_form'; params: { action: 'open' | 'send'; channel?: 'whatsapp' | 'email' } }
  | { name: 'project_open'; params: { slug: string } }
  | { name: 'intent_select'; params: { intent: string } }
  | { name: 'outbound_project_link'; params: { slug: string; kind: 'live' | 'code' } }

export function track(event: TrackedEvent) {
  window.gtag?.('event', event.name, event.params)
}
