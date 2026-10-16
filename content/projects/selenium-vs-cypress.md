---
slug: selenium-vs-cypress
title: Selenium vs Cypress under network latency
tagline: An MCA research project measuring how two test frameworks behave when the network is slow.
problem: Teams pick a UI testing framework without data on how it copes with slow, real-world networks.
categories: [Research, Tools]
stack: [Selenium, Cypress, Node.js, JavaScript, Google Apps Script]
status: Live
role: Researcher and developer
featured: false
order: 11
page: false
links:
  code: https://github.com/Ritesh-Dhekane/selenium-vs-cypress-latency
  live: https://ritesh-dhekane.github.io/selenium-vs-cypress-latency/
---

- A local copy of a real app (2AM Notes Pro running its real Apps Script code) with the **same server-side delay** applied to every test suite.
- Four suites plus Cypress retry variants; 300 real runs with the results published as a small website.
- No invented numbers: every chart comes from the recorded runs.
