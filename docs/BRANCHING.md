# Branching Contract

MFTL uses a two-stage release flow:

```text
dev   ← integration + autonomous research staging
  ↓ validated fast-forward / reviewed PR
main  ← stable + production + release source
  ↓
release/vX.Y.Z ← release snapshot
```

## Rules

- New implementation and automatic Steward staging land on `dev`.
- CI runs on both `dev` and `main`, plus pull requests targeting `main`.
- `main` only receives state after `npm run ci` passes.
- Autonomous research never force-pushes `main`; if main diverges, automatic promotion fails safely.
- Release snapshots branch from the verified `main` commit.
- Discovery popularity is never sufficient for canonical corpus promotion.
