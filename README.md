<div align="center">

# FROM MYTH FADES TO LEGEND

### **MFTL**

**Expose the myth · Trace the source · Separate story from truth**

[![Corpus Validation](https://github.com/bjo163/rocksoul-mftl/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/bjo163/rocksoul-mftl/actions/workflows/validate.yml)
![Schema](https://img.shields.io/badge/schema-myth.v0.1-8b5cf6)
![Runtime](https://img.shields.io/badge/Node.js-22-3c873a)
![Language](https://img.shields.io/badge/TypeScript-strict-3178c6)
![Branch](https://img.shields.io/badge/workflow-main--only-black)

**WORLD MYTH CORPUS · EVIDENCE GRAPH · COMPARATIVE RESEARCH ENGINE**

</div>

---

## What is MFTL?

MFTL is a provenance-first research project for documenting mythology, folklore, supernatural claims, historical ritual traditions, symbols, and their sources.

It is designed around one rule:

> **Store what the source says before storing what the analyst concludes.**

MFTL does not collapse a culture, ethnicity, religion, story, reader, or modern community into a theological verdict.

### The evidence chain

```text
MYTH / TRADITION
        ↓
ENTITY · CLAIM · PRACTICE
        ↓
SOURCE · PROVENANCE · EVIDENCE
        ↓
HISTORICITY · ACADEMIC CLASSIFICATION
        ↓
OPTIONAL THEOLOGICAL ASSESSMENT
        ↓
MIZAN / SHIRK-PATTERN ANALYSIS
```

**Myth exists** ≠ **someone believes it** ≠ **ritual** ≠ **worship** ≠ **theological verdict**.

---

## Why this repository is different

| Layer | Question |
|---|---|
| **Myth Registry** | What story, entity, motif, or tradition is being documented? |
| **Claim Graph** | What exactly is being claimed? |
| **Practice Registry** | What is historically reported as being done? |
| **Source Graph** | Which primary, academic, museum, archive, or institutional source supports it? |
| **Evidence Layer** | How strong is the attestation? |
| **Academic Layer** | How is it classified descriptively? |
| **Mizan Layer** | Which explicit theological pattern, if any, matches the documented claim/practice? |

This separation makes the corpus usable for research, graph analysis, historical comparison, and explainable assessment.

---

## Repository atlas

```text
rocksoul-mftl/
│
├── data/
│   ├── candidates/      discovery staging — not canonical truth
│   ├── records/         reviewed canonical myth records
│   └── indexes/         coverage and generated indexes
│
├── schemas/
│   ├── myth-record.schema.json
│   └── discovery-candidate.schema.json
│
├── taxonomy/
│   ├── record-types.json
│   └── shirk-dimensions.json
│
├── docs/
│   ├── INDEX.md
│   ├── DATA_MODEL.md
│   ├── RESEARCH_POLICY.md
│   ├── AUTOMATION.md
│   ├── CONTRIBUTING_DATA.md
│   └── ROADMAP.md
│
├── apps/web/            React + Vite + TypeScript research UI
├── scripts/             corpus validation tooling
└── .github/             CI and research issue templates
```

---

## Record lifecycle

```text
DISCOVERED
    ↓
SOURCED
    ↓
REVIEWED
    ↓
ASSESSED
    ↓
PUBLISHED
```

Incomplete discoveries belong in `data/candidates/`. Canonical records belong in `data/records/`.

The automated researcher is deliberately conservative about promotion: **uncertainty is data, not an error to hide.**

---

## Stable identifiers

| Object | Example |
|---|---|
| Myth record | `MYTH-GRC-000001` |
| Entity | `ENTITY-GRC-ZEUS` |
| Claim | `CLAIM-GRC-000001` |
| Practice | `PRACTICE-GRC-000001` |
| Source | `SOURCE-GRC-000001` |
| Assessment | `ASSESS-MIZAN-000001` |

Graph-compatible relations use simple triples:

```json
{
  "subject": "ENTITY-X",
  "predicate": "associated_with",
  "object": "ENTITY-Y"
}
```

---

## Research rules

MFTL prioritizes primary texts, inscriptions, archaeology, peer-reviewed scholarship, university-press works, museums, libraries, archives, and recognized institutional sources.

Every material claim should be traceable to `source_basis`.

The project explicitly forbids:

- fabricated or AI-invented citations;
- silently upgrading weak evidence to certainty;
- treating disagreement as something to erase;
- inferring a theological verdict from a culture or tradition name;
- labeling living people, ethnicities, nationalities, or populations with theological verdicts.

Read the full policy in **[docs/RESEARCH_POLICY.md](docs/RESEARCH_POLICY.md)**.

---

## Main-only workflow

This repository intentionally uses **`main` as the single working branch**.

```text
RESEARCH
   ↓
DE-DUPLICATE
   ↓
SOURCE + CROSS-CHECK
   ↓
VALIDATE
   ↓
COMMIT TO main
   ↓
CI
   ↓
AUDIT / CORRECT
```

Hourly automation may improve the corpus directly on `main`, but only when the change is evidence-backed and schema-valid. If no defensible improvement exists, it should make no commit.

---

## Local development

```bash
git clone https://github.com/bjo163/rocksoul-mftl.git
cd rocksoul-mftl
npm install

npm run validate
npm run dev
```

Build everything:

```bash
npm run build
```

---

## Documentation

Start at **[docs/INDEX.md](docs/INDEX.md)**.

- [Data model](docs/DATA_MODEL.md)
- [Research policy](docs/RESEARCH_POLICY.md)
- [Automation contract](docs/AUTOMATION.md)
- [Contributing data](docs/CONTRIBUTING_DATA.md)
- [Roadmap](docs/ROADMAP.md)
- [Project issue #1](https://github.com/bjo163/rocksoul-mftl/issues/1)

---

## Current horizon

**v0.1 — Foundation**

- provenance-first schemas ✅
- candidate staging ✅
- evidence taxonomy ✅
- CI validation ✅
- React research-site foundation ✅
- world corpus expansion ◐
- corpus explorer ○
- evidence panels ○
- graph visualization ○
- Mizan explainability ○

---

<div align="center">

### **WHERE MYTH FADES TO LEGEND**

**TRACE · VERIFY · WEIGH · REVEAL**

`MFTL / rocksoul research / v0.1`

</div>
