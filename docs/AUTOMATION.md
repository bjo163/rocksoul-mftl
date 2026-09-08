# MFTL Steward Automation

> Branch policy: **main-only**.

MFTL research discovery is autonomous and repository-local.

## Daily schedule

`02:17 UTC / 09:17 Asia/Jakarta`

Seven Scout lanes run in parallel:

1. myth / ritual / narrative transmission
2. sacred-place legend
3. prophecy / apocalyptic narrative
4. pseudohistory / pseudoarchaeology
5. conspiracy narrative
6. urban legend / rumor
7. supernatural claim

Each lane may open at most one new scholarly lead per daily run. The Scout searches OpenAlex and Crossref metadata and de-duplicates by fingerprint.

After all Scout lanes finish, **MFTL Steward** automatically performs the second pass:

```text
PARALLEL SCOUTS
      ↓
AUTO-RESEARCH ISSUES
      ↓
MFTL STEWARD
      ├── duplicate check
      ├── source/locator signal
      ├── rule-based score
      └── decision
             ↓
      stage_candidate / needs_sources / hold / duplicate
             ↓
      VALIDATE + TEST + BUILD
             ↓
      COMMIT STAGING DATA
```

## Steward scope

The Steward is the automated reviewer for discovery intake. It may stage a candidate as `needs_sources` after review, but it does not write `data/records` or fabricate claim-level evidence.

A candidate becomes canonical only when structured evidence is strong enough for the canonical schemas and gates. Automation is allowed to leave material unresolved indefinitely rather than force a conclusion.

## Conspiracy narratives

`E17 conspiracy_narrative` is a first-class integrity category. The research object is the narrative, provenance, transmission, invoked evidence, counterevidence, and effects. Popularity is never evidence that the alleged conspiracy occurred.

## Failure behavior

- One failed Scout lane does not cancel the other lanes.
- Steward runs after the Scout matrix completes.
- Validation/build occurs before automated staging data is pushed.
- No useful lead is a valid outcome; the system need not invent work.
