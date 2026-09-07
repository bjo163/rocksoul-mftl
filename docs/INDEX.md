# MFTL Documentation

**FROM MYTH FADES TO LEGEND**

This is the navigation hub for the repository contract.

## Start here

| Document | Purpose |
|---|---|
| [DATA_MODEL.md](DATA_MODEL.md) | Canonical record structure and layer separation |
| [RESEARCH_POLICY.md](RESEARCH_POLICY.md) | Source quality, provenance, uncertainty, and assessment rules |
| [AUTOMATION.md](AUTOMATION.md) | Hourly researcher contract and main-only safety rules |
| [CONTRIBUTING_DATA.md](CONTRIBUTING_DATA.md) | How to add or improve records |
| [ROADMAP.md](ROADMAP.md) | Product and corpus evolution |

## Machine contracts

- `../schemas/myth-record.schema.json`
- `../schemas/discovery-candidate.schema.json`
- `../taxonomy/record-types.json`
- `../taxonomy/shirk-dimensions.json`

## Data zones

```text
data/candidates/   staging / incomplete discoveries
data/records/      canonical corpus
data/indexes/      generated coverage and search metadata
```

## Golden rule

> Description and assessment are different layers.

A source may document a belief or practice without MFTL making a theological assessment. When an assessment exists, it must be explainable through explicit claims, practices, source evidence, and cited normative rules.
