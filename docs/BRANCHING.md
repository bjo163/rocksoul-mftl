# Branching Contract

MFTL uses **`main` as its single working branch**.

```text
research issue / small maintenance fix
              ↓
            main
              ↓
      validate / test / build
```

## Rules

- All repository work lands on `main`; do not use `dev`, release working branches, or automated promotion branches.
- CI runs on pushes to `main` and pull requests targeting `main`.
- Research browsing creates or updates GitHub research Issues first; it does not directly write or canonicalize corpus records.
- Small repository hygiene fixes may be committed only when low risk and when `npm run ci` remains healthy.
- Discovery popularity is never sufficient for canonical corpus promotion.
- Historical release tags may exist, but branch-based release snapshots are not part of the working model.
