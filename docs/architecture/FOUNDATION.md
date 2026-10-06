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
- **Rendering:** retain pre-rendered/static HTML for public crawlable content; conceptually use SSG for stable landing/docs/article pages and SSR only for future user/session-dependent routes. Client-side interaction remains appropriate for local form state and non-SEO interactions. No current route is redesigned by this foundation.
- **Data:** introduce domain contracts before persistence; a database is a future seam, not a current dependency.
- **Infrastructure:** Cloudflare remains the edge/integration layer; heavier infrastructure is introduced only when justified by scale or product requirements.

## Project discovery and configuration authority

The root `package.json` owns npm workspaces and package metadata. The root `project.json` is the explicit Nx configuration for the current `storefront` project. Each package `project.json` is the authoritative Nx project definition for that package's identity, tags and project metadata, while the sibling package `package.json` owns npm metadata and public exports. Nx combines same-root `package.json` and `project.json` configuration; they are not separate duplicate projects. The existing discovery mechanism is preserved. Nx also reads the npm workspace patterns to discover workspace packages.

## Dependency matrix

The matrix defines **allowed dependency edges**, not required dependencies. An allowed edge means the source package **may** import the target when a concrete implementation need exists. It does not mean the source package should import the target, and it must not be used as a reason to add an artificial import.

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

Interpret the rows as optional sets:

- **core:** depends on nothing.
- **contracts:** may depend on core only when a concrete shared primitive is required; it may also depend on nothing.
- **commerce/content/services:** may depend on core and/or contracts only when actually required.
- **ui:** may depend on core only when actually required.
- **seo/analytics:** may depend on core and/or contracts only when actually required.
- **web app:** may compose any of its allowed targets when the storefront actually needs them.

The current source code does not need to import every allowed target. The dependency graph should reflect real imports, not the theoretical maximum permitted by the matrix.

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

`@vicuna/contracts` holds shared contracts between applications, domains and integrations. It may depend on core only when a concrete primitive is needed, and it may remain dependency-free when its contracts do not require a core primitive. It is not a dumping ground for generic helpers.

### services

`@vicuna/services` is the professional-services business domain: programming, digital marketing, consulting and future professional services. It does not mean generic application services or infrastructure adapters.

### UI

`@vicuna/ui` contains reusable presentation primitives. It must remain independent of commerce, content, services, SEO and analytics, and may depend on core only when a real UI primitive needs it.

### SEO / analytics

SEO and analytics are `type:platform` capabilities. They are independent from business domains and may use contracts and/or core only when a real dependency exists.

## API-first boundary

API-first is a boundary rule, not a requirement to build a complete API now:

- UI consumes explicit request/response contracts rather than persistence or ORM models.
- Domain logic remains independent of HTTP and React.
- Future API handlers translate transport input into application/domain inputs.
- Future repositories expose domain-facing interfaces; PostgreSQL, Redis and queue adapters remain outside domains.
- Only real current or explicitly approved use cases should introduce application/use-case layers or additional contracts.

## Cloudflare compatibility

The current Worker uses the Workers web runtime model and remains outside the domain packages. New domain/platform code should prefer web-standard APIs such as `fetch`, `Request`, `Response`, `URL`, Web Crypto and Web Streams rather than Node-only runtime assumptions. Cloudflare now provides a growing Node compatibility surface, but that is not a reason to make domain code depend on Node APIs; portability remains the safer architectural default.

No domain package may import Cloudflare bindings, filesystem APIs, sockets, child-process APIs, database drivers, Redis clients or queue implementations.

## Public package APIs

Workspace packages expose a public root entry point such as `@vicuna/commerce`. Do not import `@vicuna/commerce/src/...`.

The existing TypeScript path aliases remain during this foundation phase so current imports are not broken. Package exports are added in parallel; aliases should only be removed after workspace package resolution is verified. Nx's workspace guidance likewise recommends installing/linking workspace packages before removing path aliases.

## Boundary enforcement

Nx's ESLint module-boundary rule is configured with both scope and type dimensions. Scope isolates business domains; the type dimension no longer contains a blanket domain-to-domain allowance. This prevents a future scope from silently reopening cross-domain dependency directions. The separate ESLint restriction rejects workspace package internal `src` imports.

Boundary verification fixtures belong outside production source. They test allowed edges, the complete current forbidden package-edge complement, and internal package `src` imports without adding forbidden imports to real domain implementation.

## Nx tasks and caching

Workspace-level target defaults keep build, typecheck, test and lint cacheable. The current foundation does not add a TypeScript inference plugin or a new build system; the root typecheck explicitly includes the foundation packages so package source is checked without changing runtime behavior. A future package-level TypeScript plugin can be introduced when package-level build/typecheck tasks are actually needed. Nx's TypeScript plugin is the intended later path for inferred per-project typecheck/build tasks.

## Reproducibility

- Node baseline: 22.12.0+.
- npm is the package manager.
- There is currently **no `package-lock.json`** on this branch, so CI correctly uses `npm install` rather than `npm ci`.
- A lockfile should be generated only in an environment with registry access and committed only after `npm install`/lockfile validation and `npm ci` both succeed.
- Do not upgrade unrelated dependencies as part of architecture work.

## Migration rule

The live storefront must continue to work during the migration. Move one boundary at a time, verify the build and output, then remove legacy code only after its replacement is proven.

## Definition of a strong foundation

A future change should be able to add a new product type, professional service, content type, language, integration or application without forcing unrelated domains to know about its internal implementation.
