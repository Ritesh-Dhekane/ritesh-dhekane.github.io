#!/usr/bin/env node
// Release checks for the portfolio (run after `npm ci`): the app entry exists, the profile is valid
// JSON with the fields the site needs, and every project file has complete, valid YAML frontmatter.
// Exits non-zero with a list of problems so a pull request can't be merged with broken content.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const problems = []
const root = fileURLToPath(new URL('..', import.meta.url))

// App entry
if (!existsSync(join(root, 'index.html'))) problems.push('index.html is missing')

// Profile
let profile = {}
try {
  profile = JSON.parse(readFileSync(join(root, 'content', 'profile.json'), 'utf8'))
} catch (e) {
  problems.push(`content/profile.json: ${e.message}`)
}
for (const key of ['name', 'headline', 'intro', 'contact', 'links', 'experience', 'education', 'skills']) {
  if (profile[key] === undefined) problems.push(`content/profile.json: missing "${key}"`)
}
if (profile.contact && !/^\S+@\S+\.\S+$/.test(profile.contact.email ?? '')) problems.push('content/profile.json: contact.email looks wrong')
if (profile.contact && !/^\d{11,13}$/.test(profile.contact.whatsapp ?? '')) problems.push('content/profile.json: contact.whatsapp must be digits with country code')

// Projects: YAML frontmatter between the first two --- lines (same parser as the site).
const required = ['slug', 'title', 'tagline', 'problem', 'categories', 'stack', 'status', 'featured', 'order', 'page']
const statuses = ['Live', 'In progress', 'Open source', 'Complete']
const dir = join(root, 'content', 'projects')
const slugs = new Set()
for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(dir, file), 'utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    problems.push(`${file}: no frontmatter`)
    continue
  }
  let data
  try {
    data = parse(match[1]) ?? {}
  } catch (e) {
    problems.push(`${file}: invalid YAML (${e.message.split('\n')[0]})`)
    continue
  }
  for (const key of required) if (data[key] === undefined || data[key] === null || data[key] === '') problems.push(`${file}: missing "${key}"`)
  if (data.status && !statuses.includes(data.status)) problems.push(`${file}: unknown status "${data.status}"`)
  if (data.slug && `${data.slug}.md` !== file) problems.push(`${file}: slug "${data.slug}" doesn't match the file name`)
  if (slugs.has(data.slug)) problems.push(`${file}: duplicate slug "${data.slug}"`)
  slugs.add(data.slug)
}

// Profile references may only point at projects that exist.
for (const intent of profile.intents ?? []) {
  for (const slug of intent.highlight ?? []) if (!slugs.has(slug)) problems.push(`profile intent "${intent.id}": unknown project "${slug}"`)
}
for (const c of profile.capabilities ?? []) {
  if (c.example && !slugs.has(c.example)) problems.push(`profile capability "${c.title}": unknown project "${c.example}"`)
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`✓ app entry, profile and ${slugs.size} projects OK`)
