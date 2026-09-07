# Rocksoul Research Interoperability

## Ownership

```text
MFTL       STORY / NARRATIVE
LEGEND     EVENT / HISTORICAL CORE
SUPERHERO  PERSON / HUMAN AGENCY
```

Ownership is based on the primary research question:

- **What was told?** → MFTL.
- **What happened?** → LEGEND.
- **Who acted, witnessed, recorded, translated, transmitted, interpreted, or disputed it?** → SUPERHERO.

## MFTL event boundary

MFTL's F10 event family means **event reports, event claims, events as remembered, narrated, predicted, or interpreted**.

It does not create a second canonical historical-event registry beside LEGEND.

```text
MFTL
"the source says an eruption destroyed the city"

LEGEND
EVT-...
historically defensible eruption / destruction event
```

The two can be linked without collapsing textual attestation into historical proof.

## Person boundary

MFTL may mention named human actors as part of a narrative/source context, but canonical person identity, proximity, authorship, witnessing, and transmission chains belong to SUPERHERO.

## Ecosystem reference notation

Existing native IDs remain unchanged.

Examples:

```text
MFTL
MYTH-MES-INANA-DESCENT-000001
SOURCE-ETCSL-INANA-DESCENT

LEGEND
EVT-COL-GUATAVITA-OFFERINGS
SRC-COL-CAMBRIDGE-GUATAVITA-2024

SUPERHERO
PER-COL-JUAN-RODRIGUEZ-FREYLE
SRC-SH-COL-FREYLE-EL-CARNERO-1636
```

When an explicit cross-repository notation is useful, qualify the owner:

```text
mftl:MYTH-...
legend:EVT-...
superhero:PER-...
```

This notation does not require renaming existing data.

## Validation boundary

Repository-local CI validates local schema and graph integrity. Cross-repository targets are not remotely dereferenced during every CI run; their existence is verified during research/audit. This avoids making one repository's build depend on another repository's temporary availability.

## Non-goals

Do not create a shared database, shared monorepo, or fourth "source" repository simply to unify IDs. Stable ownership + explicit references are sufficient for v0.1.
