import { describe, expect, it } from 'vitest'
import { projects } from './content'
import { jsonLdFor, metaFor, pagePaths } from './seo'

describe('seo', () => {
  it('lists the static pages and every case-study page', () => {
    const paths = pagePaths()
    expect(paths).toEqual(expect.arrayContaining(['/', '/work', '/about', '/contact']))
    for (const p of projects.filter((x) => x.page)) expect(paths).toContain(`/work/${p.slug}`)
    expect(paths.some((p) => p.startsWith('/work/') && !projects.find((x) => `/work/${x.slug}` === p)?.page)).toBe(false)
  })

  it('puts the name in every title and keeps descriptions within ~160 characters', () => {
    for (const path of pagePaths()) {
      const meta = metaFor(path)
      expect(meta.title).toContain('Ritesh Dhekane')
      expect(meta.description.length).toBeGreaterThan(50)
      expect(meta.description.length).toBeLessThanOrEqual(170)
    }
  })

  it('treats trailing slashes the same and falls back to not found', () => {
    expect(metaFor('/work/')).toEqual(metaFor('/work'))
    expect(metaFor('/nope').title).toMatch(/not found/i)
    const cardOnly = projects.find((p) => !p.page)
    if (cardOnly) expect(metaFor(`/work/${cardOnly.slug}`).title).toMatch(/not found/i)
  })

  it('describes the person on every page and the project on case studies', () => {
    const types = (path: string) => (jsonLdFor(path)[0] as { '@graph': { '@type': string }[] })['@graph'].map((n) => n['@type'])
    expect(types('/')).toEqual(['Person', 'WebSite'])
    const withPage = projects.find((p) => p.page)!
    expect(types(`/work/${withPage.slug}`)).toEqual(expect.arrayContaining(['Person', 'BreadcrumbList']))
  })
})
