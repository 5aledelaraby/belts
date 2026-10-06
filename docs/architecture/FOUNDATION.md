# Platform Foundation

## Goal

Vicuna is a domain-neutral long-lived personal/commercial platform. Commerce is one optional business domain alongside professional services and content/publishing. The foundation must allow future domains to be added without forcing unrelated domains to understand each other's internals.

The foundation is intentionally stronger than the current feature set. Empty boundaries are acceptable; accidental coupling is not.

## Current architecture decision

- **Repository:** Nx monorepo.
- **Current storefront:** remains at the repository root during the migration so the live site is not disrupted.
- **Applications:** only the current root storefront is registered today. Future API/admin/web application boundaries are vocabulary and migration targets, not projects created now.
- **Business domains:** commerce, content, services.
- **Shared/platform capabilities:** core, contracts, UI, SEO, analytics.
- **Rendering:** retain pre-rendered/static HTML for public crawlable content; add dynamic/API capabilities only where they create real value.
- **Data:** introduce domain contracts before persistence; a database is a future seam, not a current dependency.
- **Infrastructure:** Cloudflare remains the edge/integration layer; heavier infrastructure is introduced only when justified by scale or product requirements.

## Dependency matrix

Allowed means "may depend when a concrete import is needed", not "must depend".

| Source | Allowed targets |
|---|---|
| web app | commerce, content, services, UI, SEO, analytics, contracts, core |
| commerce | contracts, core |
| content | contracts, core |
| services | contracts, core |
| UI | core |
| SEO | contracts, core |
| analytics | contracts, core |
| contracts | core |
| core | none |

Domain packages do **not** depend on other domains or on UI/SEO/analytics. Contracts do not depend on business domains. Core is dependency-free.

## Tag matrix

### Type dimension

| Tag | Meaning |
|---|---|
| type:app | executable application boundary |
| type:domain | business domain |
| type:ui | domain-independent presentation primitives |
| type:platform | cross-cutting platform capability such as SEO/analytics |
| type:contract | shared contracts/validation boundary |
| type:util | minimal dependency-free core primitives |

### Scope dimension

| Tag | Meaning |
|---|---|
| scope:web | current public storefront application |
| scope:commerce | commerce domain |
| scope:content | content/publishing domain |
| scope:services | professional-services domain |
| scope:platform | SEO and analytics capabilities |
| scope:shared | shared UI capability |
| scope:core | core/contracts foundation |

Future scope vocabulary such as API or admin is not a current project.

## Package boundaries

### core

`@vicuna/core` is dependency-free. It may contain only generic primitives such as identifiers, primitive value objects and generic Result/Error abstractions. It must not contain business rules, HTTP, persistence, UI, SEO, analytics or domain concepts.

### contracts

`@vicuna/contracts` holds shared contracts between applications, domains and integrations. It may depend on core only when a concrete primitive is needed. It is not a dumping ground for generic helpers.

### services

`@vicuna/services` is the professional-services business domain: programming, digital marketing, consulting and future professional services. It does not mean generic application services or infrastructure adapters.

### UI

`@vicuna/ui` contains reusable presentation primitives. It must remain independent of commerce, content, services, SEO and analytics.

### SEO / analytics

SEO and analytics are `type:platform` capabilities. They are independent from business domains and may use contracts/core when a real dependency exists.

## Public package APIs

Workspace packages expose a public root entry point such as `@vicuna/commerce`. Do not import `@vicuna/commerce/src/...`.

The existing TypeScript path aliases remain during this foundation phase so current imports are not broken. Package exports are added in parallel; aliases should only be removed after workspace package resolution is verified.

## Boundary enforcement

Nx's ESLint module-boundary rule is configured with both scope and type dimensions. Scope isolates business domains; type rules provide a second guardrail so adding a new scope cannot silently reopen forbidden dependency directions.

Boundary verification fixtures belong outside production source. They must test allowed and forbidden edges without adding fake imports to domain implementation.

## Reproducibility

- Node baseline: 22.12.0+.
- npm is the package manager.
- CI uses `npm ci` and therefore requires a committed `package-lock.json`.
- Do not upgrade unrelated dependencies as part of architecture work.

## Migration rule

The live storefront must continue to work during the migration. Move one boundary at a time, verify the build and output, then remove legacy code only after its replacement is proven.

## Definition of a strong foundation

A future change should be able to add a new product type, professional service, content type, language, integration or application without forcing unrelated domains to know about its internal implementation.
