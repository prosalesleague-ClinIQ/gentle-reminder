# GPG Signing — One-Time Setup Runbook

**Context:** fortress-audit IP-Moat Weakness #4 — `git log --pretty="%G?"` returns `N` on every commit in this repo despite `docs/ip-protection/02-signed-git-commits.md` documenting the full setup. This is a 30-minute one-time fix that lifts the IP-Moat defensive-measures axis and gives tamper-evident authorship evidence at commit time (complements the OTS timestamping already in place).

## Why this matters

- **Investor diligence:** Unsigned commits undermine the `.ots` timestamp story. A signed commit binds `author → content → timestamp` cryptographically; an unsigned commit can be forged/rewritten.
- **Patent-conception evidence:** Signed commits at the IP-drafting window establish inventor identity at the moment of conception, not at filing time.
- **Supply-chain trust:** Signed releases let downstream consumers verify the repo wasn't tampered with in transit.

## One-time setup (do this once per machine)

```bash
# 1. Generate an Ed25519 signing key (modern, fast, small).
gpg --default-new-key-algo ed25519 --quick-generate-key \
    "Christopher McPherson <gentlereminderapp@gmail.com>" \
    default \
    0  # never expires; set e.g. "2y" if you prefer rotation

# 2. Export the key ID.
gpg --list-secret-keys --keyid-format=long gentlereminderapp@gmail.com
# Copy the line that says `sec   ed25519/<KEY_ID>` — the <KEY_ID> is what you want.

# 3. Tell git about it (global, not per-repo).
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# 4. (macOS) Make sure gpg-agent is available to git.
brew install gnupg pinentry-mac
mkdir -p ~/.gnupg
echo "pinentry-program $(brew --prefix)/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent

# 5. Export the public key so GitHub can verify it.
gpg --armor --export <KEY_ID> | pbcopy
# Paste into https://github.com/settings/keys → New GPG key

# 6. Attestation commit — the first signed commit binds your key to the repo.
cd "/Users/christomac/Projects/Gentle Reminder"
git commit --allow-empty -S -m "chore: attest GPG signing — all future commits signed by $(git config user.email)"
git log --show-signature -1  # should show "Good signature" now
git log --pretty="%G?" -1    # should return "G" (not "N")
```

## Verification (investor diligence answer)

```bash
# Should return "G" for every commit from attestation forward:
git log --pretty="%H %G?" -20
```

Expected future state:
```
<sha> G  ← signed + verified
<sha> G
<sha> G
<sha> N  ← historical, pre-attestation (don't rewrite — rewrite breaks .ots anchors)
```

## What NOT to do

- **Do not** rewrite the historical commits to sign them retroactively. The `.ots` timestamps are bound to the original content hashes; rewriting invalidates the priority evidence you've already accumulated.
- **Do not** store the GPG private key on a shared drive or in cloud backup.
- **Do not** commit the `~/.gnupg/` directory (it's already in `.gitignore` by default).

## Integration with fortress + IP-moat audits

After the attestation commit:
- `/private/diligence` Moat panel: defensive-measures axis lifts from 3 → 5 (still capped at 4 while TM/copyright pending; lifts to 6 once those land).
- Next fortress re-scan: `%G?` check will show `G` on all post-attestation commits — adds ~2 points to Governance/evidence axis.

## Related

- `docs/ip-protection/02-signed-git-commits.md` — original protection-stack spec this runbook operationalizes.
- `docs/ip-protection/01-cryptographic-timestamping.md` — OTS timestamping (already executed on 23 IP drafts).
- `docs/ip/ip-moat-eval-2026-04-22.md` — Weakness #4 source.
