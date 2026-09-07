# Narrative Integrity & Deviation Layers

MFTL separates four questions that are often incorrectly collapsed into one:

```text
WHAT KIND OF NARRATIVE IS THIS?
        ↓
IS THE CLAIM SUPPORTED?
        ↓
WAS IT DISTORTED / FABRICATED / MISLEADING?
        ↓
DID IT DRIFT FROM AN EXPLICIT BASELINE?
        ↓
OPTIONAL THEOLOGICAL ASSESSMENT
```

## 1. Myth is not the same as falsehood

`myth` is a cultural/narrative classification. It is not a synonym for `lie`.

## 2. Hoax / fake news

MFTL avoids a single vague `fake_news` label.

Use the more precise Narrative Integrity codes:

- `E02 misinformation` — false/misleading information; deceptive intent not established.
- `E03 disinformation` — false/misleading information with evidence of deliberate deception.
- `E04 malinformation` — authentic material used or framed deceptively/harmfully.
- `E05 fabricated_claim`
- `E06 fabricated_source`
- `E07 forged_document`
- `E08 false_attribution`
- `E09 misleading_context`
- `E10 selective_evidence`
- `E18 propaganda`

Important: **false does not automatically mean hoax**. A person can simply be mistaken. Intent must not be invented.

## 3. Fake narrative

Narrative-level distortion can exist even when several individual statements are true.

Example pattern:

```text
TRUE FACT A
+ TRUE FACT B
+ OMITTED FACT C
+ UNSUPPORTED CAUSAL LINK
────────────────────────
MISLEADING NARRATIVE
```

Useful codes: `E09`, `E10`, `E17`, `E18`, `E24`.

## 4. Penyimpangan / deviation

Deviation is **relational**:

```text
BASELINE
   ↓ compare
OBSERVED VERSION
   ↓
DEVIATION / DRIFT
```

You cannot responsibly label something `deviation` without storing the baseline.

Examples:

| Case | Baseline | Possible code |
|---|---|---|
| meaning changes over transmission | earlier/source wording | `D01 semantic_shift` |
| text gains material not in baseline | source text | `D02 addition_or_interpolation` |
| relevant material disappears | source text | `D03 omission` |
| quotation detached from setting | source context | `D06 context_detachment` |
| translation changes meaning | source-language text | `D07 translation_drift` |
| teaching differs from stated doctrine | explicit doctrine | `D10 doctrinal_drift` |
| ritual differs from documented practice | documented practice | `D11 ritual_drift` |
| conclusion exceeds evidence | research standard | `D18 claim_inflation` |

`D10`, `D11`, `D12`, `D13`, and `D19` are **framework-relative**. The framework must be recorded.

## 5. These layers can coexist

One item can be:

```text
CULTURAL TYPE: legend
INTEGRITY: E23 legend_presented_as_fact
DEVIATION: D06 context_detachment
THEOLOGICAL: not_assessed
```

Or:

```text
CULTURAL TYPE: religious_claim
INTEGRITY: supported
DEVIATION: D10 doctrinal_drift
BASELINE: explicitly cited source/doctrine
THEOLOGICAL: separately assessed
```

The layers must never be collapsed into a single moral label.
