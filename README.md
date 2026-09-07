# FROM MYTH FADES TO LEGEND — MFTL

> **Expose the myth. Trace the source. Separate story from truth.**

MFTL is an open, provenance-first corpus and research site for mythology, folklore, supernatural claims, ritual traditions, symbols, and comparative theological assessment.

## Core rule

MFTL does **not** equate a culture, ethnicity, religion, story, reader, or modern community with a theological verdict.

The data pipeline is intentionally separated:

```text
MYTH / TRADITION
      ↓
ENTITY + CLAIM + PRACTICE
      ↓
SOURCE + PROVENANCE + EVIDENCE
      ↓
HISTORICITY / ACADEMIC CLASSIFICATION
      ↓
OPTIONAL THEOLOGICAL ASSESSMENT
      ↓
MIZAN / SHIRK-PATTERN ANALYSIS
```

A myth existing is not the same thing as believing it. Belief is not automatically ritual. Ritual is not automatically worship. Every assessment must point back to explicit claims, practices, and sources.

## Repository map

```text
data/
  records/          canonical myth records
  entities/         reusable entities
  sources/          source registry
  indexes/          generated indexes

schemas/
  myth-record.schema.json
  taxonomy.schema.json

taxonomy/
  shirk-dimensions.json
  record-types.json

docs/
  DATA_MODEL.md
  CONTRIBUTING_DATA.md
  RESEARCH_POLICY.md
  AUTOMATION.md

apps/web/
  lightweight public research site

scripts/
  validate.mjs

.github/workflows/
  validate.yml
```

## Record lifecycle

`discovered → sourced → reviewed → assessed → published`

Automated research must never invent citations, overwrite stronger evidence with weaker evidence, or silently convert an academic description into a theological verdict.

## IDs

Examples:

- `MYTH-GRC-000001`
- `ENTITY-GRC-ZEUS`
- `CLAIM-GRC-000001`
- `PRACTICE-GRC-000001`
- `SOURCE-GRC-000001`
- `ASSESS-MIZAN-000001`

## Project

**FROM MYTH FADES TO LEGEND**

A world myth corpus + evidence graph + comparative analysis engine.

Status: **foundation / v0.1**
