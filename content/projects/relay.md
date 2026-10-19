---
slug: relay
title: Relay
tagline: A drop-in contact form for any website that opens WhatsApp or email with the message ready to send.
problem: Every project needs a contact or feedback form, and building one again each time (plus a server to receive it) is wasted work.
categories: [Tools, Web apps]
stack: [TypeScript, Web Components, Shadow DOM, Vite, Vitest, GitHub Pages]
status: Open source
role: Solo developer
featured: false
order: 7
image: /media/relay.webp
page: true
links:
  code: https://github.com/Ritesh-Dhekane/relay
  live: https://ritesh-dhekane.github.io/relay/
---

## The problem

Every site I build needs a way for people to get in touch: a contact form on the portfolio, feedback in a
study app, support for a tool. Each one usually means another form, another validation setup and often
another server just to receive the messages.

## What I built

Relay is one small script that adds a contact form to any site, in plain HTML or any framework. Visitors
fill in a short form and Relay opens **WhatsApp** or their **email app** with a clean message ready to
send. There's no server to run and nothing to pay for. A floating "Let's talk" button can open the form in
a pop-up from any page. It's the form behind this portfolio's Contact page.

## How it works

- Two custom elements, `<relay-form>` and `<relay-button>`, built as Web Components with Shadow DOM, so a
  site's CSS can't break them. Everything ships as one 6 KB (gzipped) script.
- Each site picks its fields and adds **flags** (where the message came from, and whether it's contact,
  feedback or support), which arrive at the end of every message.
- Every field is optional, but anything filled in is checked: phone numbers in the international E.164
  format with per-country rules (India: 10 digits starting 6–9), emails with the same rule browsers use,
  names in any language.
- Themed through CSS variables and `::part()` hooks, so it can match any design. Here it uses the
  portfolio's own colours, labels and buttons.

## Interesting parts

- React 19 sets custom-element attributes as properties when a same-named property exists, so an internal
  getter called `fields` broke the form in React. Relay now avoids naming internals after its attributes.
- Accessible by default: real labels, errors announced and focused, a native `<dialog>` with focus
  trapping and Escape to close.

## What I learned

How far a careful, server-less design can go: for most small sites, opening WhatsApp with a well-formed
message is simpler and more reliable than a backend, and the "send" stays in the visitor's hands.
