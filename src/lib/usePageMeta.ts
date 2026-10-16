import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageView } from './analytics'

export const SITE_URL = 'https://ritesh-dhekane.github.io'
const SITE_NAME = 'Ritesh Dhekane'

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/** Sets the title, description, Open Graph tags and canonical URL for a page, and records a page view. */
export function usePageMeta(title: string | null, description: string) {
  const { pathname } = useLocation()
  useEffect(() => {
    const full = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Full-stack developer`
    const url = SITE_URL + pathname
    document.title = full
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', full)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
    trackPageView(pathname, full)
  }, [title, description, pathname])
}
