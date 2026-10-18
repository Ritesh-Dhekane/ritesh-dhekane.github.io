// Shapes of the site content in content/. profile.json is typed by hand; project files are Markdown
// with YAML frontmatter, parsed by frontmatter.ts.

export type ProjectStatus = 'Live' | 'In progress' | 'Open source' | 'Complete'

export interface Project {
  slug: string
  title: string
  tagline: string
  problem: string
  categories: string[]
  stack: string[]
  status: ProjectStatus
  role: string
  featured: boolean
  order: number
  /** Whether the project gets its own case-study page; otherwise it's a card only. */
  page: boolean
  /** Optional screenshot (path under public/), shown in a browser frame. */
  image: string
  links: { code: string; live: string }
  /** Markdown body (the write-up). */
  body: string
}

export interface Intent {
  id: string
  label: string
  message: string
  cta: string
  highlight: string[]
}

export interface Experience {
  title: string
  team: string
  location: string
  start: string
  end: string
  note?: string
  highlights: string[]
}

export interface Profile {
  name: string
  headline: string
  /** Hero headline in two parts; the accent part is set in copper. */
  hero: { title: string; accent: string; line: string }
  /** The short facts band under the hero. */
  facts: { label: string; value: string }[]
  role: string
  intro: string
  about: string[]
  location: string
  timezone: string
  available: boolean
  contact: { email: string; whatsapp: string; whatsappMessage: string }
  links: { github: string; linkedin: string; resume: string }
  intents: Intent[]
  experience: Experience[]
  education: { degree: string; institution: string; years: string; note?: string }[]
  skills: { group: string; items: string[] }[]
  spokenLanguages: string[]
  principles: { title: string; text: string }[]
  process: { step: string; text: string }[]
  /** Problems Ritesh solves; `topic` finishes the contact message ("…wanted to talk about <topic>"). */
  capabilities: { title: string; text: string; example: string; topic: string }[]
  /** One line under the capabilities: the wider range of things Ritesh builds. */
  capabilitiesNote: string
}
