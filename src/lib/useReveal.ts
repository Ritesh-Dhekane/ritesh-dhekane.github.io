import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Fades `.reveal` elements in as they scroll into view. With reduced motion the CSS keeps them
 * visible, so nothing is ever hidden from those visitors.
 * Revealed elements get a `data-in` attribute, not a class: React rewrites `className` whenever a
 * component re-renders (e.g. the phone "in focus" highlight), which would wipe a class added here and
 * hide the element again. React leaves attributes it doesn't render alone.
 */
export function useReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal:not([data-in])')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.setAttribute('data-in', ''))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
}
