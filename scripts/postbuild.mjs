#!/usr/bin/env node
// After `vite build`: GitHub Pages has no rewrites, so 404.html is a copy of index.html (the router then
// shows the right page or "not found"). Also writes sitemap.xml and robots.txt from the content.

import { copyFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { parse } from 'yaml'

const SITE = 'https://ritesh-dhekane.github.io'
const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const projectsDir = join(root, 'content', 'projects')

copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))

const today = new Date().toISOString().slice(0, 10)
const projectPages = readdirSync(projectsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parse(readFileSync(join(projectsDir, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]))
  .filter((p) => p.page === true)
  .map((p) => `/work/${p.slug}`)

const paths = ['/', '/work', '/about', '/contact', ...projectPages]
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  paths.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n'
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

console.log(`postbuild: 404.html, sitemap.xml (${paths.length} URLs), robots.txt`)
