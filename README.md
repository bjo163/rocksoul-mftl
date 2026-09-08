<div align="center">

<img src="https://raw.githubusercontent.com/bjo163/rocksoul-assets/main/moonwitness/brand/logo-horizontal.svg" alt="MoonWitness" width="380" />

# MFTL

## FROM MYTH FADES TO LEGEND

### **TRACE THE STORY.**

#### FIND THE SOURCE · WEIGH THE EVIDENCE

A provenance-first **Narrative & Belief Intelligence Corpus** for mythology, folklore, supernatural claims, historical ritual traditions, information integrity, deviation, and explainable comparative analysis.

**MOONWITNESS · ROCKSOUL RESEARCH · STORY × EVENT × PERSON × TEXT × LAW**

<br/>

[![Corpus Validation](https://github.com/bjo163/rocksoul-mftl/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/bjo163/rocksoul-mftl/actions/workflows/validate.yml)
![Workflow](https://img.shields.io/badge/workflow-main--only-111111)
![Runtime](https://img.shields.io/badge/Node.js-22-3C873A)
![Language](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Domain](https://img.shields.io/badge/domain-STORY-6F6F6F)
![Corpus](https://img.shields.io/badge/corpus-provenance--first-B43A32)
![Design](https://img.shields.io/badge/design-rocksoul--assets-6C63FF)
![Console](https://img.shields.io/badge/console-rocksoul--crayon-2E8B57)

<br/>

**WORLD CORPUS · EVIDENCE GRAPH · SOURCE LINEAGE · NARRATIVE INTEGRITY · MIZAN**

[Architecture](#the-intelligence-graph) · [Corpus](#corpus-snapshot) · [Research queue](#research-queue) · [Documentation](#documentation) · [Assets](https://github.com/bjo163/rocksoul-assets) · [Console](https://github.com/bjo163/rocksoul-crayon)

</div>

---

> **MFTL stores what the source says before storing what the analyst concludes.**

A myth can exist without being believed.  
A belief is not automatically a ritual.  
A ritual is not automatically worship.  
A false claim is not automatically a hoax.  
A deviation cannot exist without an explicit baseline.  
A textual attestation is not the same thing as empirical proof.

That separation is the foundation of MFTL.

## Visual + console boundary

<div align="center">

<img src="https://raw.githubusercontent.com/bjo163/rocksoul-assets/main/moonwitness/ui/v2/17-dashboard.svg" alt="Rocksoul dashboard" width="860" />

</div>

- **`rocksoul-assets`** owns shared visual language, application shell, icons, dashboard components, data-viz, system states, and motion references.
- **`rocksoul-crayon`** is the operational console that exposes STORY resources beside EVENT, PERSON, TEXT, and LAW.
- **MFTL remains canonical owner of STORY / narrative / belief intelligence.**

## MoonWitness / Rocksoul research map

```text
DESIGN     → ROCKSOUL-ASSETS
CONSOLE    → ROCKSOUL-CRAYON
MFTL       → STORY / NARRATIVE
LEGEND     → CANONICAL EVENT / HISTORICAL CORE
SUPERHERO  → PERSON / HUMAN AGENCY
RGBL       → TEXT / SCRIPTURE / REVELATION-REFERENCE
AWS        → LAW / APPLICABILITY / LEGAL ANALYSIS
```

| Repository | Layer | Core question / role |
|---|---|---|
| [`rocksoul-assets`](https://github.com/bjo163/rocksoul-assets) | DESIGN | How should the ecosystem look? |
| [`rocksoul-crayon`](https://github.com/bjo163/rocksoul-crayon) | CONSOLE | How do operators work across it? |
| **`rocksoul-mftl`** | STORY | What was told? |
| [`rocksoul-legend`](https://github.com/bjo163/rocksoul-legend) | EVENT | What happened? |
| [`rocksoul-superhero`](https://github.com/bjo163/rocksoul-superhero) | PERSON | Who was involved? |
| [`rocksoul-rgbl`](https://github.com/bjo163/rocksoul-rgbl) | TEXT | What does the exact text say? |
| [`rocksoul-aws`](https://github.com/bjo163/rocksoul-aws) | LAW | Was it allowed? |

MFTL may describe **event reports, event claims, persons as narrated, quoted texts, or legal claims as narrative material**, but canonical ownership remains separated: EVENT → LEGEND, PERSON → SUPERHERO, exact TEXT → RGBL, LAW → AWS.

[Read the interoperability contract →](docs/INTEROP.md)

## Four-way proof case

### **CASE 001 — JERUSALEM 70 CE**

```text
RGBL TEXT
   ↓
MFTL STORY
   ↓
LEGEND EVENT
   ↑
SUPERHERO PERSON
```

Mark 13:2 supplies the exact textual prediction; MFTL owns the prediction narrative; LEGEND independently models the 70 CE destruction; SUPERHERO models Josephus as witness/recorder. **Text–event correspondence is preserved without silently becoming a supernatural-fulfillment verdict.** AWS can consume the same cross-repository graph when a later legal question exists, without changing the four-way historical proof.

[Read the shared case →](docs/cases/JERUSALEM-70-TEMPLE.md)

## The intelligence graph

```mermaid
flowchart LR
    A["NARRATIVE / EVENT-CLAIM / CLAIM"] --> B["ENTITY + PRACTICE"]
    B --> C["SOURCE + PROVENANCE"]
    C --> D["EVIDENCE"]
    D --> E["SUPPORT"]
    D --> F["COUNTEREVIDENCE"]
    D --> G["ALTERNATIVE EXPLANATION"]
    E --> H["HISTORICITY"]
    F --> H
    G --> H
    H --> I["INTEGRITY"]
    I --> J["DEVIATION"]
    J --> K["OPTIONAL MIZAN"]
    K --> L["EXPLAINABLE RESULT"]
```

<div align="center">

### **DESCRIPTION ≠ VERDICT**

Every derived conclusion must remain traceable to claims, sources, evidence, uncertainty, and—when relevant—counterevidence.

</div>

## Four analytical layers

| | Layer | Purpose |
|---:|---|---|
| **01** | **MYTH / NARRATIVE** | Describe stories, entities, traditions, rituals, motifs, events, and claims without pre-judging them. |
| **02** | **INTEGRITY** | Detect misinformation, disinformation, fabrication, false attribution, misleading context, propaganda, and related epistemic distortions. |
| **03** | **DEVIATION** | Compare an observed text, teaching, practice, translation, or narrative against an explicit baseline. |
| **04** | **MIZAN** | Optional explainable normative/theological assessment attached to explicit evidence—not to cultures or populations. |

## Corpus snapshot

> Live counts are generated from `apps/web/public/data/corpus-index.json` on `main`.

<div align="center">

![Canonical](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbjo163%2Frocksoul-mftl%2Fmain%2Fapps%2Fweb%2Fpublic%2Fdata%2Fcorpus-index.json&query=%24.counts.canonical_records&label=canonical&color=B43A32)
![Candidates](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbjo163%2Frocksoul-mftl%2Fmain%2Fapps%2Fweb%2Fpublic%2Fdata%2Fcorpus-index.json&query=%24.counts.candidates&label=candidates&color=555555)
![Entities](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbjo163%2Frocksoul-mftl%2Fmain%2Fapps%2Fweb%2Fpublic%2Fdata%2Fcorpus-index.json&query=%24.counts.entities&label=entities&color=555555)
![Claims](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbjo163%2Frocksoul-mftl%2Fmain%2Fapps%2Fweb%2Fpublic%2Fdata%2Fcorpus-index.json&query=%24.counts.claims&label=claims&color=555555)
![Sources](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbjo163%2Frocksoul-mftl%2Fmain%2Fapps%2Fweb%2Fpublic%2Fdata%2Fcorpus-index.json&query=%24.counts.sources&label=sources&color=555555)
![Evidence](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbjo163%2Frocksoul-mftl%2Fmain%2Fapps%2Fweb%2Fpublic%2Fdata%2Fcorpus-index.json&query=%24.counts.evidence&label=evidence_edges&color=555555)

</div>

### First reviewed canonical graph

**Inana's Descent to the Netherworld**  
`MYTH-MES-INANA-DESCENT-000001`

```text
Sumerian composition
        │
        ├── 5 reusable entities
        ├── 5 atomic claims
        ├── 3 source records
        └── 6 evidence edges

Epistemic model:
supported_as_textual_attestation
≠
empirically proven supernatural event
```

The original discovery candidate is preserved as `merged`, so the path from discovery → research → canonicalization stays auditable.

## Research Queue

Research discovered by **MFTL Steward** goes to GitHub Issues first. It does **not** automatically become corpus truth.

```mermaid
flowchart LR
    A["BROWSE"] --> B["RESEARCH ISSUE"]
    B --> C["REVIEW"]
    C --> D["CANDIDATE / CANONICAL / MERGE / REJECT"]
```

**[View open research →](https://github.com/bjo163/rocksoul-mftl/issues?q=is%3Aissue+is%3Aopen+%22%5BRESEARCH%5D%22)** · **[Create research issue →](https://github.com/bjo163/rocksoul-mftl/issues/new?template=research-data.md&title=%5BRESEARCH%5D+)**

A research issue should contain only six things: **topic, region/tradition, summary, sources, uncertainty, and suggested next action**.

## More than a mythology database

MFTL is designed around **18 record families**:

```text
NARRATIVE          ENTITY             CLAIM
PRACTICE           BELIEF / DOCTRINE  TEXT / TRANSMISSION
PROPHECY           PARANORMAL         PLACE / ARTIFACT
EVENT-REPORT       INTEGRITY          DEVIATION
PSEUDOKNOWLEDGE    MOVEMENT           SYMBOL / MOTIF
SOURCE / EVIDENCE  COMPARISON         ASSESSMENT
```

This allows the same graph model to investigate mythology, folklore, ritual, prophecy, textual drift, pseudohistory, hoaxes, manipulated narratives, and supernatural reports without forcing them into the same category.

## Evidence before certainty

MFTL avoids a single rhetorical `truth_score`.

```text
CLAIM
 ├── supporting evidence
 ├── contradicting evidence
 ├── contextual evidence
 ├── alternative explanation
 └── unresolved uncertainty
```

Possible epistemic states include:

`supported_as_textual_attestation` · `supported_as_historical_attestation` · `probable` · `plausible` · `unverified` · `disputed` · `contradicted` · `fabricated` · `indeterminate` · `not_empirically_testable`

## Repository atlas

```text
rocksoul-mftl/
├── data/
│   ├── candidates/     discovery staging + merged provenance
│   ├── records/        canonical myth / narrative records
│   ├── objects/        general canonical MFTL objects
│   ├── entities/       reusable entity registry
│   ├── claims/         atomic claim registry
│   ├── sources/        reusable provenance registry
│   ├── evidence/       support / contradiction / alternatives
│   └── indexes/        corpus coverage metadata
├── schemas/            machine-valid JSON contracts
├── taxonomy/           record families + analytical taxonomies
├── docs/               research policy + architecture
├── apps/web/           React + Vite intelligence explorer
├── scripts/            validation + index generation
└── .github/            CI + issue intake
```

## Research pipeline

```mermaid
flowchart LR
    A["DISCOVER"] --> B["DE-DUPLICATE"]
    B --> C["SOURCE"]
    C --> D["CROSS-CHECK"]
    D --> E["EXTRACT CLAIMS"]
    E --> F["LINK EVIDENCE"]
    F --> G["VALIDATE"]
    G --> H["CANONICALIZE"]
    H --> I["INDEX"]
    I --> J["AUDIT"]
```

This repository intentionally uses **`main` as the only working branch**.

Automated research is **issue-first**: MFTL Steward browses, de-duplicates, and creates or updates a `[RESEARCH]` Issue. It does not directly add or canonicalize corpus research data. Small README/docs hygiene fixes may still be committed to `main` when useful and CI-safe.

## Research guardrails

MFTL prioritizes:

**primary texts → inscriptions / archaeology → peer-reviewed scholarship → university press → museums / libraries / archives → recognized institutional sources**

The project does **not**:

- fabricate or autocomplete citations;
- erase conflicting scholarship;
- promote weak discovery material into high-confidence fact;
- infer deceptive intent simply because a claim is false;
- use `myth` as a synonym for `lie`;
- call something `deviation` without defining the baseline;
- assign theological verdicts to living people, ethnicities, nationalities, or populations.

The theological layer is optional and remains separate from academic classification.

[Read the full research policy →](docs/RESEARCH_POLICY.md)

## Documentation

| Document | What it defines |
|---|---|
| **[Documentation Index](docs/INDEX.md)** | Entry point to all project contracts |
| **[Data Model](docs/DATA_MODEL.md)** | Core object and graph semantics |
| **[Record Families](docs/RECORD_FAMILIES.md)** | 18 extensible intelligence families |
| **[Narrative Integrity](docs/NARRATIVE_INTEGRITY.md)** | Hoax, fake-news, distortion, and deviation model |
| **[Research Policy](docs/RESEARCH_POLICY.md)** | Source quality, uncertainty, provenance, and dignity rules |
| **[Interoperability](docs/INTEROP.md)** | Ownership boundaries across the Rocksoul research family |
| **[Automation](docs/AUTOMATION.md)** | Main-only hourly research contract |
| **[Roadmap](docs/ROADMAP.md)** | Current and future milestones |

<details>
<summary><strong>Local development</strong></summary>

<br/>

```bash
git clone https://github.com/bjo163/rocksoul-mftl.git
cd rocksoul-mftl
npm install
npm run validate
npm run index
npm run dev
npm run build
```

</details>

<details>
<summary><strong>Stable identifier examples</strong></summary>

<br/>

| Object | Example |
|---|---|
| Canonical record | `MYTH-MES-INANA-DESCENT-000001` |
| Entity | `ENTITY-MES-INANA` |
| Claim | `CLAIM-MES-INANA-001` |
| Source | `SOURCE-ETCSL-INANA-DESCENT` |
| Evidence | `EVIDENCE-MES-INANA-001` |
| Integrity assessment | `INTEGRITY-...` |
| Deviation assessment | `DEVIATION-...` |

</details>

## Current horizon

```text
FOUNDATION            ████████████████████  READY
CANONICALIZATION      ███░░░░░░░░░░░░░░░░  ACTIVE
WORLD COVERAGE        ████████████░░░░░░░░  ACTIVE
SOURCE LINEAGE        ██░░░░░░░░░░░░░░░░░  VIA SUPERHERO
VERSION MUTATION      ██░░░░░░░░░░░░░░░░░  NEXT
PUBLIC EXPLORER       ███████░░░░░░░░░░░░░  ACTIVE
```

See **[the roadmap](docs/ROADMAP.md)** for acceptance criteria and upcoming milestones.

---

<div align="center">

<img src="https://raw.githubusercontent.com/bjo163/rocksoul-assets/main/moonwitness/brand/rocksoul-lockup.svg" alt="Rocksoul" width="480" />

## WHERE MYTH FADES TO LEGEND

### **TRACE · VERIFY · COMPARE · WEIGH · REVEAL**

**Not a list of gods. Not a list of verdicts.  
A traceable world evidence graph.**

`MFTL / MoonWitness · Rocksoul Research`

</div>
