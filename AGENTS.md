# Vicuna platform engineering rules

## Architecture

- This repository is the foundation of a long-lived, domain-neutral platform, not a belts-only codebase.
- Commerce is one optional business domain; content and professional services are independent domains.
- Keep the public storefront fast and crawlable; do not turn it into a client-only SPA by default.
- Treat commerce, content, professional services, SEO, analytics, contracts, core and UI as explicit architectural boundaries.
- Prefer modular design and clear dependency direction before introducing microservices.
- `@vicuna/core` is dependency-free and domain-neutral.
- `@vicuna/contracts` is a contracts boundary, not a generic utility bucket; it may use core only when a concrete primitive is required.
- `@vicuna/services` means professional services such as programming, digital marketing and consulting, not generic application services or infrastructure adapters.
- SEO and analytics use `type:platform`.
- UI primitives remain independent of business domains and platform capabilities.
- Business domains do not depend on other business domains, UI, SEO or analytics.
- Do not add Kubernetes, Redis clusters, message brokers or multiple databases unless a concrete requirement justifies them.
- Keep integrations behind adapters so Google, Meta, WhatsApp, payments and future providers can change independently.

## Repository rules

- Nx is the workspace orchestrator.
- The root storefront remains the legacy runtime until migration work is explicitly completed.
- Do not manually edit `docs/`; it is generated output.
- Do not commit secrets, tokens or credentials.
- Use stable domain IDs/SKUs and keep data models independent from presentation.
- Preserve backwards-compatible URLs during migrations.
- Import workspace packages through public entry points such as `@vicuna/commerce`; never import package-internal `src` paths.
- Existing TypeScript path aliases must remain until workspace package exports are verified.

## Boundary rules

- Keep the approved dependency matrix in `docs/architecture/FOUNDATION.md` authoritative.
- Use Nx module-boundary constraints in both scope and type dimensions.
- Boundary tests/fixtures belong outside production source and must not add fake forbidden imports to real domain code.
- Do not create future application projects merely to reserve names; future API/admin/web boundaries are documentation only until needed.

## Change discipline

- Read the relevant domain boundary before changing code.
- Prefer small, reversible migrations.
- Do not delete existing behavior during architectural moves unless the replacement has been verified.
- Run typecheck and the relevant Nx tasks before considering a migration complete.
- Do not upgrade unrelated dependencies during foundation work.
