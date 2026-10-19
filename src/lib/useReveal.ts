import { useEffect } from 'react'

/**
 * Fades `.reveal` elements in as they scroll into view. With reduced motion the CSS keeps them
 * visible, so nothing is ever hidden from those visitors.
 * Revealed elements get a `data-in` attribute, not a class: React rewrites `className` whenever a
 * component re-renders (e.g. the phone "in focus" highlight), which would wipe a class added here and
 * hide the element again. React leaves attributes it doesn't render alone.
 * Elements added later (a new page, or cards brought back by a Work filter or search) are picked up
 * by a MutationObserver, so they never stay hidden.
 */
export function useReveal() {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute('data-in', '')
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) =>
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  show(e.target)
                  io?.unobserve(e.target)
                }
              }),
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
          )
        : null
    const watch = (root: ParentNode) => {
      const found = root instanceof Element && root.matches('.reveal') ? [root] : []
      found.push(...root.querySelectorAll('.reveal'))
      for (const el of found) if (!el.hasAttribute('data-in')) (io ? io.observe(el) : show(el))
    }
    watch(document)
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && watch(n))
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io?.disconnect()
      mo.disconnect()
    }
  }, [])
}
