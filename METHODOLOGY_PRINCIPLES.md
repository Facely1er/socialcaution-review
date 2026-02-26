# Privacy Exposure Index — Methodology Principles

This document defines the principles that keep the Privacy Exposure Index **correct, credible, and respectable**. Any change to the methodology (weights, factors, wording, or UI) should stay consistent with these principles. Confusion or inconsistency can damage trust.

---

## 1. Single, Consistent Model

- **One scoring approach only:** the 8-factor model. There is no second "breakdown" model (e.g. a different factor set) that could contradict the number users see.
- **Same formula everywhere:** Service Catalog, Individual Service Report, Dashboard, PDFs, Exposure Report. One number, one explanation.
- **One narrative order** for presenting factors (see below). Use this order in the methodology page, disclaimer, and any UI that lists the eight factors.

---

## 2. Transparent and Honest About Limits

- Describe exactly what each factor measures. For example: **"Known, publicly reported breach history"** — not "breach risk."
- State clearly what we **do not** know (e.g. unreported breaches, future events, non-public data).
- Maintain a short **Limitations** section: scores are based on available data; **absence of data does not mean absence of risk**; the index is for education and awareness, not legal or compliance assessment.

---

## 3. Weights Match Stated Priorities

- Factor weights (max points per factor) must align with what we say matters most.
- **Third-Party Data Sharing (Factor 8)** is the top risk: it should carry the highest weight among the eight factors.
- Other factors are ordered below it in a way that reflects the risk chain (exposure pathways and evidence of harm before context and mitigators).
- Documentation and code must use the **same** weights and formulas; no doc/code mismatch.

---

## 4. No False Precision

- Use accurate wording: **"sum of factor points, capped at 100"** — not "normalized" unless the implementation actually normalizes (e.g. scales to 0–100).
- Use **"known"**, **"reported"**, **"in our data"** wherever that is what we mean. For breach history: **"no known breaches"** never means "no breaches have occurred."
- Do not imply certainty we do not have. The index is data-dependent and incomplete by nature.

---

## 5. Documentation and Code in Sync

- **One source of truth:** the implementation (e.g. `privacyExposureIndex.js`) and the methodology documentation (e.g. `PRIVACY_INDEX_EXPOSURE_METHODOLOGY.md` and the Exposure Index Methodology page) must match.
- Every factor: same name, same max points, same short formula in doc and code.
- When weights or order change, update **both** documentation and code in one pass.

---

## 6. Narrative Order for the Eight Factors

Present factors in this order (for user understanding and consistency across all surfaces):

| Order | Factor | Role in narrative |
|-------|--------|--------------------|
| 1 | Data Sensitivity by Category (6) | What's at stake — what kind of data does the service handle? |
| 2 | Typical Privacy Risks (1) | What to expect — what privacy risks are common for this type of service? |
| 3 | Third-Party Data Sharing (8) | Who else gets it — is data shared with advertisers, partners, brokers? **(Top risk)** |
| 4 | User Control & Privacy (7) | What you can do — how much control do you have over your data? |
| 5 | Regulatory Oversight (4) | Who's watching — what regulations apply (GDPR, CCPA, etc.)? |
| 6 | Known Privacy Issues (2) | What's gone wrong — documented concerns and problems. |
| 7 | Known Breach History (3) | Concrete harm — known, publicly reported breaches. |
| 8 | Parent Company & Siblings (5) | Bigger picture — part of a larger group and data ecosystem. |

Use this order in the methodology page, disclaimer, and any breakdown UI. Calculation logic is unchanged; only the **display order** follows this sequence.

---

## 7. Plain-Language Summary (for methodology page / disclaimer)

The Privacy Exposure Index is a 0–100 score based on **eight factors**, using only **publicly available information** in our data. The factors are presented in a clear order: what data is at stake, what risks are typical, whether data is shared with third parties (our top risk), how much control you have, regulatory context, known issues, **known** breach history, and corporate structure. Each factor contributes points up to a set maximum; points are **summed and capped at 100**. We do not have access to non-public or future information; **absence of data does not mean absence of risk**. The index is for education and awareness, not as a legal or compliance assessment.

---

## 8. What to Avoid

- **Two methodologies** for the same score (e.g. 8-factor score but a 6-factor breakdown that doesn't add up to it).
- **Vague or inaccurate terms** (e.g. "normalized" when we sum and cap; "breach risk" when we mean "known breach history").
- **Implied certainty** (e.g. "no breaches" instead of "no known breaches").
- **Doc/code mismatch** (different weights, formulas, or factor names in documentation vs implementation).
- **Overweighting known breach history** in a way that suggests we know about all breaches — we only know about reported/known ones; unknown breaches can exist.

---

## 9. Breach History (Factor 3) — Specific Guidance

- **Label:** Use **"Known breach history"** or **"Known, publicly reported breach history"** in UI and docs.
- **Meaning of zero:** "No known breaches in our data" — never imply "no breaches have occurred."
- **Limitation:** Services with no known breach history may have had unreported incidents; the score can understate risk when breaches are unknown.
- **Weight:** Keep the factor's impact bounded (e.g. cap its max points) so that "unknown" vs "known" does not dominate the score; document this limitation in the methodology and disclaimer.

---

*Last updated: February 2026. When updating the methodology (weights, order, or wording), update this document and the main methodology documentation together.*
