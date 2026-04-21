# 3. US Copyright Registration for Software

**Cost:** $65 per work (individual author, online filing)
**Time:** 1-2 hours to file; registration takes 3-9 months to issue
**Legal effect:** Enables statutory damages (up to $150K per infringement) and attorney's fees recovery in infringement suits. Required to sue in US federal court for copyright.

---

## What Copyright Covers

Copyright protects the **expression** of ideas in your code, documentation, UI designs, and content — NOT the functional aspects (those are patent territory).

For Gentle Reminder:
- ✅ Source code (expression)
- ✅ Documentation files (expression)
- ✅ UI designs (expression)
- ✅ Written content on the pitch site
- ❌ Algorithms (patent territory)
- ❌ Database schemas (functional, not expressive)
- ❌ User interface "look and feel" in the abstract

Copyright is **automatic** upon creation — you don't have to register to own it. But registration enables:
- Statutory damages ($750-$150,000 per work infringed) without proving actual damages
- Attorney's fees recovery (winning party gets legal costs paid)
- Prima facie evidence of validity (burden shifts to defendant)
- Ability to sue in US federal court

---

## What to Register (Priority Order)

### High Priority
1. **Platform source code** (apps/mobile, apps/pitch-site, etc.)
2. **Core package source code** (packages/cognitive-engine, packages/biomarker-engine, packages/cognitive-state)
3. **AI services source code** (services/ai)
4. **IP portfolio documentation** (docs/ip/)

### Medium Priority
5. **Pitch deck** (as a literary work)
6. **Clinical validation protocol**
7. **FDA SaMD documentation set** (IEC 62304, ISO 14971, QMS)

### Lower Priority
8. Individual marketing assets
9. Email templates
10. Internal process documents

---

## How to File — Online via eCO (Electronic Copyright Office)

### 1. Create Account
https://www.copyright.gov/registration/ → "Register a Work"

### 2. Choose Registration Type
For software, the most efficient options:
- **Single Application** ($65) — one work, one author — best for founder-written code
- **Standard Application** ($125) — multiple authors, derivative works, etc.

For Gentle Reminder's main codebase, use **Single Application** (assuming one primary author) or **Standard Application** if multiple contributors.

### 3. Deposit Requirements for Software

US Copyright Office accepts:
- **Source code deposit**: First 25 + last 25 pages of source code
- **Object code deposit**: Allowed but less protective
- **Trade secret redaction**: You can block out up to 50% of source code as trade secret (preserves copyright registration while protecting confidential algorithms)

**Recommended approach for Gentle Reminder:**
- Deposit first 25 + last 25 pages of each major module
- Redact specific numerical parameters (kept as trade secrets)
- Include a "table of contents" showing the overall structure

### 4. Fee Payment
- $65 single / $125 standard
- Pay via credit card or electronic funds transfer during filing

### 5. Wait for Registration
- 3-9 months typical for US Copyright Office to issue certificate
- Priority date = date application was received (not issuance date)
- You can use ©️ notation with "Registration pending" in the interim

---

## Registration Strategy for Gentle Reminder

### Batch 1 (File This Month)
| Title | Type | Fee | Notes |
|-------|------|-----|-------|
| Gentle Reminder Platform Source Code, Version 1.0 | Computer program | $65 | Main monorepo as of a specific git commit |
| Gentle Reminder Documentation Suite | Literary work (nondramatic) | $65 | docs/ directory |
| Gentle Reminder IP Portfolio | Literary work (nondramatic) | $65 | docs/ip/ directory |

**Total Batch 1 Cost: $195**

### Batch 2 (File Post-Seed, 6 months later)
- Updated platform code for each major release
- Clinical validation reports
- Research publications
- Pitch materials

---

## Deposit Material Preparation

Create a "copyright deposit package" for each filing:

```bash
# Example for platform source code deposit
mkdir -p copyright-deposit/2026-04-platform-v1
cd copyright-deposit/2026-04-platform-v1

# 1. First 25 pages of source code (concatenated)
cat packages/cognitive-engine/src/scoring/*.ts | head -n 750 > first-25-pages.txt

# 2. Last 25 pages of source code (concatenated)
cat apps/pitch-site/src/**/*.tsx | tail -n 750 > last-25-pages.txt

# 3. Table of contents
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.py" | sort > table-of-contents.txt

# 4. Redaction notice
cat > redaction-notice.txt <<EOF
Redaction Notice:
Portions of the deposit have been redacted to protect trade secrets.
Specifically, numerical parameters in the following files are replaced with "REDACTED":
- packages/cognitive-engine/src/scoring/adaptive-difficulty.ts (threshold values)
- packages/cognitive-state/src/signals/SpeechSignalProcessor.ts (baseline values)
- packages/biomarker-engine/src/scoring/BiomarkerEngine.ts (weight distributions)
- services/ai/src/services/emotion_detection.py (keyword dictionaries)

The structure, logic, and expressive elements of the code are preserved
in the deposited material.
EOF

# 5. Combined deposit PDF (for filing via eCO)
# Use any PDF combining tool
```

---

## Trade Secret Coordination

**IMPORTANT:** Copyright deposit is submitted to the US Copyright Office. Per 37 CFR 202.19 and 202.20, certain deposits are available for public inspection after a period. To protect trade secrets:

1. Use redaction allowed under 37 CFR 202.20(c)(2)(vii)(A)
2. Redact the specific numerical parameters that are your trade secrets
3. Deposit the general code structure + expressive elements
4. Keep the redacted parameters in a sealed envelope with your attorney / in an internal trade secret registry

This preserves both copyright protection (structure/expression) and trade secret protection (specific values).

---

## Costs Summary

| Item | Cost |
|------|-----:|
| Single Application × 3 (Batch 1) | $195 |
| Copyright deposit preparation (self-done) | $0 |
| Standard Application × 1 (full platform, post-seed) | $125 |
| Future periodic re-filings (version updates) | $65 each |
| **Year 1 copyright total** | **~$250-$500** |

---

## Copyright Notice in Code

Add this header to all source files going forward:

```typescript
/**
 * Copyright © 2026 Gentle Reminder, Inc. All rights reserved.
 *
 * This software and associated documentation are proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is strictly prohibited.
 *
 * US Copyright Registration No.: [fill in once issued]
 * Contact: gentlereminderapp@gmail.com
 */
```

While not required for copyright protection (copyright is automatic), this notice:
- Deters innocent infringement
- Establishes ownership in court
- Makes willful infringement easier to prove (higher damages)

---

## Filing URL

https://www.copyright.gov/registration/

Create eCO account with a clear project email. Keep all confirmation emails and payment receipts.
