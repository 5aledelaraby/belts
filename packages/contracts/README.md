# @vicuna/contracts

Shared contracts between applications, domains and integrations.

Contracts may depend on @vicuna/core only when a concrete shared primitive is required. Contracts must not become a generic utility bucket or depend on business domains, UI, SEO or analytics.

Runtime validation and canonical domain contracts are introduced here only when the corresponding boundary is actually migrated.
