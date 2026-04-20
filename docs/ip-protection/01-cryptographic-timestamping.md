# 1. Cryptographic Timestamping with OpenTimestamps

**Cost:** Free
**Time:** 10-30 minutes
**Legal effect:** Admissible evidence of prior creation; does NOT establish patent priority date, but provides tamper-evident proof of file contents at a specific time.

---

## What This Does

OpenTimestamps (opentimestamps.org) is a free, open-source protocol that anchors cryptographic hashes of your files to the Bitcoin blockchain. The resulting `.ots` file can later be verified to prove that a specific file existed — with that exact content — at or before a specific block height on the blockchain.

**Use cases:**
- Defense against later patent trolls claiming priority
- Evidence of invention date in trade-secret disputes
- Supplementary evidence to support later patent filings
- Proof of authorship for copyright disputes

**Limitations:**
- Does NOT substitute for USPTO patent filing
- Does NOT establish "first to file" priority under AIA
- Requires the original file to be preserved bitwise-identical to be verifiable
- Verification requires tools to work (common; OpenTimestamps is widely supported)

## How It Works

1. Hash file with SHA-256 → get unique fingerprint
2. Send hash to OpenTimestamps calendar servers (free)
3. Servers aggregate hashes into a Merkle tree and commit to Bitcoin
4. You receive a `.ots` proof file
5. Anyone can later verify the `.ots` proof against the original file and the Bitcoin blockchain

## Installation

**macOS:**
```bash
pip3 install opentimestamps-client
```

**Alternative: Docker:**
```bash
docker run -it --rm -v "$PWD":/data opentimestamps/client
```

**Alternative: JavaScript client (browser):**
https://opentimestamps.org/

## Usage — One File

```bash
# Create timestamp proof for one file
ots stamp docs/ip/tier-1/01-gentle-feedback-scoring.md

# This creates: 01-gentle-feedback-scoring.md.ots

# Verify (immediate — uses pending attestations)
ots verify docs/ip/tier-1/01-gentle-feedback-scoring.md.ots

# Later (once Bitcoin confirms, ~2 hours to 24 hours):
ots upgrade docs/ip/tier-1/01-gentle-feedback-scoring.md.ots
ots verify docs/ip/tier-1/01-gentle-feedback-scoring.md.ots
```

## Usage — Entire IP Portfolio (Recommended)

Run the script at `scripts/ip-protection/timestamp-ip-portfolio.sh` — it will timestamp all 23 IP drafts and supporting documents.

```bash
bash scripts/ip-protection/timestamp-ip-portfolio.sh
```

The script:
1. Stamps each `.md` file in `docs/ip/` recursively
2. Stamps the supporting docs (README, INVENTOR-DISCLOSURE, PRIOR-ART-SEARCH, FILING-CHECKLIST, TEMPLATE)
3. Creates a master manifest file with SHA-256 hashes of all files
4. Stamps the manifest itself
5. Prints instructions for upgrading + verifying

## Evidence Preservation

After running the script:
- `.ots` files are created alongside each `.md` file
- Commit both `.md` and `.ots` files to git
- Back up to a second location (not just the working git repo)

## Cost

- OpenTimestamps client: free
- Timestamping: free (calendar servers subsidize Bitcoin fees)
- Verification: free

## Legal Weight

Cryptographic timestamping is increasingly recognized in court proceedings as evidence of prior creation. Notable cases include:
- IP disputes in cryptocurrency-adjacent spaces (2018+)
- Copyright enforcement in creative industries (2019+)
- Rare use in patent matters (due to USPTO being the authoritative system)

It is most useful as **corroborating evidence** alongside other records (git commits, emails, design documents) — not as a primary legal instrument.

## Verification Instructions (for later)

If you need to prove a file existed at a specific date, provide:
1. The original file (bitwise-identical to when timestamped)
2. The `.ots` proof file
3. Instructions to verify: `pip install opentimestamps-client && ots verify file.ots`

The verifier will:
1. Compute SHA-256 of the original file
2. Follow the `.ots` proof chain
3. Query Bitcoin blockchain for confirmation block
4. Report the Bitcoin block timestamp — this is the "existed at or before" date
