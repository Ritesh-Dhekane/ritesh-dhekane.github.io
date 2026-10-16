import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Fades `.reveal` elements in as they scroll into view. With reduced motion the CSS keeps them
 * visible, so nothing is ever hidden from those visitors.
 */
export function useReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
}
