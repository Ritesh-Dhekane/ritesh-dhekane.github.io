#!/usr/bin/env node
// Generates the 1200×630 share images in public/og/ (run locally after content or screenshot changes,
// then commit the PNGs). Needs headless Chrome via the dev-tools browser driver:
//   node scripts/og.mjs [--browser D:/Workspace/Projects/tools/dev-tools/lib/browser.mjs]
// default.png = site card with the mechanism; <slug>.png = each case-study project with its screenshot.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'
import { parse } from 'yaml'

const root = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
const bi = args.indexOf('--browser')
const browserPath = bi >= 0 ? args[bi + 1] : 'D:/Workspace/Projects/tools/dev-tools/lib/browser.mjs'
const { open, sleep } = await import(pathToFileURL(browserPath).href)

const profile = JSON.parse(readFileSync(join(root, 'content', 'profile.json'), 'utf8'))
const projects = readdirSync(join(root, 'content', 'projects'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => parse(readFileSync(join(root, 'content', 'projects', f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]))
  .filter((p) => p.page === true)

const media = (p) => pathToFileURL(join(root, 'public', p)).href
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const card = ({ label, title, accent, line, image, imageFit }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0 }
  body { width: 1200px; height: 630px; background: #F5F3EF; color: #1B1B1D; font-family: Geist, system-ui, sans-serif;
         display: grid; grid-template-columns: 1fr 470px; gap: 48px; padding: 64px; position: relative; overflow: hidden }
  body::before { content: ''; position: absolute; left: 64px; right: 64px; top: 40px; height: 1px; background: #D9D4CB }
  .text { display: flex; flex-direction: column; justify-content: center; gap: 22px }
  .label { font-size: 15px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: #625E57; display: flex; gap: 12px; align-items: center }
  .label::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #C8692C }
  h1 { font-size: ${title.length > 18 ? 64 : 84}px; line-height: .98; font-weight: 600; letter-spacing: -.035em }
  h1 span { color: #C8692C }
  p { font-size: 25px; line-height: 1.4; color: #625E57; max-width: 30ch }
  .case { align-self: center; height: 470px; border-radius: 12px; overflow: hidden; background: #111113;
          border: 1px solid #D9D4CB; box-shadow: 0 24px 60px -20px rgba(27,27,29,.35) }
  .case img { width: 100%; height: 100%; object-fit: ${imageFit}; object-position: left top }
  .foot { position: absolute; left: 64px; bottom: 34px; font-size: 15px; color: #625E57; letter-spacing: .02em }
</style></head><body>
  <div class="text">
    <div class="label">${esc(label)}</div>
    <h1>${esc(title)}${accent ? ` <span>${esc(accent)}</span>` : ''}</h1>
    <p>${esc(line)}</p>
  </div>
  <div class="case"><img src="${image}"></div>
  <div class="foot">ritesh-dhekane.github.io</div>
</body></html>`

const outDir = join(root, 'public', 'og')
mkdirSync(outDir, { recursive: true })
const jobs = [
  {
    name: 'default',
    html: card({ label: `${profile.name} · ${profile.role}`, title: profile.hero.title, accent: profile.hero.accent, line: profile.hero.line, image: media('media/mechanism.webp'), imageFit: 'cover' }),
  },
  ...projects.map((p) => ({
    name: p.slug,
    html: card({ label: `${profile.name} · Case study`, title: p.title, line: p.tagline, image: p.image ? media(p.image.replace(/^\//, '')) : media('media/mechanism.webp'), imageFit: 'cover' }),
  })),
]

const page = await open('about:blank', { width: 1200, height: 630, theme: 'light' })
for (const job of jobs) {
  const file = join(tmpdir(), `og-${job.name}.html`)
  writeFileSync(file, job.html)
  await page.goto(pathToFileURL(file).href)
  await sleep(1200)
  await page.shot(join(outDir, `${job.name}.png`), false)
  console.log(`og/${job.name}.png`)
}
page.close()
