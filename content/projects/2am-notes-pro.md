---
slug: 2am-notes-pro
title: 2AM Notes Pro
tagline: A private study portal for MCA, BCA and MBA students (SPPU) — notes, past papers, references and official syllabi from Google Drive, with a reader, read-aloud and search.
problem: Study material for my class was scattered across WhatsApp groups and Drive links, and hard to read on a phone.
categories: [Web apps]
stack: [React, Vite, Tailwind, Google Apps Script, Google Drive, Mermaid, Playwright, GitHub Actions]
status: Live
role: Solo developer (and content writer)
featured: true
order: 1
image: /media/2am-notes-pro.webp
page: false
links:
  code: https://github.com/Ritesh-Dhekane/2am-notes-pro
  live: https://ritesh-dhekane.github.io/2am-notes-pro/
---

- Google sign-in; content lives in a **private Google Drive** and is served only through an Apps Script backend that verifies who's asking and issues its own 7-day sessions — the browser never touches Drive directly.
- Visitors see every semester's subjects locked; after sign-in, students pick their semester and electives, saved with their Google account so they follow them to any device.
- Dashboard (continue reading with progress, saved files, recent additions), subjects with notes by unit, past papers newest first and references, a past-paper archive by exam year, and search across every file (`Ctrl K`).
- Reader for Markdown notes with an outline, exam-tip callouts, code highlighting and diagrams (Mermaid); read-aloud that highlights the sentence being spoken; PDFs, images, Word, Excel and PowerPoint files rendered in the browser.
- Every official SPPU syllabus, refreshed by a weekly Playwright scraper that opens an issue for review, mirrored in Drive so the university's file links never reach the browser.
- Four themes, reading settings, install-as-app; consent-based access logging and privacy-safe analytics.
- Releases only through a reviewed pull request from `dev` to `prod`, with lint, build and backend checks on every PR.
