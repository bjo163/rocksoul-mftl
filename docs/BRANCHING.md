# Branching Contract

This repository uses **`main` as the single canonical remote working branch**.

```text
main  ← research + maintenance + stable repository state
```

## Rules

- All implementation, research metadata, docs, CI, and maintenance work lands directly in `main`.
- Research discovered by automation remains **issue-first** and must not be canonicalized directly from browsing.
- Do not create or rely on persistent `dev`, `feature/*`, `fix/*`, `hotfix/*`, `release/*`, `chore/*`, `experiment/*`, `agent/*`, or `phase*` branches.
- Temporary local branches are allowed for private experimentation, but `main` is the only canonical remote branch.
- Validate/build before or immediately after a maintenance commit when relevant, and inspect CI.
- Release automation may create tags/releases, never additional canonical branches.

If an older document, badge, or inherited workflow describes a `dev → main` model, that wording is stale; this main-only contract wins.
