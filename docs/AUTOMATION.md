# MFTL Steward Automation

> Branch policy: **main-only**.

MFTL uses one research-maintenance loop: **MFTL Steward**. Discovery is **issue-first**; browsing does not directly write or canonicalize corpus data.

## Steward loop

```text
REVIEW MAIN + OPEN RESEARCH ISSUES
              ↓
        DE-DUPLICATE
              ↓
   BROWSE STRONG SOURCES
              ↓
      RESEARCH ISSUE
              ↓
  REPO HYGIENE / SMALL FIX
              ↓
   VALIDATE + TEST + BUILD
              ↓
         INSPECT CI
```

## Research contract

- Prefer primary, academic, museum, library, archive, and institutional sources.
- Create or update a `[RESEARCH]` Issue only when a lead is defensible and non-duplicate.
- Record topic, region/tradition, concise summary, source links, uncertainty/conflicting scholarship, and a suggested next action.
- Treat supernatural efficacy as a historical claim or belief unless independently demonstrated.
- Do **not** add research discovered during browsing directly to `data/records` or silently promote it into canonical corpus truth.
- Candidate/canonical work happens only in a later explicit review step.

## Maintenance contract

- `main` is the only canonical remote working branch.
- Keep GitHub Actions simple: `.github/workflows/validate.yml` is the single repository workflow.
- Small README/docs, navigation, badge, Mermaid, broken-link, counter/index, or stale-wording fixes are allowed when low-risk and clearly useful.
- Do not expand schemas or taxonomies merely to create work.
- Run the repository CI contract (`npm run ci`) when relevant and inspect GitHub Actions after maintenance commits.
- If neither a useful research issue nor a meaningful maintenance fix exists, make no repository change.

## Failure behavior

Uncertainty is a valid outcome. The Steward should preserve conflicting interpretations and leave material unresolved rather than invent evidence or force canonicalization.
