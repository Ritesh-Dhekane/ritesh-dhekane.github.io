import { useEffect, useState, type RefObject } from 'react'

/** Touch devices and narrow screens: no hover, so focus follows scrolling instead. */
export const TOUCH_QUERY = '(hover: none), (max-width: 900px)'

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
    // A thin band across the middle of the viewport: whichever item crosses it is "in focus".
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setIndex(items.indexOf(e.target as HTMLElement))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref, selector, key])
  return index
}
