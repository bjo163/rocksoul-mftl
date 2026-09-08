# Rocksoul Research Interoperability

## Ownership

```text
MFTL       STORY / NARRATIVE
LEGEND     EVENT / HISTORICAL CORE
SUPERHERO  PERSON / HUMAN AGENCY
RGBL       TEXT / SCRIPTURE / REVELATION-REFERENCE
```

Ownership is based on the primary research question:

- **What was told?** → MFTL.
- **What happened?** → LEGEND.
- **Who acted, witnessed, recorded, translated, transmitted, interpreted, or disputed it?** → SUPERHERO.
- **What does the exact source/scripture passage say?** → RGBL.

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

RGBL
mw:work:quran
mw:passage:...
```

When an explicit cross-repository notation is useful, qualify the owner:

```text
mftl:MYTH-...
legend:EVT-...
superhero:PER-...
rgbl:mw:work:...
rgbl:mw:passage:...
```

This notation does not require renaming existing data.

## Validation boundary

Repository-local CI validates local schema and graph integrity. Cross-repository targets are not remotely dereferenced during every CI run; their existence is verified during research/audit. This avoids making one repository's build depend on another repository's temporary availability.

## Non-goals

Do not create a shared database or shared monorepo simply to unify IDs. RGBL is the existing corpus/text reference layer; it is not a generic dumping ground for every MFTL/LEGEND/SUPERHERO source object. Stable ownership + explicit references are sufficient for v0.1.


## Same referent, different domain records

Rocksoul ownership is **functional**, not a claim that one real-world referent may exist in only one repository.

For example, a named historical/scriptural person may appear as:

```text
MFTL ENTITY-*          narrative portrayal / motif context
SUPERHERO PER-*        human agency / transmission analysis
RGBL mw:person:*       corpus referent + scoped scriptural/religious assertions
```

These IDs MUST NOT be auto-merged from name similarity.

A crosswalk such as:

```text
superhero:PER-...
↔
rgbl:mw:person:...
```

requires explicit reconciliation evidence. The same rule applies to places, artifacts, and textual sources that appear in more than one domain for different analytical purposes.

## Family boundaries

MFTL families remain broad research categories, but their ownership meaning is now:

- **F02 Entity** — narrative/cultural entity representation. Historical human agency belongs to SUPERHERO; scripture-corpus person identity may exist in RGBL.
- **F06 Text / Transmission** — narrative version, textual drift, quotation, or transmission as an object of narrative research. Exact scripture work/expression/edition/passage/content belongs to RGBL; human transmitter agency belongs to SUPERHERO.
- **F09 Place / Object / Artifact** — symbolic/narrative meaning of a place or object. Historical-event material evidence normally belongs to LEGEND; textual/manuscript supply-chain artifacts normally belong to RGBL.
- **F10 Event Report / Event Claim** — event as narrated or claimed. Canonical historical event belongs to LEGEND.
- **F16 Source / Evidence** — MFTL research evidence remains local when it supports narrative analysis. Exact scripture editions/passages need not be duplicated when RGBL already owns them.

## RGBL assessment vs MFTL analysis

RGBL may expose contextual `mw:assessment:*` records as part of its corpus when the assessment has explicit scope, method, evidence, and provenance.

MFTL must not silently treat those as its own Integrity, Deviation, or Mizan result.

~~~text
RGBL assessment
→ contextual corpus evidence

MFTL assessment
→ narrative / integrity / deviation / optional normative analysis
~~~

Likewise, the mere presence of a work or passage in RGBL does not make that source automatically authoritative for every MFTL/Mizan policy. Source admissibility belongs to the explicit downstream analytical profile.


## Fifth research domain — AWS

`rocksoul-aws` owns **LAW / applicability / legal assessment**.

```text
MFTL       STORY       What was told?
LEGEND     EVENT       What happened?
SUPERHERO  PERSON      Who was involved?
RGBL       TEXT        What does the exact source text say?
AWS        LAW         Was it allowed / legally applicable?
```

Public research grammar:

```text
STORY × EVENT × PERSON × RGBL × AWS
```

AWS may reference records owned by the first four repositories, but it stores them as foreign references and must not copy their canonical ownership into the legal domain.

```text
FOREIGN REFERENCE ≠ OWNERSHIP
LEGAL APPLICABILITY ≠ HISTORICAL FACT
LEGAL RESULT ≠ MIZAN
```

The first five-domain proof remains Jerusalem 70 CE. The historical/textual four-way chain stays intact; AWS adds a separate applicability analysis.
