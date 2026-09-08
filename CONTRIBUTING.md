# Contributing to MFTL

Thank you for improving the **From Myth Fades To Legend** corpus.

## Branch policy

MFTL is intentionally **main-only**. Changes land on `main`.

For automated or direct maintenance, keep every commit narrow, evidence-backed, and schema-valid.

## Before adding a record

1. Search existing canonical records and candidates.
2. Check canonical names and aliases for duplicates.
3. Identify the tradition, region, and record type.
4. Gather meaningful provenance.
5. Extract explicit claims and practices.
6. Link every material claim to `source_basis`.
7. Preserve uncertainty instead of forcing certainty.
8. Validate the JSON.

## Candidate vs canonical

Use `data/candidates/` when:

- discovery is promising but sourcing is incomplete;
- identity/equivalence is uncertain;
- only low-authority sources have been found;
- duplicate resolution is still needed.

Use `data/records/` when:

- provenance is sufficient for the claims being made;
- record identity is stable enough;
- claim-to-source linkage is present;
- the record validates against the canonical schema.

## Commit vocabulary

Prefer:

- `data:` corpus records and indexes
- `source:` provenance improvements
- `review:` evidence or classification review
- `fix:` correctness/schema/build repair
- `docs:` documentation
- `web:` research UI

## Never do this

Do not fabricate citations, turn weak evidence into certainty, erase documented disagreement, or assign theological verdicts to people or populations.

See [docs/RESEARCH_POLICY.md](docs/RESEARCH_POLICY.md).
