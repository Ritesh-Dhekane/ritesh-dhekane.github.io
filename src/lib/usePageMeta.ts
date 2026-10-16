import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageView } from './analytics'
import { metaFor, SITE } from './seo'

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/**
 * Keeps the title, description, share tags and canonical URL right while visitors navigate inside the
 * app (each page's static HTML already has them from the build), and records a page view.
 */
export function usePageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = metaFor(pathname)
    const url = SITE + (pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/')
    document.title = meta.title
    setMeta('meta[name="description"]', 'name', 'description', meta.description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:image"]', 'property', 'og:image', SITE + meta.image)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', SITE + meta.image)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
    trackPageView(pathname, meta.title)
  }, [pathname])
}
