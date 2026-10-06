# Architecture boundary fixtures

These fixtures are intentionally **not production source**.

`npm run architecture:verify` creates temporary package projects under `packages/__architecture-fixture-*`, runs the real ESLint/Nx module-boundary rule against them, and removes them in a `finally` block.

The verifier checks both directions:

- allowed package-to-package examples must lint successfully;
- forbidden package-to-package examples must produce a lint failure;
- the verification command itself succeeds only when the forbidden cases fail as expected.

No forbidden import is committed to `src/`, and no new test framework is required.

The fixture projects are temporary and must never be added to git.
