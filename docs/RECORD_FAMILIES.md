# MFTL Record Families

MFTL should not be limited to a database of myths.

The scalable model is:

```text
OBJECT
  ↓
CLAIMS
  ↓
SOURCES
  ↓
EVIDENCE
  ↓
RELATIONS
  ↓
ASSESSMENTS
```

A record family describes what kind of object is being investigated. Separate assessment layers describe whether a claim is supported, distorted, deviated from a baseline, historically attested, or relevant to a theological framework.

## The 18 families

| Code | Family | Examples |
|---|---|---|
| F01 | Narrative | myth, legend, folklore, urban legend |
| F02 | Entity | deity, spirit, hero, ancestor, creature |
| F03 | Claim | historical, supernatural, identity, causal, miracle |
| F04 | Practice | ritual, prayer, sacrifice, divination, taboo |
| F05 | Belief / Doctrine | cosmology, afterlife, divine hierarchy |
| F06 | Text / Transmission | manuscript, translation, textual variant, interpolation |
| F07 | Prophecy / Prediction | prophecy, omen, astrology, numerology |
| F08 | Paranormal / Supernatural | apparition, possession, haunting, miracle report |
| F09 | Place / Object / Artifact | relic, idol, shrine, tomb, archaeological site |
| F10 | Event | battle, disaster, disappearance, celestial event |
| F11 | Information Integrity | hoax, disinformation, forged document, deepfake |
| F12 | Deviation / Drift | doctrinal drift, translation drift, ritual drift |
| F13 | Pseudoknowledge | pseudohistory, pseudoarchaeology, pseudoscience |
| F14 | Movement / Authority | tradition, sect, school, institution, network |
| F15 | Symbol / Motif | sacred number, solar motif, flood motif |
| F16 | Source / Evidence | text, inscription, archaeology, media, counterevidence |
| F17 | Comparison | parallel, contradiction, shared motif, dependency |
| F18 | Assessment | historicity, integrity, deviation, Mizan |

## Particularly valuable additions

### Prophecy and prediction

Store exact wording, earliest verifiable source, attestation date, prediction window, target event, specificity, later edits, match criteria, and misses as well as hits. This prevents hindsight rewriting.

### Miracle / paranormal reports

Store the report without automatically endorsing or rejecting the supernatural interpretation:

```text
OBSERVATION / REPORT
        ↓
SOURCE
        ↓
ALTERNATIVE EXPLANATIONS
        ↓
EVIDENCE QUALITY
        ↓
STATUS
```

### Textual changes

Text transmission lets MFTL answer: "Where did this version come from?" Store variant, baseline, date, language, source chain, and deviation type.

### Pseudohistory / pseudoarchaeology

These deserve their own family because modern myths can grow from real artifacts combined with incorrect dating, unsupported identity claims, invented etymology, selective archaeology, or fabricated chronology.

### Counterevidence

MFTL should save evidence against its own hypothesis, not only supporting material:

```text
CLAIM
 ├── SUPPORTING EVIDENCE
 ├── CONTRADICTING EVIDENCE
 ├── ALTERNATIVE EXPLANATION
 └── UNRESOLVED QUESTIONS
```

This makes the graph auditable rather than rhetorical.

## Architectural direction

Long-term, `myth-record.schema.json` should become one specialized schema under a general MFTL object model:

```text
mftl-record
├── narrative-record
├── entity-record
├── claim-record
├── practice-record
├── event-record
├── source-record
├── integrity-case
├── deviation-case
└── assessment-record
```

Existing myth records should remain valid while the corpus expands.