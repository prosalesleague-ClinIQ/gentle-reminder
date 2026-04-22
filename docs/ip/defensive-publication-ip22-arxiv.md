# Defensive Publication — IP #22 (Pure-TS Statistical Engine)

**Purpose:** Block competitors from patenting the same zero-dependency TypeScript statistical methods (t-test, Wilcoxon rank-sum, Cohen's d, paired-difference effects) by establishing public prior art at zero out-of-pocket cost.

**Source:** fortress IP-Moat Evaluation 2026-04-22, §11 Day-60-90 plan item #3. Closes Weakness #7 in the portfolio (tier-3 patents with LOW novelty that would waste $300 USPTO + $500-$1,500 attorney per filing).

**Target venue:** arXiv cs.MS (Mathematical Software) or cs.SE (Software Engineering). Submission is free and instantly creates a citable, dated public record. Alternative: Zenodo (DOI-stamped) or a tagged GitHub release with a DOI from Zenodo's GitHub integration.

---

## Draft abstract

**Title:** A zero-dependency TypeScript reference implementation of parametric and non-parametric effect-size tests for clinical dashboards

**Abstract (150 words):**
We publish a reference TypeScript implementation of commonly used frequentist statistical tests — Welch's two-sample t-test, Wilcoxon rank-sum (Mann-Whitney U), paired Wilcoxon signed-rank, Cohen's d with Hedges' g correction, and 95% bootstrap confidence intervals — with no external runtime dependencies. The library is designed for browser and Node.js consumption inside clinical dashboards where bundle size and supply-chain exposure matter. We present the algorithmic choices (series expansions for the incomplete beta function, exact vs approximate p-value thresholds, tie handling in Wilcoxon), accuracy comparisons against R and SciPy reference values, and performance benchmarks on n=10³ to 10⁶ sample sizes. The implementation is released under the Apache 2.0 license. We document both the method choices and the internal numerical thresholds to establish prior art for the specific algorithmic combinations disclosed herein.

---

## What to include in the submission

1. **Full source code** of `packages/report-generator/src/stats/` (or wherever the pure-TS stat engine lives) — attached as a supplementary zip.
2. **A methods section** covering:
   - Welch's t-test derivation and df approximation formula
   - Incomplete beta function implementation (series + continued fraction switchover)
   - Wilcoxon rank-sum exact vs normal-approximation switchover (typical: n₁+n₂ ≤ 20 → exact, else normal with continuity correction)
   - Hedges' g bias correction formula
   - Bootstrap CI resampling strategy
3. **A reference-value table** comparing outputs against R's `t.test()`, `wilcox.test()`, and SciPy's `scipy.stats.ttest_ind()` / `mannwhitneyu()` at several fixed seeds.
4. **License declaration:** Apache 2.0 with patent-retention grant. This is important — the patent-retention clause in Apache 2.0 is what makes this a *defensive* publication: anyone who uses the library in a patent-infringement suit against the authors loses their license.

## What to explicitly *not* include

- Any reference to dementia-specific thresholds (70-85% comfort zone, 2-fail/4-success, 0.4/0.3/0.3 hesitation fusion). Those remain trade-secret and are not part of IP #22.
- Any reference to the filed tier-1 patents (once they're filed). Keep the narrative strictly statistical-methods.
- Patient data, PHI, or any clinical-study results (those have their own publication path).

## Timeline + cost

| Step | Owner | When | Cost |
|---|---|---|---|
| Draft 8-page arXiv paper + supplementary code zip | user + one tier-1 attorney review (optional, $500) | Day 60 | $0-$500 |
| arXiv endorsement (if needed for cs.MS) | Ask any arXiv-active researcher or use cross-listed venue | Day 60 | $0 |
| Submit to arXiv | user | Day 65 | $0 |
| Zenodo DOI on tagged code release | user | same day | $0 |
| Update `docs/ip/PRIOR-ART-SEARCH.md` with self-citation | Claude | Day 66 | $0 |

**Total out-of-pocket: $0-$500 (optional attorney review).**
**Alternative: $300 USPTO provisional fee + $500-$1,500 attorney = $800-$1,800 for a patent with LOW novelty and high invalidity risk.**

## Verification

After publication:
1. arXiv assigns a paper ID (e.g. `arXiv:2604.XXXXX`).
2. Zenodo assigns a DOI.
3. Update the IP-Moat scorecard defensive-measures axis: +1 point for executed defensive publication.
4. Update `docs/ip/PRIOR-ART-SEARCH.md` IP #22 entry: change recommendation from "DROP" to "DEFENSIVE-PUBLISHED" with arXiv link.
5. Any competitor attempting to patent the same algorithms now faces public prior art dated 2026-Qx, destroying their novelty argument.

## Decision path if you want to revisit later

If the library evolves to add *genuinely* novel numerical techniques (e.g., a new effect-size metric specific to cognitive-decline measurement), THAT combination can still be filed as a separate narrower patent. The arXiv defensive publication only blocks the specific methods disclosed there; it doesn't prevent future additions.

## Related

- `docs/ip/ip-moat-eval-2026-04-22.md` §4 patent-by-patent table — IP #22 verdict
- `docs/ip/tier-3/22-pure-ts-statistical-engine.md` — original invention draft (retain as internal engineering record; not published)
- `docs/ip-protection/GPG-SIGNING-RUNBOOK.md` — sign the arXiv preprint's companion commit
