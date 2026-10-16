---
slug: feeproof
title: FeeProof
tagline: Collect fees by UPI or bank transfer — and verify every payment in one place, without a payment gateway.
problem: Institutes collecting fees by UPI or bank transfer match transaction IDs by hand and retype payer details into Excel.
categories: [SaaS, Web apps]
stack: [React, TypeScript, Tailwind, Hono, Netlify Functions, Postgres (Neon), Drizzle ORM]
status: In progress
role: Solo developer
featured: true
order: 2
image: /media/feeproof.webp
page: true
links:
  code: "" # private repo
  live: "" # TODO(ritesh): add after the Netlify deploy (feeproof-app.netlify.app)
---

## The problem

I saw this during a course registration: payers sent money by UPI or bank transfer, then staff matched transaction IDs (UTRs) by hand against bank statements and typed everyone's details into Excel. Slow, error-prone, and nobody knew who had actually paid.

## What I built

A portal any organisation can use, without signing up for a payment gateway:

- **Payers register** for a course from a public link and pay by a **UPI QR** (amount and registration ID already filled in) or bank transfer.
- They **upload proof**: the UTR plus a screenshot, which is resized in the browser before upload.
- **The organisation verifies** each payment in one list and **exports** it, instead of retyping.
- Payers get a private link to check their status; they don't need an account.

## How it works

- React + TypeScript frontend; one Hono API running as a Netlify Function.
- Postgres (Neon) with Drizzle ORM and migrations; local development and tests use an in-process Postgres (PGlite).
- Every table carries the organisation's ID and every admin query is scoped to it (tenant isolation).
- Screenshots live in a private blob store and are only served to that organisation's admins.
- Money is stored as integer paise; spam on public forms is blocked with Cloudflare Turnstile.

## Interesting parts

- **UPI QR per registration:** a UPI intent with the exact amount and the registration ID in the note, so matching becomes almost automatic. A bank account without a UPI ID still works through its NPCI address.
- **Privacy by default:** payer data never goes to analytics, and the marketing-consent box is unticked by default.

## What I learned

The simplest version of a "payment system" doesn't always need a payment gateway — it needs good proof and one place to check it.
