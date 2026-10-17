import { useEffect, useRef } from 'react'

// A quiet starfield behind the page: dark theme, desktop with a mouse, wide screens, motion allowed.
// Three depth layers drift and twinkle; the cursor adds parallax (near stars move more), nudges stars
// nearby out of the way, and draws faint constellation lines between stars close to it.
// Plain canvas, no library. Not part of the pre-rendered HTML (it only starts in the browser).

const ACTIVE_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const LAYERS = [0.35, 0.65, 1]
const PUSH_RADIUS = 120
const LINK_RADIUS = 150
const LINK_DISTANCE = 95

interface Star {
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
  copper: boolean
}

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const media = matchMedia(ACTIVE_QUERY)
    const isDark = () => document.documentElement.dataset.theme === 'dark'

    let w = 0
    let h = 0
    let stars: Star[] = []
    let frame = 0
    let running = false
    const mouse = { x: -9999, y: -9999, on: false }
    const eased = { x: 0, y: 0 }

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(120, Math.min(200, Math.round((w * h) / 9000)))
      stars = Array.from({ length: count }, () => {
        const z = LAYERS[Math.floor(Math.random() * LAYERS.length)]
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.5 + z * 1.1 * Math.random() + 0.2,
          a: 0.25 + z * 0.45 * Math.random(),
          tw: Math.random() * Math.PI * 2,
          ts: 0.4 + Math.random() * 1.2,
          vx: (Math.random() - 0.5) * 0.04 * z,
          vy: (Math.random() - 0.5) * 0.04 * z - 0.01,
          dx: 0,
          dy: 0,
          copper: Math.random() < 0.1,
        }
      })
      eased.x = w / 2
      eased.y = h / 2
    }

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw)
      const t = time / 1000
      const target = mouse.on ? mouse : { x: w / 2, y: h / 2 }
      eased.x += (target.x - eased.x) * 0.06
      eased.y += (target.y - eased.y) * 0.06
      const px = (eased.x - w / 2) / w
      const py = (eased.y - h / 2) / h
      ctx.clearRect(0, 0, w, h)

      const near: { x: number; y: number; z: number }[] = []
      for (const s of stars) {
        s.x = (s.x + s.vx + w) % w
        s.y = (s.y + s.vy + h) % h
        // Parallax: near layers shift more, opposite to the cursor.
        let x = s.x - px * 36 * s.z
        let y = s.y - py * 24 * s.z
        // Push: stars near the cursor ease away and spring back.
        let tx = 0
        let ty = 0
        if (mouse.on) {
          const ddx = x - mouse.x
          const ddy = y - mouse.y
          const d = Math.hypot(ddx, ddy)
          if (d < PUSH_RADIUS && d > 0.01) {
            const f = (1 - d / PUSH_RADIUS) ** 2 * 22 * s.z
            tx = (ddx / d) * f
            ty = (ddy / d) * f
          }
        }
        s.dx += (tx - s.dx) * 0.08
        s.dy += (ty - s.dy) * 0.08
        x += s.dx
        y += s.dy

        const alpha = s.a * (0.7 + 0.3 * Math.sin(t * s.ts + s.tw))
        ctx.fillStyle = s.copper ? `rgba(210,122,62,${alpha})` : `rgba(237,234,228,${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()

        if (mouse.on && near.length < 32 && Math.hypot(x - mouse.x, y - mouse.y) < LINK_RADIUS) near.push({ x, y, z: s.z })
      }

      // Faint constellation lines between stars close to the cursor.
      ctx.lineWidth = 0.6
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const a = near[i]
          const b = near[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > LINK_DISTANCE) continue
          const mid = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y)
          const alpha = 0.24 * (1 - d / LINK_DISTANCE) * Math.max(0, 1 - mid / LINK_RADIUS)
          if (alpha < 0.01) continue
          ctx.strokeStyle = `rgba(210,122,62,${alpha.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }

    const start = () => {
      if (running) return
      running = true
      size()
      frame = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
      ctx.clearRect(0, 0, w, h)
    }
    const update = () => (media.matches && isDark() && !document.hidden ? start() : stop())

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.on = true
    }
    const onLeave = () => {
      mouse.on = false
    }
    const onResize = () => running && size()

    const themeWatch = new MutationObserver(update)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    media.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    update()

    return () => {
      stop()
      themeWatch.disconnect()
      media.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className="starfield" aria-hidden="true" />
}
