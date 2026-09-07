# Hourly Research Automation

> Branch policy: **main-only**.

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
COMMIT TO main
   ↓
CI
   ↓
AUDIT / CORRECT
```

## Rules for automated updates

- Work only on `main`.
- Search globally but prioritize under-covered regions.
- Prefer one high-quality record over many shallow records.
- Search existing IDs, names, aliases, claims, candidates, and canonical records before adding.
- Add source provenance before theological assessment.
- Never invent, infer, or autocomplete a citation.
- Preserve uncertainty and conflicting scholarship.
- Keep theological assessment `not_assessed` unless exact evidence and rule references are available.
- Use `data/candidates/` when evidence is incomplete.
- Validate changed JSON before committing whenever possible.
- Do not delete an existing record merely because a new source disagrees; encode the disagreement.
- Keep academic description separate from theological assessment.
- Never label living people, ethnicities, nationalities, or populations with theological verdicts.
- Commit messages should start with `data:`, `source:`, `review:`, `fix:`, `docs:`, or `web:`.

## Direct-to-main safety contract

Because MFTL is intentionally main-only, automation must be conservative.

A run may commit directly to `main` only when the change is defensible and does not knowingly leave the repository in a schema-invalid state.

When evidence is incomplete, create or improve a candidate rather than pretending the record is canonical.

When no defensible improvement exists, make **no repository change** and report `NO_UPDATE`.

## CI response

After a commit:

1. inspect validation/build state when available;
2. if the commit introduces a defect, repair it on `main` in the same research cycle when possible;
3. never hide a failed validation by weakening schema rules without evidence that the schema itself is wrong.
