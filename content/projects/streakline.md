---
slug: streakline
title: Streakline
tagline: A beautiful page of anyone's public GitHub activity — heatmap, streaks, languages and top repos.
problem: GitHub profiles hide a developer's rhythm; there's no clean way to see someone's activity at a glance.
categories: [Web apps, Tools]
stack: [React, TypeScript, Vite, Tailwind, Cloudflare Workers, D1, GitHub API, Vitest]
status: Open source
role: Solo developer
featured: true
order: 2
image: /media/streakline.webp
page: true
links:
  code: https://github.com/Ritesh-Dhekane/streakline
  live: https://ritesh-dhekane.github.io/streakline/
---

## The problem

A GitHub profile shows a contribution graph and little else. I wanted a page that tells the story: streaks, yearly trends, languages, the projects someone contributes to.

## What I built

Enter any GitHub username and get a clean page of their **public** activity: contribution heatmap, current and longest streaks, year-over-year change, pull-request merge rate, recent rhythm, languages, top repositories and outside contributions. Open source (MIT).

## How it works

- Static React site on GitHub Pages with clean `/streakline/<username>` URLs through a 404 fallback.
- GitHub Pages can't keep secrets, so data comes from a **Cloudflare Worker** that holds the GitHub credentials as a secret and returns shaped JSON.
- Authenticates as a **GitHub App with no permissions**, so it can only ever read public data.
- Responses cached for about 6 hours; a D1 database limits lookups per visitor per day; clear error states (not found, rate limited, GitHub down).
- Vitest tests for the calculations and the Worker with recorded GitHub responses.

## Interesting parts

- Honest numbers only: every stat is computed from real data, nothing decorative or invented.

## What I learned

How to keep a fully static site useful with a tiny serverless API, and how to design around rate limits instead of hitting them.
