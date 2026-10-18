import { useEffect, useState, type RefObject } from 'react'

/** Touch devices and narrow screens: no hover, so focus follows scrolling instead. */
export const TOUCH_QUERY = '(hover: none), (max-width: 900px)'

/** How long the middle item must stay put before focus moves, so a quick flick doesn't flash every card. */
const SETTLE_MS = 150

/**
 * On touch/narrow screens, reports which child of `ref` (matching `selector`) is nearest the middle of
 * the screen, so it can be shown "in focus" the way hover does on desktop. Returns -1 elsewhere.
 * Change `key` when the set of items changes (e.g. a filter) so they are observed again.
 */
export function useCenterFocus(ref: RefObject<HTMLElement | null>, selector: string, key = '') {
  const [index, setIndex] = useState(-1)
  useEffect(() => {
    const root = ref.current
    if (!root || !matchMedia(TOUCH_QUERY).matches) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector))
    const inBand = new Set<HTMLElement>()
    let timer = 0
    // Of the items crossing the middle band, the one whose centre is closest to the screen's centre.
    const pick = () => {
      const mid = window.innerHeight / 2
      let best: HTMLElement | null = null
      let bestDistance = Infinity
      inBand.forEach((el) => {
        const r = el.getBoundingClientRect()
        const distance = Math.abs(r.top + r.height / 2 - mid)
        if (distance < bestDistance) [best, bestDistance] = [el, distance]
      })
      if (best) setIndex(items.indexOf(best))
    }
    // A band across the middle 30% of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target as HTMLElement)
          else inBand.delete(e.target as HTMLElement)
        }
        window.clearTimeout(timer)
        timer = window.setTimeout(pick, SETTLE_MS)
      },
      { rootMargin: '-35% 0px -35% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => {
      window.clearTimeout(timer)
      io.disconnect()
    }
  }, [ref, selector, key])
  return index
}
