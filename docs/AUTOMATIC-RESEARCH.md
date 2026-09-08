# Automatic Research Scout

MFTL owns its own continuous research discovery loop.

The scout runs daily at **02:17 UTC / 09:17 Asia/Jakarta** and may also be triggered manually. It searches scholarly metadata through OpenAlex and Crossref, deduplicates against previous MFTL issues, and opens a small number of `[AUTO-RESEARCH]` leads.

## Hard boundary

```text
WEB / SCHOLARLY METADATA
          ↓
AUTO-RESEARCH ISSUE
          ↓
REVIEW / SOURCE INSPECTION
          ↓
DISCOVERY CANDIDATE
          ↓
CLAIMS + SOURCES + EVIDENCE
          ↓
CANONICAL REVIEW
```

The automatic scout **only searches and creates research leads**. It does not write canonical records, create/promote candidate JSON automatically, declare a claim true, manufacture citations, or turn popularity into evidence.

## Conspiracy narratives

Conspiracy narratives are valid MFTL research objects when handled as narratives and evidence claims. MFTL studies origin, transmission, source attribution, evidence invoked, counterevidence, alternative explanations, misinformation/disinformation dynamics when sourceable, and historical/cultural effects.

The existence or popularity of a conspiracy narrative is never evidence that the alleged conspiracy occurred.

Canonical integrity taxonomy code: `E17 conspiracy_narrative`.

## Sources

Discovery uses OpenAlex and Crossref because both expose scholarly metadata without requiring a private API key. A metadata hit remains only a lead until the underlying source is inspected.
