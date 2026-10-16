---
slug: slidecraft
title: SlideCraft
tagline: Describe a deck in a chat and get a PowerPoint where every element is still editable.
problem: AI slide tools give you pictures of slides or decks that fall apart the moment you edit them in PowerPoint.
categories: [AI, Web apps]
stack: [React, TypeScript, Vite, Tailwind, Node.js, pptxgenjs, Zod, Gemini API]
status: Open source
role: Solo developer
featured: true
order: 4
page: true
links:
  code: https://github.com/Ritesh-Dhekane/slidecraft
  live: https://ritesh-dhekane.github.io/slidecraft/
---

## The problem

Most AI presentation tools either export slide screenshots or messy files. You can't change a chart value or move a text box without rebuilding the slide.

## What I built

An open-source presentation generator:

- Describe the deck in a chat; the AI writes a structured presentation.
- See it as a live HTML preview.
- Export a **.pptx where text, shapes, tables, charts and images are native PowerPoint objects** — never screenshots.
- Works two ways: with coding agents that write decks as JSON files, or in the app with Gemini using **your own API key** (kept in your browser, with token usage and estimated cost shown).

## How it works

- **Two-level schema:** the AI writes a small content schema (slide layout + title, bullets, table, chart data, notes). A deterministic layout engine and theme turn it into positioned elements on a 13.33 × 7.5 inch canvas.
- Both renderers (HTML and PPTX) read only the positioned schema, so preview and export always match.
- Zod validation with one repair pass for bad AI JSON; a CLI (`new`, `check`, `export`) and a small local server that pushes live updates.

## Interesting parts

- Asking the model for content instead of coordinates gives consistent design and uses about **5–10× fewer tokens**.
- Edits like "make slide 4 more visual" send only the affected slides, not the whole deck.

## What I learned

With AI products, the schema is the product: get it small and strict, and both the AI and the renderers become simpler.
