# Architecture Migration Roadmap

This roadmap deliberately separates the **foundation** from the **migration**. The live site must remain usable at every stage.

## Phase 1 — Foundation (current)

- Nx workspace and project graph.
- npm workspaces for future applications/packages.
- Domain/platform package boundaries and tags.
- TypeScript shared configuration.
- ESLint module-boundary guardrails for new workspace code.
- Agent/developer rules.
- CI validation.
- Environment template without secrets.

## Phase 2 — Extract contracts

- Introduce canonical product/category/variant/service/order/content types.
- Add runtime validation schemas.
- Define stable IDs, SKUs, slugs, money and locale primitives.
- Define unified analytics event contracts.
- Define SEO/structured-data contracts.

## Phase 3 — Migrate the storefront incrementally

- Move commerce data first.
- Move reusable UI primitives.
- Move SEO generation.
- Move analytics/event dispatch.
- Move content/blog handling.
- Keep generated `docs/` output unchanged as the deployment artifact until the replacement build is verified.

## Phase 4 — Dynamic seams

Only when needed:

- API application.
- Database adapter and migrations.
- Authentication/identity.
- Inventory/order backend.
- Payment adapters.
- Object/media storage.
- Background jobs/queue.

## Phase 5 — Platform expansion

- Admin application.
- Travel/content publishing capabilities.
- Programming and digital-marketing service offerings.
- Additional products and catalogs.
- Additional locales/currencies.

## Phase 6 — Scale only when evidence requires it

- Redis/cache.
- Dedicated queue/broker.
- Independent services.
- Multiple databases where ownership/scale justifies separation.
- Kubernetes or another orchestration platform.
- Multi-repo/Polygraph only when organizational boundaries make a single repo counterproductive.

## Non-negotiable migration rule

Never replace a working subsystem merely because a newer architecture is available. Every migration must have a measurable benefit, a rollback path, and verification of the current behavior.
