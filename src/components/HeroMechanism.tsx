import { useEffect, useRef, useState } from 'react'

// The render is one image with its parts stacked vertically on black. It is cut along the black gaps
// into horizontal slices (percent of image height); as the visitor scrolls, each slice moves toward the
// centre so the exploded parts close up into one mechanism. "lighten" blending hides the black edges
// where slices overlap. Measured from mechanism.webp: gaps at ~9%, 24%, 29.5%, 45%, 50% and 90%.
const SLICES: { top: number; bottom: number; shift: number }[] = [
  { top: 9.3, bottom: 23.8, shift: 13.2 },
  { top: 23.8, bottom: 29.5, shift: 8.7 },
  { top: 29.5, bottom: 45.0, shift: 3.9 },
  { top: 45.0, bottom: 49.9, shift: -0.7 },
  { top: 49.9, bottom: 89.8, shift: -10.8 },
]

const SRC = '/media/mechanism-640.webp'
const SRCSET = '/media/mechanism-640.webp 640w, /media/mechanism.webp 1024w'
const SIZES = '(max-width: 900px) 90vw, 46vw'

/**
 * The hero display case: an exploded mechanism that assembles as the page scrolls. Tapping (or clicking,
 * or Enter/Space) snaps it together; tapping again lets it come apart.
 */
export default function HeroMechanism() {
  const ref = useRef<HTMLDivElement>(null)
  const [held, setHeld] = useState(false)
  const heldRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      // 0 at the top of the page; fully assembled after scrolling about half the case's height,
      // while most of the case is still on screen. A tap holds it assembled.
      const p = heldRef.current ? 1 : Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight * 0.5)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('mechanism-toggle', update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('mechanism-toggle', update)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    heldRef.current = !heldRef.current
    setHeld(heldRef.current)
    // Ease the slices for this change only (scroll-driven movement stays direct).
    el.classList.add('easing')
    window.setTimeout(() => el.classList.remove('easing'), 900)
    el.dispatchEvent(new Event('mechanism-toggle'))
  }

  return (
    <div
      className="case mechanism"
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={held}
      aria-label={held ? 'Let the mechanism come apart' : 'Assemble the mechanism'}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    >
      {/* The full image is the accessible one; the moving slices are decoration. */}
      <img
        className="mechanism-base"
        src={SRC}
        srcSet={SRCSET}
        sizes={SIZES}
        width="1024"
        height="1024"
        alt="An exploded precision mechanism: metal plates, gears and jewel bearings floating apart in layers."
        fetchPriority="high"
      />
      {SLICES.map((s) => (
        <img
          key={s.top}
          className="mechanism-slice"
          src={SRC}
          srcSet={SRCSET}
          sizes={SIZES}
          width="1024"
          height="1024"
          alt=""
          aria-hidden="true"
          style={{ clipPath: `inset(${s.top}% 0 ${100 - s.bottom}% 0)`, ['--shift' as string]: `${s.shift}%` }}
        />
      ))}
      <div className="case-caption" aria-hidden="true">
        <span className="label">Many parts</span>
        <span className="label">One working whole</span>
      </div>
    </div>
  )
}
