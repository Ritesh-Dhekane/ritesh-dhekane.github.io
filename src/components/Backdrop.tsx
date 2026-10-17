import { useEffect, useRef } from 'react'
import { DESKTOP_QUERY, getBackdrop, onBackdropChange, TOUCH_BACKDROP_QUERY, type Backdrop as Mode } from '../lib/backdrop'

// Animated background behind the page, on desktops with a mouse (see DESKTOP_QUERY). One canvas, one
// animation loop, four looks chosen per theme with the gear menu:
//   dark:  stars   — three depth layers drift and twinkle; the cursor adds parallax, nudges stars aside
//                    and draws faint copper constellation lines between stars near it.
//   light: dust    — warm specks drifting in "studio light"; the cursor carries a soft lamp glow, lights
//                    and pushes nearby specks, and joins them with pencil lines.
//          grid    — a drafting dot grid that bulges around the cursor like a lens, with pencil lines
//                    between the nearest dots.
//          filings — short copper flecks that turn to point at the cursor like iron filings.
// On touch screens (TOUCH_BACKDROP_QUERY) it runs lighter: fewer particles, the finger acts as the
// cursor, scrolling adds depth, and drawing stops ~2 s after the last scroll or touch to save battery.
// Plain canvas, no library; it only starts in the browser (not part of the pre-rendered HTML).

interface Particle {
  x: number
  y: number
  z: number
  r: number
  a: number
  tw: number
  ts: number
  vx: number
  vy: number
  dx: number
  dy: number
  tint: boolean
  ang: number
}

