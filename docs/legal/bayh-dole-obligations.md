# Bayh-Dole Act — Federal Funding Obligations

**Document ID:** BD-001
**Version:** 1.0
**Effective Date:** 2026-04-20
**Audience:** Founders, grant specialists, patent counsel, academic collaborators
**Status:** Operational reference (not legal advice).

---

## TL;DR

When you take federal funding (SBIR, R21, R01, NSF, etc.), any invention conceived or first reduced to practice using that funding is a **"subject invention"** under the **Bayh-Dole Act (35 U.S.C. §§ 200–212)** and implementing regulations (**37 CFR Part 401**). You keep ownership — but only if you follow the disclosure, election, and reporting rules on strict timelines. Miss a deadline and the government can take title.

---

## 1. What counts as a "subject invention"

- **Conceived OR first actually reduced to practice** during the performance of federal funding
- Includes software, methods, algorithms, designs, machines, compositions — anything patentable
- Applies to both **small business concerns (SBIR awardees like Gentle Reminder)** and **nonprofit organizations (academic collaborators)**
- Applies to subawards — flows down from prime to subawardee

**Does NOT include:**
- Inventions conceived and reduced to practice **entirely before** the federal funding started
- Inventions conceived entirely with **private / non-federal funds** in a separate project

**Gray area:** inventions that build on pre-funded work but are materially advanced during the federal performance period. When in doubt, disclose.

## 2. The required timeline (BLOCKING)

| Action | Deadline | Regulation |
|--------|----------|------------|
| **Disclose** the subject invention to the funding agency | Within **2 months** of becoming known to company / PI personnel with responsibility for patent matters | 37 CFR 401.14(c)(1) |
| **Elect title** (decide: keep the invention or let the government take it) | Within **2 years** of disclosure | 37 CFR 401.14(c)(2) |
| **File initial patent application** (provisional or non-provisional) | Within **1 year** of election OR before public disclosure bar (35 U.S.C. §102), whichever is earlier | 37 CFR 401.14(c)(3) |
| **File non-provisional / PCT** (if provisional was initial) | Within **10 months** after provisional filing | 37 CFR 401.14(c)(3) |
| **Include federal funding statement in patent specification** | At filing | 35 U.S.C. §202(c)(6) |
| **Notify the agency of any issued patent** | On issuance | 37 CFR 401.14(f) |
| **Annual utilization report** | Annually through licensing / commercialization phase | 37 CFR 401.14(h) |

**Missing a deadline means the federal agency may take title.** This is one of the most common founder mistakes.

## 3. How to report (mechanics)

