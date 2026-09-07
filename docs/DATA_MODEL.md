# MFTL Data Model

## Principle

MFTL stores **what a source says** before storing **what an assessor concludes**.

The canonical chain is:

```text
RECORD
  ├─ entities
  ├─ claims
  ├─ practices
  ├─ relations
  ├─ sources
  ├─ evidence
  ├─ academic assessment
  └─ optional theological assessment
```

## Separation rules

1. `myth exists` ≠ `person believes myth`.
2. `belief` ≠ `ritual practice`.
3. `ritual` ≠ `worship` unless the evidence supports that relation.
4. Historical attestation is separate from supernatural truth claims.
5. Theological assessment attaches to explicit **claims/practices**, not to ethnicity or nationality.
6. Every non-trivial claim should point to one or more `source_basis` IDs.
7. A theological dimension should point to the exact `evidence_claim_ids` that triggered it.

## Rocksoul Research ownership

```text
MFTL       → story / narrative
LEGEND     → canonical event / historical core
SUPERHERO  → person / actor / transmission
```

MFTL can contain an event **as narrated, claimed, reported, predicted, remembered, or interpreted**. That does not make MFTL the owner of the canonical historical event object. When a defensible historical event is modeled in LEGEND, MFTL should reference that event rather than create a competing canonical event registry.

Likewise, named human actors may appear in MFTL sources or narratives, but canonical person/transmission records belong to SUPERHERO.

## Graph compatibility

Triples are represented as:

```json
{
  "subject": "ENTITY-X",
  "predicate": "associated_with",
  "object": "ENTITY-Y"
}
```

This keeps the JSON corpus portable while allowing later export to RDF, Neo4j, PostgreSQL edges, or another graph store.

## Record status

- `discovered` — candidate found, not yet source-complete
- `sourced` — source evidence attached
- `reviewed` — factual/provenance review passed
- `assessed` — optional theological assessment completed
- `published` — safe for public site/index

## Confidence

Scores are 0–1 and must represent evidence confidence, not rhetorical certainty.
