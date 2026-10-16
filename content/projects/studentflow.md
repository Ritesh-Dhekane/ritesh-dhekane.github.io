---
slug: studentflow
title: StudentFlow
tagline: Online admissions — students apply step by step and upload documents; admins review and approve.
problem: College admissions still run on paper forms and photocopies of mark sheets.
categories: [Web apps]
stack: [Java 17, Spring Boot 3, Spring Security, JWT, MySQL, Flyway, MinIO, React, MUI, Docker]
status: Complete
role: Solo developer
featured: false
order: 13
page: false
links:
  code: "" # private repo
  live: ""
---

- **Step-by-step application:** personal details → education → documents, with the server enforcing step order, ownership and validation.
- **Document upload** (mark sheets, certificates, photo, ID) to MinIO object storage, with type and size checks.
- Final submission locks the application; an **admin review panel** with role-based APIs approves or rejects it.
- Spring Boot + MySQL with Flyway migrations and JWT auth; React + MUI web portal; runs locally with Docker Compose.
