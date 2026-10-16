# Ritesh Dhekane — I learn the manual mid-flight.

Full-stack developer from Pune. Give me a problem — a business website, a SaaS product, an AI tool or
something nobody has built yet — and I'll figure it out and ship it.

**Portfolio:** [ritesh-dhekane.github.io](https://ritesh-dhekane.github.io/) ·
**WhatsApp:** [chat](https://wa.me/919322527567) ·
**Email:** [ritesh.dhekane@outlook.com](mailto:ritesh.dhekane@outlook.com) ·
**LinkedIn:** [riteshdhekane](https://www.linkedin.com/in/riteshdhekane)

---

## Things I've built

| Project | What it does | Built with |
|---|---|---|
| [**2AM Notes Pro**](https://github.com/Ritesh-Dhekane/2am-notes-pro) | Private exam-notes portal on Google Drive with read-aloud, for my MCA class. [Live](https://ritesh-dhekane.github.io/2am-notes-pro/) | React, Apps Script |
| [**Streakline**](https://github.com/Ritesh-Dhekane/streakline) | A clean page of anyone's public GitHub activity. [Live](https://ritesh-dhekane.github.io/streakline/) | React, Cloudflare Workers |
| [**Resume Builder**](https://github.com/Ritesh-Dhekane/resume-builder) | Templates, live A4 preview, PDF export — all in the browser. [Live](https://ritesh-dhekane.github.io/resume-builder/) | JavaScript, Vite |
| [**SlideCraft**](https://github.com/Ritesh-Dhekane/slidecraft) | Describe a deck in chat, get a PowerPoint where every element is still editable. [Demo](https://ritesh-dhekane.github.io/slidecraft/) | React, Node.js, pptxgenjs, Gemini |
| [**2AM Notes**](https://github.com/Ritesh-Dhekane/2am-notes) | Public, Markdown-first exam notes with search and an audio reader. [Live](https://ritesh-dhekane.github.io/2am-notes/) | React, Vite |
| [**Internal Playstore**](https://github.com/Ritesh-Dhekane/internal-playstore) | A private app store for a team's Android builds: versions, download or scan to install. [Demo](https://ritesh-dhekane.github.io/internal-playstore/#/demo) | React, GitHub Actions |
| [**Shree Ganesha Demo Portal**](https://github.com/Ritesh-Dhekane/shreeganesha-demo-portal) | Client demos, design approvals and decisions for a jewellery store, in one place. [Live](https://ritesh-dhekane.github.io/shreeganesha-demo-portal/) | React, Vite |
| **HRStack** | Employee management for companies: offer letter → onboarding → attendance, leave and payroll. | Java, Spring Boot, PostgreSQL, React |
| **FeeProof** | Collect fees by UPI or bank transfer and verify every payment in one place, without a payment gateway. | React, Hono, Postgres |
| **RD Platforms** | One codebase powering many small-business websites; orders fall back to WhatsApp. | React, Spring Boot, PostgreSQL |
| [**PrepMate AI**](https://github.com/Ritesh-Dhekane/prepmate) | AI mock interviews: spoken questions, typed answers, scored feedback. | Flask, Gemini |
| **VendorFlow** | One backend for products, stock and listings across Amazon, Flipkart and more. | Java 21, Spring Boot, Amazon SP-API |
| **StudentFlow** | Online admissions: step-by-step applications, document upload, admin review. | Spring Boot, MySQL, React |
| [**LiftLog**](https://github.com/Ritesh-Dhekane/liftlog-mobile) | Offline-first fitness tracker for Android and iOS. | React Native, Expo, SQLite |
| [**Selenium vs Cypress**](https://github.com/Ritesh-Dhekane/selenium-vs-cypress-latency) | Research: how two test frameworks behave on slow networks. [Results](https://ritesh-dhekane.github.io/selenium-vs-cypress-latency/) | Selenium, Cypress |
| **Memory Pipelines** *(in progress)* | Photos and videos from every phone, sorted into one de-duplicated library. | Python, SQLite |

## Toolkit

**Backend:** Java, Spring Boot, Spring Security, REST APIs, Node.js, Python, Flask ·
**Frontend:** React, TypeScript, Vite, Tailwind ·
**Data:** PostgreSQL, SQLite, Drizzle, Flyway ·
**Cloud:** AWS S3, Cognito, Cloudflare Workers, Netlify, GitHub Actions ·
**AI:** Gemini API, structured AI output ·
**Testing:** Playwright, Vitest, pytest, Testcontainers, Selenium, Cypress

…and whatever the next project needs.

## Experience

- **Software Engineer**, full-stack product team (B2B SaaS), Jun 2025 – present — Spring Boot services,
  React/TypeScript apps, PostgreSQL, AWS; concurrency fixes, auth flows, production support.
- **Software Engineer Intern**, data engineering, Jan – Apr 2025 — Spark and Azure Data Factory pipelines.
- **MCA** (2026 – present) · **B.Sc. Computer Science**, CGPA 8.82 (2022 – 2025)

## Got something that needs building?

Message me on [WhatsApp](https://wa.me/919322527567) or [email](mailto:ritesh.dhekane@outlook.com).
I usually reply within a day.

---

## Working on this repo

- Vite + React + TypeScript. `content/` holds the profile (`profile.json`) and one Markdown file per
  project; the site reads them at build time.
- `npm run dev` · `npm test` · `npm run check` (content checks) · `npm run build` (type check, build,
  then `404.html`, `sitemap.xml`, `robots.txt`).
- Optional repo secret `VITE_GA_MEASUREMENT_ID` turns on privacy-safe GA4 (page views and a few
  click events, never anything typed). Drop a `public/resume.pdf` and set `links.resume` to
  `/resume.pdf` to show the résumé link.
- **Branches:** push to `dev` freely. `prod` only changes through a pull request from `dev`; the
  **Checks** workflow must pass on the PR, and merging it deploys the site to GitHub Pages
  (`deploy.yml`). Pushes to `dev` never deploy.

<sub>This repository is also the source of my portfolio website (`content/` holds the profile and
project write-ups).</sub>
