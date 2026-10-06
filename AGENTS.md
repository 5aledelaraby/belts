# Vicuna platform engineering rules

## Architecture

- This repository is the foundation of a long-lived platform, not a belts-only codebase.
- Keep the public storefront fast and crawlable; do not turn it into a client-only SPA by default.
- Treat commerce, content, services, SEO, analytics, schemas and UI as explicit architectural boundaries.
- Prefer modular design and clear dependency direction before introducing microservices.
- Do not add Kubernetes, Redis clusters, message brokers or multiple databases unless a concrete requirement justifies them.
- Keep integrations behind adapters so Google, Meta, WhatsApp, payments and future providers can change independently.

## Repository rules

- Nx is the workspace orchestrator.
- The root storefront remains the legacy runtime until migration work is explicitly completed.
- Do not manually edit `docs/`; it is generated output.
- Do not commit secrets, tokens or credentials.
- Use stable domain IDs/SKUs and keep data models independent from presentation.
- Preserve backwards-compatible URLs during migrations.

## Change discipline

- Read the relevant domain boundary before changing code.
- Prefer small, reversible migrations.
- Do not delete existing behavior during architectural moves unless the replacement has been verified.
- Run typecheck and the relevant Nx tasks before considering a migration complete.
