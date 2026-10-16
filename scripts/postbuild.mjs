#!/usr/bin/env node
// After `vite build`:
// - writes dist/<route>/index.html for every known page, each with its own title, description,
//   canonical URL and share image. Link previews (WhatsApp, LinkedIn, X) don't run JavaScript, so
//   they only see these static tags. It also means deep links are served directly (200, not 404).
// - 404.html = index.html, so GitHub Pages hands unknown URLs to the app's "not found" page.
// - sitemap.xml and robots.txt.

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { parse } from 'yaml'

const SITE = 'https://ritesh-dhekane.github.io'
const NAME = 'Ritesh Dhekane'
const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const projects = readdirSync(join(root, 'content', 'projects'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => parse(readFileSync(join(root, 'content', 'projects', f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]))
  .filter((p) => p.page === true)

// Keep these in step with the usePageMeta() calls in src/pages.
const pages = [
  { path: '/work', title: `Work — ${NAME}`, description: 'Products, tools and experiments: SaaS apps, business websites, AI tools, mobile apps and research.' },
  { path: '/about', title: `About — ${NAME}`, description: 'Full-stack developer from Pune: experience, education, toolkit and how I work.' },
  { path: '/contact', title: `Contact — ${NAME}`, description: 'Message Ritesh on WhatsApp or email about a project, a role, or anything you saw here.' },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.title} — ${NAME}`,
    description: p.tagline,
    image: existsSync(join(root, 'public', 'og', `${p.slug}.png`)) ? `/og/${p.slug}.png` : null,
  })),
]

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
function render({ path, title, description, image }) {
  const url = SITE + path
  const img = SITE + (image ?? '/og/default.png')
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${attr(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${attr(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${attr(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1${img}`)
    .replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${img}`)
}

for (const page of pages) {
  const dir = join(dist, ...page.path.split('/').filter(Boolean))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), render(page))
}
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))

const today = new Date().toISOString().slice(0, 10)
const paths = ['/', ...pages.map((p) => p.path)]
writeFileSync(
  join(dist, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    '\n</urlset>\n',
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

console.log(`postbuild: ${pages.length} page files, 404.html, sitemap.xml (${paths.length} URLs), robots.txt`)
