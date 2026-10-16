---
slug: vendorflow
title: VendorFlow
tagline: One backend to manage products, stock and listings across Amazon, Flipkart and other marketplaces.
problem: Sellers on several marketplaces update the same product and stock in every seller dashboard by hand.
categories: [SaaS, Web apps]
stack: [Java 21, Spring Boot 3.5, Amazon Selling Partner API, OpenAPI, Maven]
status: In progress
role: Solo developer
featured: false
order: 12
page: false
links:
  code: "" # private repo
  live: ""
---

- Products, inventory and marketplace connections managed in one API, with a publish workflow that routes each product to the right marketplace integration.
- **Real Amazon Selling Partner API integration:** reads live catalog items and the seller's own listings, and updates listing fields — no simulated responses.
- Modular monolith with architecture decision records; single-client MVP designed so multi-tenancy can be added later.
- OpenAPI docs and one error format across every endpoint.
