# MFTL Steward Automation

> Branch policy: **main-only**.

MFTL uses one simple automation: **MFTL Steward**.

## Flow

```text
CHECK REPO + OPEN ISSUES
        ↓
BROWSE ONE STRONG RESEARCH LEAD
        ↓
DE-DUPLICATE
        ↓
CREATE / UPDATE [RESEARCH] ISSUE
        ↓
CHECK README / DOCS HYGIENE
        ↓
SMALL FIX IF CLEARLY USEFUL
        ↓
VALIDATE / BUILD / CI
```

## Research rules

- Prefer primary, academic, museum, library, archive, or institutional sources.
- Research goes to GitHub Issues first.
- Do not directly add or canonicalize corpus research data from the browsing step.
- Preserve uncertainty and conflicting scholarship.
- Never fabricate citations.
- Never infer theological verdicts from ethnicity, nationality, tradition name, or story consumption.
- Avoid duplicate research issues.

## Repository hygiene

The Steward may make small, low-risk fixes to:

- `README.md`;
- docs navigation;
- badges and Mermaid diagrams;
- stale wording;
- broken links;
- corpus counter/index presentation.

Do not expand schemas or taxonomies unless required to fix a real consistency problem.

## Safety contract

- Work only on `main`.
- Commit only when the improvement is clearly useful and main remains healthy.
- Validate/build when relevant.
- Inspect CI after commits.
- If there is no useful research issue and no meaningful repo fix, make no change and report `NO_UPDATE`.
