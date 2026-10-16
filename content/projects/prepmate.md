---
slug: prepmate
title: PrepMate AI
tagline: AI mock interviews — hear the questions, type your answers, get honest feedback.
problem: Students and junior developers rarely get to practise interviews and get specific feedback on their answers.
categories: [AI, Web apps]
stack: [Python, Flask, JavaScript, Google Gemini, edge-tts, pytest]
status: Open source
role: Solo developer
featured: false
order: 11
image: /media/prepmate.webp
page: true
links:
  code: https://github.com/Ritesh-Dhekane/prepmate
  live: ""
---

## The problem

Practising interviews alone is hard: you don't know what a good answer looks like, and friends don't give detailed feedback. "Prepare. Practice. Perform." was the idea.

## What I built

- Pick a role and hear **5 interview questions**, with each spoken word highlighted as it's read.
- Type your answers.
- Get **AI feedback** and a score per question, plus an overall score; the expected topics are shown only after you answer.
- Motion that makes it feel alive: speaking waveform, word glow, an "analysing" sequence and a score reveal — with reduced-motion support.

## How it works

- Flask serves the pages and one `/api/analyze` endpoint that calls Gemini server-side with **structured JSON output** and strict validation.
- 40 questions (10 per role) in JSON; the interview state lives in the browser — no database, no accounts.
- Question audio generated once with a text-to-speech library, with word timings for the highlight.
- pytest for the backend and question data, plus headless-browser checks for the UI.

## What I learned

Small, strict AI outputs (scores and short fields, validated) are far more reliable than asking a model for free text.
