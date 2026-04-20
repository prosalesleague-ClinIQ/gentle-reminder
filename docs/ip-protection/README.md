# "Poor Man's" IP Protection Pack

**What this is:** Low-cost, do-it-yourself IP protection measures you can execute TODAY while waiting on Phase 0 corporate formation and Phase 1 formal patent attorney engagement.

**What this is NOT:** A replacement for proper USPTO provisional patent filings or attorney-prepared non-provisionals. These are layered defensive measures that complement (not substitute) the formal patent strategy.

**Reality check on "poor man's patent":** The old practice of mailing yourself a sealed envelope with your invention is **worthless** legally (per USPTO). It does not establish priority date for patent purposes. Under current US law (AIA, since March 2013), the only way to secure a priority date is to **actually file with the USPTO**. What we build below is a set of *supporting* protections — evidence of prior creation, copyright/trademark registration, and public-disclosure defensive publications.

---

## Protection Stack (In Order of Speed × Cost)

### 1. Cryptographic Timestamping (FREE, minutes) ✅ Do TODAY
Use OpenTimestamps to create a blockchain-anchored cryptographic proof that a specific document/file existed at a specific time. This is *not* a patent, but it is legally admissible evidence of prior creation for defensive purposes (e.g., to counter a later patent troll claim).

**How:** See [01-cryptographic-timestamping.md](01-cryptographic-timestamping.md) and run `scripts/ip-protection/timestamp-ip-portfolio.sh`.

### 2. Signed Git Commits (FREE, 30 min) ✅ Do TODAY
Every commit to the repo should be GPG-signed. Signed commits are tamper-evident proof that a specific person committed specific content at a specific time.

**How:** See [02-signed-git-commits.md](02-signed-git-commits.md).

### 3. US Copyright Registration for Software ($65 per work, days) ✅ Do this week
Copyright is automatic upon creation, but **registration** provides statutory damages, attorney's fees recovery, and prima facie evidence of validity. $65 per work filed with US Copyright Office.

**How:** See [03-copyright-registration.md](03-copyright-registration.md).

### 4. USPTO Trademark Registration ($250-$350 per class, weeks) ✅ Do this month
Register "Gentle Reminder" and core product names. Blocks competitors from using similar marks.

**How:** See [04-trademark-registration.md](04-trademark-registration.md).

### 5. Defensive Publication (FREE but IRREVERSIBLE, minutes) ⚠️ Use carefully
Publishing an invention publicly creates "prior art" that prevents others from patenting it. **However**, it also destroys your own ability to patent it internationally (and starts a 12-month US clock). Use only for innovations you are definitely NOT patenting.

**How:** See [05-defensive-publication.md](05-defensive-publication.md).

### 6. USPTO Provisional Patent Filing ($300/filing, hours) 🎯 PRIMARY PROTECTION
**This is the real thing.** Provisional patents establish a priority date that you can claim for 12 months. If you only do one thing from this list, do this.

**How:** See [06-provisional-patent-filing.md](06-provisional-patent-filing.md) and the 23 ready-to-file drafts in `../ip/`.

---

## Execution Order (What to Do When)

### TODAY (0-4 hours)
1. Run `scripts/ip-protection/timestamp-ip-portfolio.sh` to cryptographically timestamp all 23 IP drafts
2. Configure GPG signing for git commits (one-time setup)
3. Re-commit with signatures, or sign the existing commits going forward

### THIS WEEK
4. Create USPTO.gov account (free)
5. Register copyright for the Gentle Reminder software codebase
6. Search USPTO TESS for "Gentle Reminder" trademark availability
7. Send outreach to 3 patent attorneys (Carson, Wojcik, Miller IP)

### THIS MONTH
8. File USPTO trademark application for "Gentle Reminder" (Class 9 + Class 44)
9. File Tier 1 provisional patents via selected attorney
10. Register Small Business Concern at sbir.gov/registration

### NEXT MONTH
11. File Tier 2 + Tier 3 provisionals
12. Complete US Copyright registration for key software components
13. Evaluate defensive publication options for non-patented innovations

---

## Legal Disclaimer

Nothing in this directory constitutes legal advice. These are general measures commonly used by startups; consult a licensed attorney before executing any protection that could affect your patent rights. In particular:
- Defensive publication is IRREVERSIBLE and destroys future patent rights
- Trademark registration requires actual use in commerce (or bona fide intent to use)
- Copyright registration does not protect functional aspects of code (only expression)
- Cryptographic timestamps are not recognized by USPTO as establishing priority for patents

For actual IP rights, file with USPTO — there is no substitute.
