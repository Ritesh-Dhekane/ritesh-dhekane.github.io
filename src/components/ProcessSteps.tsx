import { useEffect, useRef, useState } from 'react'

// "How I work": five steps on a line, each with a star that grows from a faint dot (step 1) to a fully
// bright star (step 5). The stars ignite in order when the section scrolls in, and a highlight moves
// forward one step every 4 s while the section is on screen (never with reduced motion).

const STEP_MS = 4000
// Four-point star in a 24×24 box.
const STAR = 'M12 0C12.6 7.5 16.5 11.4 24 12C16.5 12.6 12.6 16.5 12 24C11.4 16.5 7.5 12.6 0 12C7.5 11.4 11.4 7.5 12 0Z'

export default function ProcessSteps({ steps }: { steps: { step: string; text: string }[] }) {
  const [active, setActive] = useState(-1)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
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

  return (
    <ol className="process reveal" ref={ref}>
      {steps.map((p, i) => (
        <li key={p.step} className={i === active ? 'active' : undefined} style={{ ['--lvl' as string]: i + 1 }}>
          <svg className="star" viewBox="0 0 24 24" aria-hidden="true">
            {i === 0 ? <circle cx="12" cy="12" r="5" /> : <path d={STAR} />}
          </svg>
          <span className="label">{String(i + 1).padStart(2, '0')}</span>
          <strong>{p.step}</strong>
          <p>{p.text}</p>
        </li>
      ))}
    </ol>
  )
}
