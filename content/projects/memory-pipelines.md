---
slug: memory-pipelines
title: Memory Pipelines
tagline: Years of photos and videos from every phone, sorted into one clean, de-duplicated library.
problem: Family photos and videos sit scattered across old phones and folders, full of duplicates and with no order.
categories: [Tools]
stack: [Python, SQLite, exiftool]
status: In progress
role: Solo developer
featured: false
order: 16
page: false
links:
  code: ""
  live: ""
---

**Work in progress — designed, being built.**

- Copy photos and videos from any device into one inbox; a command-line tool works through it in small, safe chunks.
- **Duplicates never reach the library:** every file is fingerprinted, and a copy you already have is only recorded, not stored again.
- Files are filed by the date they were taken (`year / quarter / month / day`), with camera, location and source kept alongside — the originals are never changed.
- Each chunk is copied, verified and committed on its own, so stopping halfway loses nothing.