### iEdison
The NIH / DOE / DOD / NSF / NASA / USDA / EPA (and other agencies using the iEdison system) require disclosure, election, and patent filing reports via **iEdison** (https://public.era.nih.gov/iedison/). Set up an iEdison account at the start of any federal award.

### Disclosure requires:
- Invention title
- Inventors (all, by name and institution)
- Date of conception and date of first actual reduction to practice
- Funding agreement(s) supporting the invention
- Brief technical description
- Whether a publication or public disclosure has occurred (triggers 1-year bar)

### Election and filing:
- Update the disclosure record with the election decision
- Upload the filed patent application upon filing
- Update with issuance date when patent issues

## 4. Federal funding statement (required language in every patent spec)

Every patent application for a subject invention must include:

> "This invention was made with Government support under [Award Number, e.g., R43AG123456] awarded by [Agency Name, e.g., the National Institutes of Health]. The Government has certain rights in the invention."

If multiple federal awards contributed, list all.

## 5. What rights the government keeps

Even if you retain title, the government gets:

- **A nonexclusive, nontransferable, irrevocable, paid-up license** to practice the invention for government purposes worldwide (35 U.S.C. §202(c)(4))
- **March-in rights** (35 U.S.C. §203) — the government can compel licensing to third parties if:
  - You haven't taken effective action to commercialize within a reasonable time, OR
  - Health or safety needs are not being reasonably satisfied, OR
  - Public use requirements specified by federal regulations are not being satisfied, OR
  - The licensing commitments of §204 (US manufacturing) are not being honored
- **US manufacturing preference** (35 U.S.C. §204) — products embodying the invention, or produced through use of the invention, must be "substantially manufactured" in the US unless a waiver is granted

March-in has been invoked **zero times in the history of the Act** (as of this writing), but the option exists.

## 6. Commercial licensing restrictions

### Exclusive license caps (nonprofit awardees)
Nonprofit awardees (e.g., our academic collaborators) are limited to **5 years of exclusive licensing** from first commercial sale / use, or **8 years from the license effective date**, whichever is shorter. 35 U.S.C. §202(c)(7)(B).

*Does not apply to Gentle Reminder directly as a small-business awardee — only flows down to academic collaborators on their share of joint IP.*

### Income from licensing
Nonprofit awardees must share royalty income with inventors, use remaining income for education and research, and comply with US manufacturing preference. 35 U.S.C. §202(c)(7)(B)–(D).

## 7. When to waive US manufacturing preference

35 U.S.C. §204 requires "substantial manufacturing" in the US. If you need to manufacture abroad, request a waiver from the funding agency:
- Demonstrate that domestic manufacturing is not reasonably feasible, OR
- That domestic parties could not effectively be brought in to replicate

Waivers are typically granted for specialized manufacturing not available domestically. Plan for a 60–120 day review.

## 8. Gentle Reminder's operating practice

- **Maintain iEdison account** from first federal award (SBIR Phase I, R21, etc.)
- **Invention disclosure intake:** every new software feature, algorithm, biomarker, or novel method gets logged in the invention docket within 2 months of conception, whether federally funded or not; federal funding status flagged for the Bayh-Dole-relevant subset
- **Calendar:** automated reminder at 18 months post-disclosure to confirm election decision before the 2-year deadline
- **Patent counsel review:** all patent drafts reviewed for federal funding statement inclusion before filing
- **Annual utilization report:** filed on anniversary of award for each issued patent
- **Training:** all engineers and researchers briefed on the 2-month disclosure trigger during onboarding; annual refresh
- **Subaward flow-down:** `docs/legal/subaward-agreement-template.md` §4.3 flows Bayh-Dole obligations to academic subawardees

## 9. Academic collaborator considerations

When partnering with an academic institution:

- The institution has a Technology Transfer Office (TTO) that handles Bayh-Dole for the institution's share of IP
- TTO decides election on behalf of the institution, on behalf of the academic inventors
- Coordinate filings with TTO to avoid duplicate disclosures and missed deadlines
- Joint inventions require joint disclosure; coordination is via the subaward agreement

## 10. Common mistakes to avoid

1. **Disclosing to the world before disclosing to the agency.** Public disclosure before election can constitute a bar; always iEdison-first.
2. **Missing the 2-year election window.** Set calendar reminders immediately on disclosure.
3. **Omitting the funding statement from the patent spec.** Results in unenforceability or reversion; every draft must be checked.
4. **Treating software as "not an invention."** Software can absolutely be a subject invention. Disclose.
5. **Forgetting to flow Bayh-Dole to subcontractors.** The prime is responsible for the entire project's compliance.
6. **Licensing IP without tracking utilization.** Annual utilization reports apply even post-license.

## 11. Penalties for noncompliance

- **Loss of title:** government can take title to the subject invention (37 CFR 401.14(d))
- **Loss of exclusive licensing rights** within the affected award
- **Clawback of license income** in extreme cases
- **Debarment** from future federal funding (rare, but possible for pattern of noncompliance)
- **Reputational damage:** federal audits are public record

## 12. Resources

- Bayh-Dole Act: 35 U.S.C. §§ 200–212 (statute)
- Implementing regulations: 37 CFR Part 401
- iEdison: https://public.era.nih.gov/iedison/
- NIH Bayh-Dole FAQs: https://www.nih.gov/research-training/bayh-dole-act
- Association of University Technology Managers (AUTM): https://autm.net
- *Patents, Citations, and Innovations: A Window on the Knowledge Economy* (Jaffe & Trajtenberg) for economic background

## 13. Related documents

| Document | Location |
|----------|----------|
| Subaward Agreement Template | `docs/legal/subaward-agreement-template.md` |
| Data Use Agreement Template | `docs/legal/data-use-agreement-template.md` |
| Pre-Entity Outreach Safety | `docs/legal/pre-entity-outreach-safety.md` |
| Trademark Filing Checklist | `docs/legal/trademark-filing-checklist.md` |
| SBIR Application drafts | `docs/grants/` |

---

*This document is operational guidance, not legal advice. Bayh-Dole compliance is a funded-award-by-funded-award commitment; when in doubt, consult patent counsel or the agency Program Officer.*