const LAYERS = [0.35, 0.65, 1]
const rand = (a: number, b: number) => a + Math.random() * (b - a)
/** Smallest turn between two line directions (lines have no head, so directions repeat every π). */
const turn = (a: number) => ((((a % Math.PI) + Math.PI * 1.5) % Math.PI) - Math.PI / 2)

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const media = matchMedia(DESKTOP_QUERY)
    const touchMedia = matchMedia(TOUCH_BACKDROP_QUERY)
    const isTouch = () => !media.matches && touchMedia.matches
    let lastActive = performance.now()
    const theme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

    let w = 0
    let h = 0
    let mode: Mode = 'off'
    let parts: Particle[] = []
    let frame = 0
    let running = false
    let sized = false
    const mouse = { x: -9999, y: -9999, on: false }
    const eased = { x: 0, y: 0 }

    const makeParticles = () => {
      const area = w * h
      if (mode === 'stars' || mode === 'dust') {
        const count = isTouch() ? 45 : mode === 'stars' ? Math.max(120, Math.min(200, Math.round(area / 9000))) : Math.max(90, Math.min(150, Math.round(area / 12000)))
        parts = Array.from({ length: count }, () => {
          const z = LAYERS[Math.floor(Math.random() * LAYERS.length)]
          return {
            x: rand(0, w),
            y: rand(0, h),
            z,
            r: mode === 'stars' ? 0.7 + z * 1.1 * Math.random() : 0.6 + z * 1.4 * Math.random(),
            a: mode === 'stars' ? 0.25 + z * 0.45 * Math.random() : 0.3 + z * 0.32 * Math.random(),
            tw: rand(0, Math.PI * 2),
            ts: rand(0.4, 1.6),
            vx: rand(-0.5, 0.5) * 0.05 * z,
            vy: mode === 'dust' ? rand(-0.06, -0.01) * z : rand(-0.5, 0.5) * 0.04 * z - 0.01,
            dx: 0,
            dy: 0,
            tint: Math.random() < (mode === 'stars' ? 0.1 : 0.3),
            ang: 0,
          }
        })
      } else if (mode === 'filings') {
        const count = Math.max(200, Math.min(320, Math.round(area / 5500)))
        parts = Array.from({ length: count }, () => {
          const ang = rand(0, Math.PI)
          return { x: rand(0, w), y: rand(0, h), z: 1, r: rand(5, 9), a: rand(0.18, 0.38), tw: ang, ts: 0, vx: 0, vy: 0, dx: 0, dy: 0, tint: true, ang }
        })
      } else {
        parts = []
      }
    }

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      eased.x = w / 2
      eased.y = h / 2
      makeParticles()
    }

    /** Push vector for a point near the cursor (falls off with distance). */
    const push = (x: number, y: number, radius: number, strength: number) => {
      if (!mouse.on) return [0, 0]
      const ddx = x - mouse.x
      const ddy = y - mouse.y
      const d = Math.hypot(ddx, ddy)
      if (d >= radius || d < 0.01) return [0, 0]
      const f = (1 - d / radius) ** 2 * strength
      return [(ddx / d) * f, (ddy / d) * f]
    }

    const links = (pts: { x: number; y: number }[], maxDist: number, radius: number, color: string, peak: number) => {
      ctx.lineWidth = 0.6
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i]
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > maxDist) continue
          const mid = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y)
          const alpha = peak * (1 - d / maxDist) * Math.max(0, 1 - mid / radius)
          if (alpha < 0.01) continue
          ctx.strokeStyle = `rgba(${color},${alpha.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }

    const drawStarsOrDust = (t: number, dust: boolean) => {
      const px = (eased.x - w / 2) / w
      // On touch screens scrolling gives the depth: near particles move further than far ones.
      const py = isTouch() ? (window.scrollY * 0.004) % 1 : (eased.y - h / 2) / h
      if (dust && mouse.on) {
        // The "lamp": a soft warm glow following the cursor.
        const g = ctx.createRadialGradient(eased.x, eased.y, 0, eased.x, eased.y, 260)
        g.addColorStop(0, 'rgba(226,160,100,0.13)')
        g.addColorStop(1, 'rgba(232,170,110,0)')
        ctx.fillStyle = g
        ctx.fillRect(eased.x - 260, eased.y - 260, 520, 520)
      }
      const near: { x: number; y: number }[] = []
      for (const s of parts) {
        s.x = (s.x + s.vx + w) % w
        s.y = (s.y + s.vy + h) % h
        let x = s.x - px * 36 * s.z
        let y = isTouch() ? (((s.y - py * 60 * s.z) % h) + h) % h : s.y - py * 24 * s.z
        const [tx, ty] = push(x, y, dust ? 140 : 120, (dust ? 26 : 22) * s.z)
        s.dx += (tx - s.dx) * 0.08
        s.dy += (ty - s.dy) * 0.08
        x += s.dx
        y += s.dy
        const twinkle = 0.7 + 0.3 * Math.sin(t * s.ts + s.tw)
        let alpha = s.a * twinkle
        if (dust && mouse.on) {
          // Specks inside the lamp's glow catch the light.
          const d = Math.hypot(x - mouse.x, y - mouse.y)
          if (d < 200) alpha += (1 - d / 200) * 0.35
        }
        ctx.fillStyle = dust
          ? s.tint
            ? `rgba(200,105,44,${alpha})`
            : `rgba(42,39,35,${alpha})`
          : s.tint
            ? `rgba(210,122,62,${alpha})`
            : `rgba(237,234,228,${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
        if (mouse.on && near.length < 32 && Math.hypot(x - mouse.x, y - mouse.y) < 150) near.push({ x, y })
      }
      if (mouse.on) links(near, 95, 150, dust ? '35,33,30' : '210,122,62', dust ? 0.32 : 0.24)
    }

    const drawGrid = () => {
      const gap = 28
      const radius = 170
      const near: { x: number; y: number }[] = []
      for (let gx = gap / 2; gx < w; gx += gap) {
        for (let gy = gap / 2; gy < h; gy += gap) {
          const [ox, oy] = push(gx, gy, radius, 16)
          const x = gx + ox
          const y = gy + oy
          const d = mouse.on ? Math.hypot(gx - mouse.x, gy - mouse.y) : radius
          const k = Math.max(0, 1 - d / radius)
          ctx.fillStyle = `rgba(60,56,50,${(0.16 + k * 0.4).toFixed(3)})`
          const r = 0.8 + k * 1.1
          ctx.fillRect(x - r, y - r, r * 2, r * 2)
          if (k > 0.25 && near.length < 40) near.push({ x, y })
        }
      }
      if (mouse.on) links(near, gap * 1.5, radius, '45,43,40', 0.3)
    }

    const drawFilings = () => {
      ctx.lineCap = 'round'
      ctx.lineWidth = 1.2
      const radius = 230
      for (const f of parts) {
        let target = f.tw
        let alpha = f.a
        if (mouse.on) {
          const d = Math.hypot(f.x - mouse.x, f.y - mouse.y)
          if (d < radius) {
            const toward = Math.atan2(mouse.y - f.y, mouse.x - f.x)
            const k = 1 - d / radius
            // Blend from the resting angle to "pointing at the cursor" (lines have no head, so mod π).
            target = f.tw + turn(toward - f.tw) * Math.min(1, k * 1.6)
            alpha += k * 0.35
          }
        }
        f.ang += turn(target - f.ang) * 0.12
        const cx = Math.cos(f.ang) * f.r
        const cy = Math.sin(f.ang) * f.r
        ctx.strokeStyle = `rgba(200,105,44,${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(f.x - cx, f.y - cy)
        ctx.lineTo(f.x + cx, f.y + cy)
        ctx.stroke()
      }
    }

    const draw = (time: number) => {
      // Touch screens: stop drawing shortly after the last scroll/touch (the last frame stays visible).
      if (isTouch() && time - lastActive > 2000) {
        running = false
        return
      }
      frame = requestAnimationFrame(draw)
      const target = mouse.on ? mouse : { x: w / 2, y: h / 2 }
      eased.x += (target.x - eased.x) * 0.06
      eased.y += (target.y - eased.y) * 0.06
      ctx.clearRect(0, 0, w, h)
      if (mode === 'stars') drawStarsOrDust(time / 1000, false)
      else if (mode === 'dust') drawStarsOrDust(time / 1000, true)
      else if (mode === 'grid') drawGrid()
      else if (mode === 'filings') drawFilings()
    }

    const stop = () => {
      running = false
      sized = false
      cancelAnimationFrame(frame)
      ctx.clearRect(0, 0, w, h)
    }
    const update = () => {
      const next: Mode = (media.matches || touchMedia.matches) && !document.hidden ? getBackdrop(theme()) : 'off'
      if (next === 'off') return stop()
      // Rebuild particles only for a new look (waking from idle keeps them where they are).
      if (next !== mode || !sized) {
        mode = next
        size()
        sized = true
      }
      if (!running) {
        running = true
        frame = requestAnimationFrame(draw)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.on = true
    }
    // Touch screens: the finger is the cursor; any touch or scroll wakes the animation.
    const wake = () => {
      lastActive = performance.now()
      if (!running && isTouch()) update()
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) {
        mouse.x = t.clientX
        mouse.y = t.clientY
        mouse.on = true
      }
      wake()
    }
    const onTouchEnd = () => {
      window.setTimeout(() => (mouse.on = false), 600)
      wake()
    }
    const onLeave = () => {
      mouse.on = false
    }
    // Phones resize the viewport as the address bar shows/hides while scrolling; only a width change
    // (rotation, window resize) rebuilds the field.
    let lastWidth = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      if (sized) size()
    }

    const themeWatch = new MutationObserver(update)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const offChange = onBackdropChange(update)
    media.addEventListener('change', update)
    touchMedia.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('scroll', wake, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    update()

    return () => {
      stop()
      themeWatch.disconnect()
      offChange()
      media.removeEventListener('change', update)
      touchMedia.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('scroll', wake)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />
}
