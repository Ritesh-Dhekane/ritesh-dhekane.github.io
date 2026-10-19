---
slug: rdplatforms
title: RD Platforms
tagline: One codebase that powers many small-business websites — a salon, a restaurant, a 3D-printing shop.
problem: Every small business needs a good website, but building and maintaining one per business doesn't scale.
categories: [Web apps, SaaS]
stack: [React, TypeScript, Vite, MUI, TanStack Query, Zod, Spring Boot, PostgreSQL, Flyway, pnpm workspaces]
status: In progress
role: Solo developer and architect
featured: false
order: 11
image: /media/rdplatforms.webp
page: true
links:
  code: "" # TODO(ritesh): rdplatforms org repos public?
  live: "" # TODO(ritesh): a demo business site URL
---

## The problem

A salon, a restaurant and a 3D-printing shop all need the same things online: who they are, what they offer, prices, photos, bookings or orders, and a way to contact them. Building a separate site for each means fixing the same bug ten times.

## What I built

A multi-tenant website platform where **the difference between businesses is data, not code**:

- A public **website** app that renders any business from its data (services, menu, products, gallery, hours, languages).
- A **portal** for business owners and staff: bookings, staff, billing and analytics.
- An **admin** console for the operator.
- Bookings, contact and checkout all **fall back to WhatsApp**, so a business can start with zero backend.

## How it works

- pnpm monorepo with shared packages; strict TypeScript, React Hook Form + Zod, TanStack Query.
- A resolver picks the business from the URL query, the hostname or an environment fallback.
- Services read from a data source that can be **static JSON or the Spring Boot API**, switched by configuration, so a site can go live before the backend exists.
- Three backend tiers per deployment: WhatsApp hand-off, Google Apps Script, or the full API.
- Spring Boot + PostgreSQL backend with Flyway migrations and Testcontainers tests; 16 architecture decision records.

## Interesting parts

- **One rule kept it honest:** UI code never checks which business it is. If two businesses need different behaviour, that becomes a data field.
- Bilingual support (Marathi and English) from the same components.

## What I learned

Pushing differences into data made new businesses a configuration task instead of a development task.
