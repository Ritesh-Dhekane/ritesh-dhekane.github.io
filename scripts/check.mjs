#!/usr/bin/env node
// Release checks for the portfolio: the site entry exists, the profile is valid JSON with the fields
// the site needs, and every project file has complete frontmatter. Exits non-zero with a list of
// problems so a pull request can't be merged with broken content.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const problems = []
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

// Site entry
if (!existsSync(join(root, 'site', 'index.html'))) problems.push('site/index.html is missing')

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

// Projects: simple frontmatter reader (top-level "key: value" lines between the first two ---).
const required = ['slug', 'title', 'tagline', 'problem', 'categories', 'stack', 'status', 'featured', 'order', 'page']
const dir = join(root, 'content', 'projects')
const slugs = new Set()
for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(dir, file), 'utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    problems.push(`${file}: no frontmatter`)
    continue
  }
  const keys = Object.fromEntries(
    match[1].split(/\r?\n/).filter((l) => /^\w+:/.test(l)).map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]),
  )
  for (const key of required) if (!(key in keys) || keys[key] === '') problems.push(`${file}: missing "${key}"`)
  if (keys.slug && `${keys.slug}.md` !== file) problems.push(`${file}: slug "${keys.slug}" doesn't match the file name`)
  if (slugs.has(keys.slug)) problems.push(`${file}: duplicate slug "${keys.slug}"`)
  slugs.add(keys.slug)
}

// Profile intents may only highlight projects that exist.
for (const intent of profile.intents ?? []) {
  for (const slug of intent.highlight ?? []) if (!slugs.has(slug)) problems.push(`profile intent "${intent.id}": unknown project "${slug}"`)
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`✓ site entry, profile and ${slugs.size} projects OK`)
