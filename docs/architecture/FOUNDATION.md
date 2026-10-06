# Platform Foundation

## Goal

Vicuna is being evolved from a static belts storefront into a long-lived personal/commercial platform that can later host commerce, programming and digital-marketing services, travel and photography content, articles, projects and additional products or services.

The foundation is intentionally stronger than the current feature set. Empty boundaries are acceptable; accidental coupling is not.

## Current architecture decision

- **Repository:** Nx monorepo.
- **Current storefront:** remains at the repository root during the migration so the live site is not disrupted.
- **Future applications:** `apps/storefront`, `apps/api`, `apps/admin`.
- **Domain packages:** commerce, content, services.
- **Platform packages:** SEO, analytics, schemas, UI.
- **Rendering:** retain pre-rendered/static HTML for public crawlable content; add dynamic/API capabilities where they create real value.
- **Data:** design domain contracts so a database can be introduced without rewriting the public UI.
- **Infrastructure:** Cloudflare remains the edge/integration layer; heavier infrastructure is introduced only when justified by scale or product requirements.

## Dependency direction

```
Application
   ↓
Domain packages ──────┐
   ↓                  │
Platform packages ←───┘
```

Domain packages may depend on platform primitives. Platform packages must not depend on business domains. Applications compose domains and platform capabilities.

Nx project tags are the guardrail for these rules. Nx's project graph and module-boundary tooling are intended to keep a growing monorepo navigable and prevent accidental cross-dependencies.

## Planned domains

| Boundary | Responsibility |
|---|---|
| commerce | products, categories, variants, pricing, inventory, carts, orders, checkout |
| content | articles, guides, travel stories, photography/media and publishing |
| services | programming, digital marketing, consulting and future services |
| seo | metadata, canonical URLs, structured data, sitemap and robots |
| analytics | unified event contracts and provider adapters |
| schemas | shared contracts/validation between applications and integrations |
| ui | reusable presentation primitives/design system |

## Future infrastructure seams

These are seams, not commitments to deploy the technology today:

- API boundary
- PostgreSQL/database boundary
- cache boundary
- asynchronous job/queue boundary
- object/media storage boundary
- authentication/identity boundary
- payments boundary
- external catalog/feed adapters

## Migration rule

The live storefront must continue to work during the migration. Move one domain at a time, verify the build and output, then remove legacy code only after its replacement is proven.

## Definition of a strong foundation

A future change should be able to add a new product type, service, content type, language, integration or application without forcing unrelated domains to know about its internal implementation.
