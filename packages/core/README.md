# @vicuna/core

Minimal, dependency-free foundation primitives shared across the platform.

Allowed content:
- pure TypeScript types and identifiers
- primitive value objects
- generic Result/Error abstractions
- genuinely generic locale/date primitives when needed

Not allowed:
- business-domain rules
- commerce/content/services concepts
- HTTP, database, analytics, SEO or UI concerns
- provider-specific integrations

Core is intentionally small. A package should not depend on core unless it needs a concrete primitive from it.
