---
slug: 2am-notes-pro
title: 2AM Notes Pro
tagline: A private exam-notes portal for my MCA class — notes, past papers and solutions from Google Drive, with read-aloud.
problem: Study material for my class was scattered across WhatsApp groups and Drive links, and hard to read on a phone.
categories: [Web apps]
stack: [React, Vite, Tailwind, Google Apps Script, Google Drive, Mermaid, GitHub Actions]
status: Live
role: Solo developer (and content writer)
featured: false
order: 7
page: false
links:
  code: https://github.com/Ritesh-Dhekane/2am-notes-pro
  live: https://ritesh-dhekane.github.io/2am-notes-pro/
---

- Google sign-in; content lives in a **private Google Drive** and is served only through an Apps Script backend that checks who's asking — the browser never touches Drive directly.
- Subjects by semester and elective, each with notes, past-paper solutions, assignments and references; Markdown with diagrams (Mermaid), images and read-aloud.
- Guest preview, access logging, privacy-safe analytics, and a phone-first UI.
- Releases only through a reviewed pull request from `main` to `prod`, with lint, build and backend checks on every PR.
