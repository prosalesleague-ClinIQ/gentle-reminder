# SPECIFIC AIMS — NIH R21

*1-page limit. Academic PI leads; Gentle Reminder (Christo Mack, CEO/COO) as co-investigator/subawardee.*

---

The clinical presentation of neurodegenerative dementias overlaps substantially, with Alzheimer's disease (AD), Lewy body dementia (LBD), frontotemporal dementia (FTD), and vascular dementia often indistinguishable on standard cognitive tests in their early stages. This diagnostic ambiguity delays appropriate treatment, misallocates anti-amyloid therapy, and limits enrollment in etiology-specific clinical trials. **A non-invasive method to differentiate dementia subtypes from behavioral and interaction signals alone would transform early diagnosis, trial enrollment, and treatment stratification.**

Recent advances in digital biomarker research suggest that different neurodegenerative pathologies produce distinguishable behavioral signatures:
- AD typically shows early disruption in episodic memory and orientation
- LBD shows early fluctuations in attention, visuospatial errors, and paradoxical slowing
- FTD (behavioral variant) shows early disruption in inhibitory control and social cognition
- Vascular dementia shows step-wise decline with preserved early episodic memory

However, no platform has systematically tested whether multimodal digital signals (speech patterns, response time distributions, sleep irregularities, routine disruptions) carry subtype-specific information sufficient for classification.

**We propose to exploit our existing production platform (Gentle Reminder, 23 patent-pending innovations) to test this hypothesis.** Our platform captures:
- Cognitive performance across 7 domains (GR-01 feedback system)
- Speech hesitation, pause, and rate metrics (GR-09 biomarker)
- Response time distributions with variance + trend (GR-10 biomarker)
- Sleep irregularity signals (GR-23 biomarker)
- Routine disruption patterns (GR-23 biomarker)
- Multimodal cognitive state inference (GR-04 classifier)

**Central Hypothesis:** Multimodal digital signal patterns from Gentle Reminder platform sessions carry subtype-specific pathophysiological information sufficient to classify dementia etiology (AD vs. LBD vs. FTD vs. vascular) with accuracy > 75% across a multi-etiology cohort of confirmed-diagnosis patients.

**Specific Aim 1: Establish feasibility of multimodal signal subtype classification.** In a 100-patient cohort with confirmed dementia etiology (N=40 AD, N=20 LBD, N=20 FTD-bv, N=20 vascular; diagnosed via standard clinical + imaging criteria), collect paired Gentle Reminder session data (12 weekly sessions per participant). *Hypothesis:* Machine learning classifier (trained on signal features) achieves > 75% classification accuracy for dementia subtype in held-out test set. *Primary endpoint:* Classification AUC (target ≥ 0.80). *Secondary:* Per-subtype sensitivity + specificity.

**Specific Aim 2: Identify subtype-discriminating signal features.** Using explainable ML techniques (SHAP values, feature importance), identify the top 10 digital signal features that drive subtype classification. *Hypothesis:* Signal features correlate with established neuropathological patterns (e.g., attention fluctuation features will load onto LBD classification; inhibitory control features onto FTD-bv). *Primary endpoint:* Feature-pathology concordance rate. *Secondary:* Generate hypotheses for future mechanistic research.

**Specific Aim 3: Validate on independent cohort.** Apply trained classifier to a second independent cohort of 50 newly-diagnosed dementia patients (before clinical confirmation). *Hypothesis:* Classifier maintains > 70% accuracy on independent cohort with no retraining. *Primary endpoint:* Transfer accuracy. *Secondary:* Confusion matrix analysis revealing systematic misclassification patterns.

**Innovation:** This represents the first systematic attempt to perform dementia subtype classification from platform-based multimodal digital signals alone. Success would enable pre-imaging triage in clinical settings and early-stage clinical trial enrollment stratification.

**Significance:** Subtype-aware digital assessment could fundamentally change clinical practice by providing accessible pre-screening for specialist referral, trial enrollment, and treatment selection. For anti-amyloid therapy specifically (Leqembi, Kisunla), accurate AD confirmation is essential — our platform could serve as cost-effective pre-selection before expensive PET imaging.

**Outcomes:** Publication of classification performance results, open-source release of validated classifier for research community, and preliminary data to support a subsequent R01 for mechanistic investigation of subtype-specific signal patterns.

---

*Academic PI: [Name], [Title], [Institution] — leads IRB, recruitment, diagnostic confirmation*
*Industry Co-Investigator: Christo Mack, Founder & CEO/COO, Gentle Reminder — leads platform, data analysis, ML methodology*
*mack@matrixadvancedsolutions.com*
