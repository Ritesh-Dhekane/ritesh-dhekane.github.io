---
slug: internal-playstore
title: Internal Playstore
tagline: A private app store for a team's Android builds — every version, one link, scan to install.
problem: Teams testing Android apps pass APK files around on chats and drives, and nobody knows which build is the latest.
categories: [Web apps, Tools]
stack: [React, JavaScript, GitHub Actions, GitHub Pages]
status: Live
role: Solo developer
featured: true
order: 6
image: /media/internal-playstore.webp
page: false
links:
  code: https://github.com/Ritesh-Dhekane/internal-playstore
  live: https://ritesh-dhekane.github.io/internal-playstore/#/demo
---

- Each team gets its own page listing its apps with **version, release date and file size**; the latest build is marked.
- **Download or scan a QR code** to install on an Android phone straight away.
- Apps can be public or **password-protected**; everything is driven by small metadata files, so adding a build is a data change, not a code change.
- Deployed automatically with GitHub Actions on every push.
