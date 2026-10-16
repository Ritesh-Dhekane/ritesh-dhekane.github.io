import { describe, expect, it } from 'vitest'
import { categories, featuredProjects, profile, projects } from './content'
import { maskedPhone, whatsappUrl } from './contact'
import { parseProject } from './frontmatter'

describe('content', () => {
  it('parses every project file with a slug matching its file name', () => {
    expect(projects.length).toBeGreaterThan(0)
    for (const p of projects) expect(p.slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('sorts projects by order and has unique slugs', () => {
    const orders = projects.map((p) => p.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
  })

  it('features six projects, each with its own page', () => {
    expect(featuredProjects).toHaveLength(6)
    expect(featuredProjects.every((p) => p.page)).toBe(true)
  })

  it('only highlights projects that exist', () => {
    const slugs = new Set(projects.map((p) => p.slug))
    for (const intent of profile.intents) for (const slug of intent.highlight) expect(slugs.has(slug)).toBe(true)
    for (const c of profile.capabilities) expect(slugs.has(c.example)).toBe(true)
  })

  it('collects categories for filters', () => {
    expect(categories).toContain('Web apps')
  })
})

describe('frontmatter', () => {
  const file = (front: string) => `---\n${front}\n---\nBody text`

  it('reads arrays, booleans and nested links, and keeps the body', () => {
    const p = parseProject(
      'x.md',
      file(
        'slug: x\ntitle: X\ntagline: t\nproblem: p\ncategories: [A, B]\nstack: [S]\nstatus: Live\nrole: r\nfeatured: true\norder: 3\npage: false\nlinks:\n  code: "" # private\n  live: https://x.dev',
      ),
    )
    expect(p).toMatchObject({ categories: ['A', 'B'], featured: true, page: false, order: 3, links: { code: '', live: 'https://x.dev' } })
    expect(p.body).toBe('Body text')
  })

  it('rejects unknown statuses and missing fields', () => {
    expect(() => parseProject('y.md', file('slug: y\ntitle: Y\ntagline: t\nproblem: p\nstatus: Done\norder: 1'))).toThrow(/status/)
    expect(() => parseProject('z.md', file('slug: z\nstatus: Live\norder: 1'))).toThrow(/missing/)
  })
})

describe('contact', () => {
  it('builds a WhatsApp link with the prefilled message', () => {
    expect(whatsappUrl({ email: 'a@b.c', whatsapp: '919876543210', whatsappMessage: 'Hi there' })).toBe(
      'https://wa.me/919876543210?text=Hi%20there',
    )
  })

  it('masks the phone number', () => {
    expect(maskedPhone('919876543210')).toBe('+91 ••••• ••210')
  })
})
