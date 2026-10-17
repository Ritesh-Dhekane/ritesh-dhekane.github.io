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
/** The gear menu is hidden for now (Ritesh, 2026-10-17): everyone gets the defaults, saved picks are ignored. */
export const MENU_ENABLED = false
const EVENT = 'backdropchange'

export function getBackdrop(theme: 'light' | 'dark'): Backdrop {
  if (!MENU_ENABLED) return DEFAULTS[theme]
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

/** Full effects: desktops with a mouse and wide screens, never with reduced motion. */
export const DESKTOP_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'
/** Light effects on touch screens: fewer particles, driven by touch and scroll, idle when nothing moves. */
export const TOUCH_BACKDROP_QUERY = '(pointer: coarse) and (prefers-reduced-motion: no-preference)'
