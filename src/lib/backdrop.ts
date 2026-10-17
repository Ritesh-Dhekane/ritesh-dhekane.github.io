// Which animated background is chosen, per theme. Stored in the browser; the gear menu changes it and
// the canvas listens for the change event.

export type DarkBackdrop = 'stars' | 'off'
export type LightBackdrop = 'dust' | 'grid' | 'filings' | 'off'
export type Backdrop = DarkBackdrop | LightBackdrop

export const OPTIONS: { dark: { id: DarkBackdrop; label: string }[]; light: { id: LightBackdrop; label: string }[] } = {
  dark: [
    { id: 'stars', label: 'Stars' },
    { id: 'off', label: 'Off' },
  ],
  light: [
    { id: 'dust', label: 'Dust in studio light' },
    { id: 'grid', label: 'Drafting grid' },
    { id: 'filings', label: 'Copper filings' },
    { id: 'off', label: 'Off' },
  ],
}

const DEFAULTS = { dark: 'stars', light: 'dust' } as const
const EVENT = 'backdropchange'

export function getBackdrop(theme: 'light' | 'dark'): Backdrop {
  try {
    const saved = localStorage.getItem(`backdrop-${theme}`)
    if (saved && OPTIONS[theme].some((o) => o.id === saved)) return saved as Backdrop
  } catch {
    // storage blocked: use the default
  }
  return DEFAULTS[theme]
}

export function setBackdrop(theme: 'light' | 'dark', value: Backdrop) {
  try {
    localStorage.setItem(`backdrop-${theme}`, value)
  } catch {
    // storage blocked: the choice applies until reload
  }
  window.dispatchEvent(new CustomEvent(EVENT))
}

export const onBackdropChange = (fn: () => void) => {
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}

/** Effects run only on desktops with a mouse and wide screens, and never with reduced motion. */
export const DESKTOP_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'
