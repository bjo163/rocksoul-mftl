# MFTL Steward Automation

MFTL uses one simple research-maintenance loop on `main`.

```text
REVIEW MAIN + OPEN RESEARCH ISSUES
              ↓
      DEDUPLICATE TOPICS
              ↓
 BROWSE AUTHORITATIVE SOURCES
              ↓
 CREATE / UPDATE [RESEARCH] ISSUE
              ↓
   OPTIONAL SMALL HYGIENE FIX
              ↓
 VALIDATE + TEST + BUILD ON MAIN
```

## Contract

The Steward:

- reviews the current repository and open research issues before selecting a lead;
- browses authoritative primary, academic, museum, library, archive, or institutional sources;
- creates or updates a research Issue with region/tradition, source links, uncertainty or conflicting scholarship, and a suggested next action;
- does **not** directly add, stage, or canonicalize corpus research data from the browsing step;
- may make small, low-risk README/docs/navigation/workflow presentation fixes when clearly useful;
- does not expand schemas or taxonomies unless required to fix a real consistency problem;
- runs the repository validation/build path when relevant and inspects CI after commits;
- makes no repository change when neither research nor hygiene warrants one.

Research discovery and canonical corpus promotion remain separate review steps. Popularity, repetition, or a museum label alone is not proof of a supernatural claim.
