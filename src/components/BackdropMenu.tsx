import { useEffect, useId, useRef, useState } from 'react'
import { getBackdrop, OPTIONS, setBackdrop, type Backdrop } from '../lib/backdrop'

type Theme = 'light' | 'dark'

/**
 * Gear next to the theme switch: choose the animated background for the current theme. Shown only on
 * desktops with a mouse (CSS), where the backgrounds run.
 */
export default function BackdropMenu() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [value, setValue] = useState<Backdrop | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const id = useId()

  // Follow the theme switch, and read the saved choice for that theme.
  useEffect(() => {
    const sync = () => {
      const t: Theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
      setTheme(t)
      setValue(getBackdrop(t))
    }
    sync()
    const watch = new MutationObserver(sync)
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => watch.disconnect()
  }, [])

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="backdrop-menu" ref={box}>
      <button
        type="button"
        className="theme-toggle"
        aria-label="Background effect"
        title="Background effect"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
          <circle cx="12" cy="12" r="6.6" />
        </svg>
      </button>
      {open && (
        <div className="backdrop-panel" id={id} role="radiogroup" aria-label={`Background in ${theme} mode`}>
          <p className="label">Background · {theme} mode</p>
          {OPTIONS[theme].map((o) => (
            <label key={o.id} className="backdrop-option">
              <input
                type="radio"
                name={`backdrop-${theme}`}
                value={o.id}
                checked={value === o.id}
                onChange={() => {
                  setValue(o.id)
                  setBackdrop(theme, o.id)
                }}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
