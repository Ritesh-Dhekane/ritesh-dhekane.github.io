---
slug: swakardo
title: Swakardo
tagline: A digital business card and business page — scan the QR on a printed card to open a fast mobile profile, then call, WhatsApp or save the contact.
problem: A printed business card can't be tapped; the person holding it still has to type the number, find the WhatsApp chat and save the contact by hand.
categories: [SaaS, Web apps]
stack: [React, TypeScript, Vite, MUI, Cloudflare Workers, Hono, D1, R2, Vitest]
status: In progress
role: Solo developer
featured: false
order: 19
page: false
links:
  code: ""
  live: ""
---

**Work in progress — the public card page and the API are built; customer and admin portals come next.**

- Public card page that opens from the QR on a printed card: call, WhatsApp, save the contact (vCard).
- API on a **Cloudflare Worker** (Hono) with D1 for data and R2 for images; Sign in with Google, then the API's own session tokens, of which only a SHA-256 hash is stored.
- Owners manage their cards and images; admins can list users and cards and suspend cards, and every admin call is audited.
- Views, clicks and saves are counted without storing any IP address or user agent.
- Built to stay on Cloudflare's free tiers: the Worker enforces every upload limit on the server (image types checked by content, size and per-user caps, a total storage ceiling).
- Monorepo with shared card types and helpers (vCard, QR, WhatsApp link); typecheck, lint, format check, tests and build run before every pull request.
