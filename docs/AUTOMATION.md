# MFTL Steward Automation

MFTL research discovery is autonomous and repository-local.

## Daily scheduler

Scheduled at **02:17 UTC / 09:17 Asia/Jakarta**.

Seven Scout lanes run in parallel: mythology/ritual transmission, sacred-place legends, prophecy/apocalyptic narrative, pseudohistory/pseudoarchaeology, conspiracy narrative, urban legend/rumor, and supernatural claims.

```text
7 PARALLEL SCOUTS
      ↓ shortlist artifacts
GLOBAL INTAKE
      ↓ rank + deduplicate
TOP RESEARCH LEADS
      ↓
MFTL STEWARD
      ├ duplicate check
      ├ source/locator signal
      ├ lane semantics
      └ staging decision
      ↓
dev / needs_sources
      ↓
VALIDATE + TEST + BUILD
      ↓
PROMOTE dev → main
```

Steward is the automatic reviewer for discovery intake. It may stage `needs_sources` candidates; it does not manufacture evidence or write canonical `data/records` from metadata alone.

Conspiracy narratives use `E17 conspiracy_narrative`: research provenance, transmission, evidence invoked, counterevidence, alternatives, and effects. Popularity is not proof of the alleged conspiracy.
