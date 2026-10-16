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

/** Hero case: the mechanism drifts up and zooms slightly as the page scrolls (skipped with reduced motion). */
export function useHeroParallax(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height))
      el.style.setProperty('--lift', `${(-progress * 40).toFixed(1)}px`)
      el.style.setProperty('--zoom', (1 + progress * 0.06).toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}
