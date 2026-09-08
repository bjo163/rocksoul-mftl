# Rocksoul Research Loop

MFTL is the STORY-domain owner inside a federated research graph. The operating loop is:

```text
DISCOVER
  ↓
RESEARCH ISSUE
  ↓
CANDIDATE
  ↓
ATOMIC CLAIMS
  ↓
SOURCES + EVIDENCE
  ↓
COUNTEREVIDENCE + ALTERNATIVES
  ↓
OWNER-REPO RESOLUTION
  ↓
REVIEW
  ↓
CANONICAL STORY
  ↓
CORRELATION PUBLICATION
  ↓
FRESHNESS / RE-ANALYSIS
```

## Non-negotiable boundaries

- Browsing/research automation creates or updates research issues; it does not silently mint corpus truth.
- MFTL owns STORY records and local evidence for narrative analysis.
- EVENT, PERSON, exact TEXT and LAW remain owned by LEGEND, SUPERHERO, RGBL and AWS.
- `rocksoul-correlation` owns reviewed cross-domain edges.
- CRAYON owns private/operator workflow state and draft hypotheses.
- A stale upstream reference means **review required**, not automatically false.
- Every challenged conclusion must expose support, counterevidence, alternatives and conditions that could change it.

## Public API

The generated public API is available under `/api/v1` and mirrors a dependency-free local runtime.

Core resources:

```text
GET /api/v1/records
GET /api/v1/records/:id
GET /api/v1/claims
GET /api/v1/claims/:id
GET /api/v1/claims/:id/challenge
GET /api/v1/sources
GET /api/v1/evidence
GET /api/v1/search
GET /api/v1/drift/:id
GET /api/v1/benchmark
```

The public surface is read-only. Canonical research changes remain repository-reviewed operations.
