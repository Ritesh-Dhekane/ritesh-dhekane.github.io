---
slug: hrstack
title: HRStack
tagline: Employee management for companies — from offer letter to payroll, in one app.
problem: Small companies run hiring, onboarding, attendance and payroll across emails, spreadsheets and paper files.
categories: [SaaS, Web apps]
stack: [Java 17, Spring Boot 3, Spring Security, PostgreSQL, React, TypeScript, AWS S3, Tesseract OCR]
status: In progress
role: Solo developer (backend, frontend, data model)
featured: false
order: 9
page: true
links:
  code: "" # TODO(ritesh): hrstackapp repos public? add link if yes
  live: ""
---

## The problem

Growing companies handle the employee lifecycle in pieces: an offer letter in Word, approvals over email, onboarding documents on WhatsApp, attendance in a sheet, payroll somewhere else. Nothing is connected, and HR spends its time chasing files.

## What I built

A multi-tenant SaaS where each company subscribes and manages the whole lifecycle in one place:

- **Offer → approval → onboarding → active employee**, with documents collected and checked along the way.
- **Attendance, leave and payroll** for active employees.
- **Roles** for super admin, company admin, HR and employee, each seeing only what they should.
- **Document field extraction** with OCR (Tesseract), so uploaded documents fill in details automatically.

## How it works

- Spring Boot API with a controller → service → repository structure, DTOs, validation and one error format (`{ data, error }`).
- **Tenant isolation at the row level:** every company-scoped table carries a `company_id`, and the company always comes from the signed-in user's token, never from request parameters.
- **Stateless auth:** short-lived JWT access token in memory, refresh token in an httpOnly cookie, with a table to revoke refresh tokens.
- React + TypeScript frontend with React Query; files in S3-compatible storage (MinIO locally, AWS S3 in production).
- Decisions recorded as ADRs; schema, workflows and backlog kept in a separate "project OS" repo.

## Interesting parts

- **A user is not an employee.** Separating the login identity from the HR record kept invitations, re-hiring and access changes simple.
- **Soft deletes and UUIDs everywhere,** so nothing important is lost and IDs can't be guessed.

## What I learned

Designing multi-tenancy from day one is much easier than adding it later, and writing decisions down (ADRs) saved me from re-arguing the same choices.
