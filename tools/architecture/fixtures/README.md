# Architecture boundary fixtures

These fixtures are intentionally outside production source.

The fixture matrix represents allowed and forbidden dependency edges. The verification script checks the current package tags, scans package source imports, and validates every fixture edge against the approved matrix.

Do not add fake forbidden imports to production packages merely to prove a boundary rule.
