#!/usr/bin/env node
// After `vite build` (browser) and `vite build --ssr src/entry-server.tsx` (server bundle):
// - Pre-renders every known page to HTML and writes dist/<route>/index.html with the content inside
//   #root, plus that page's title, description, canonical URL, share image and schema.org JSON-LD.
//   Search engines and link previews (which don't run JavaScript) see the real page; the browser
//   hydrates it. All metadata comes from src/lib/seo.ts, the same code the app uses.
// - 404.html = the empty app shell, so GitHub Pages hands unknown URLs to the app's "not found" page.
// - sitemap.xml and robots.txt.

import { readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const serverDir = join(root, 'dist-server')
const server = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href)
const { render, metaFor, jsonLdFor, pagePaths, SITE, VERIFICATION } = server
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// JSON inside <script>: escape "<" so no string can close the tag.
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

function head(html, path) {
  const meta = metaFor(path)
  const url = SITE + (path === '/' ? '/' : path)
  const img = SITE + meta.image
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${attr(meta.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${attr(meta.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${attr(meta.description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1${img}`)
    .replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${img}`)
  const extra = [
    `<script type="application/ld+json">${json(jsonLdFor(path))}</script>`,
    VERIFICATION.google && `<meta name="google-site-verification" content="${attr(VERIFICATION.google)}" />`,
    VERIFICATION.bing && `<meta name="msvalidate.01" content="${attr(VERIFICATION.bing)}" />`,
  ].filter(Boolean)
  return out.replace('</head>', `    ${extra.join('\n    ')}\n  </head>`)
}

const paths = pagePaths()
for (const path of paths) {
  // React puts resource hints (e.g. the hero image preload) at the start of a partial render; in the
  // browser they're hoisted to <head> instead, so leaving them inside #root breaks hydration.
  // index.html already preloads the hero image.
  const body = (await render(path)).replace(/^(<link[^>]*>)+/, '')
  const html = head(shell, path).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const dir = join(dist, ...path.split('/').filter(Boolean))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
writeFileSync(join(dist, '404.html'), shell)
rmSync(serverDir, { recursive: true, force: true })

const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  join(dist, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths
      .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : p.startsWith('/work/') ? '0.7' : '0.8'}</priority></url>`)
      .join('\n') +
    '\n</urlset>\n',
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

console.log(`postbuild: pre-rendered ${paths.length} pages, 404.html, sitemap.xml, robots.txt`)
