import { useEffect, useRef, useState } from 'react'
import { TOUCH_QUERY, useCenterFocus } from '../lib/useCenterFocus'

// "How I work": five steps on a line, each with a round star that grows from a faint dot (step 1) to a
// fully bright, glowing star (step 5). The stars ignite in order when the section scrolls in, and a
// highlight moves forward one step every 4 s while the section is on screen (never with reduced motion).
// On touch screens the highlight follows scrolling instead: the step in the middle of the screen.

const STEP_MS = 4000

export default function ProcessSteps({ steps }: { steps: { step: string; text: string }[] }) {
  const [active, setActive] = useState(-1)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLOListElement>(null)
  const focused = useCenterFocus(ref, ':scope > li')

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia(TOUCH_QUERY).matches) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    // First highlight once the stars have ignited, then one step forward every 4 s.
    const id = window.setTimeout(() => setActive((a) => (a + 1) % steps.length), active < 0 ? 1600 : STEP_MS)
    return () => window.clearTimeout(id)
  }, [visible, active, steps.length])

  const current = focused >= 0 ? focused : active
  return (
    <ol className="process reveal" ref={ref}>
      {steps.map((p, i) => (
        <li key={p.step} className={i === current ? 'active' : undefined} style={{ ['--lvl' as string]: i + 1 }}>
          <svg className="star" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11" />
          </svg>
          <span className="label">{String(i + 1).padStart(2, '0')}</span>
          <strong>{p.step}</strong>
          <p>{p.text}</p>
        </li>
      ))}
    </ol>
  )
}
