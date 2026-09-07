# Hourly Research Automation

## Intended workflow

```text
DISCOVER
   ↓
DE-DUPLICATE
   ↓
SOURCE
   ↓
EXTRACT CLAIMS / PRACTICES
   ↓
CROSS-CHECK
   ↓
VALIDATE JSON
   ↓
COMMIT TO dev
   ↓
AUDIT
   ↓
PROMOTE TO main
```

## Rules for automated updates

- Work on `dev`, never directly mutate `main`.
- Search globally but prioritize under-covered regions.
- Prefer one high-quality record over many shallow records.
- Search existing IDs, names, aliases, and claims before adding.
- Add source provenance before theological assessment.
- Do not invent or autocomplete a citation.
- Preserve uncertainty and conflicting scholarship.
- Keep theological assessment `not_assessed` unless exact evidence and rule references are available.
- Validate all changed JSON before commit.
- Do not delete an existing record merely because a new source disagrees; record the disagreement.
- Commit messages should start with `data:`, `source:`, `review:`, or `fix:`.

## Promotion

`main` is curated/stable. Promotion from `dev` should occur only after schema validation and evidence review.
