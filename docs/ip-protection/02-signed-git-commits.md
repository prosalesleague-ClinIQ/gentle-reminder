# 2. Signed Git Commits (GPG)

**Cost:** Free
**Time:** 30 minutes (one-time setup)
**Legal effect:** Tamper-evident proof of authorship at specific date. Admissible as evidence of creation timeline.

---

## Why

Every git commit includes:
- Author name + email
- Exact timestamp
- SHA-1 hash of the content at that moment

But unsigned commits can be **spoofed** — anyone can set git config to any name/email. **Signed commits** use a GPG key only you control, creating cryptographic proof that you (and only you) committed that content at that time.

GitHub displays a "Verified" badge on signed commits. In any future IP dispute, your signed commit history is strong evidence of when you created each piece of work.

---

## One-Time Setup

### macOS

```bash
# 1. Install GPG (if not already installed)
brew install gnupg pinentry-mac

# 2. Configure pinentry for macOS (so GPG can prompt for passphrase in a GUI)
echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent

# 3. Generate a new GPG key (use your git email)
gpg --full-generate-key
# Choose:
#   - RSA and RSA (default)
#   - 4096 bits
#   - Never expires (0)
#   - Your real name
#   - Your git email (must match exactly)
#   - Strong passphrase (save in password manager)

# 4. Get your GPG key ID
gpg --list-secret-keys --keyid-format=long
# Look for: sec   rsa4096/ABC123DEF456 ...
# The part after "rsa4096/" is your key ID

# 5. Export public key (to add to GitHub)
gpg --armor --export ABC123DEF456

# 6. Configure git to sign ALL commits
git config --global user.signingkey ABC123DEF456
git config --global commit.gpgsign true
git config --global tag.gpgsign true
git config --global gpg.program $(which gpg)
```

### Add Public Key to GitHub

1. Copy the output of `gpg --armor --export YOUR_KEY_ID`
2. Go to https://github.com/settings/keys
3. Click "New GPG key"
4. Paste the armored public key
5. Save

### Test

```bash
cd "/Users/christomac/Projects/Gentle Reminder"
# Make a trivial change
echo "" >> README.md
git add README.md
git commit -m "Test signed commit"
# GPG should prompt for your passphrase
# The commit is now signed

git log --show-signature -1
# Should show: "Good signature from..."

# Push to GitHub
git push

# On GitHub, the commit should show a green "Verified" badge
```

---

## Sign Existing Unsigned Commits (Optional)

If you want to retroactively sign past commits, you would need to rewrite history — this is destructive and typically not worth the risk. Better approach: **sign from now forward** and include a signed README commit that attests to prior unsigned commits:

```bash
cat > /tmp/attestation.md <<EOF
# Attestation of Authorship

As of $(date -u +"%Y-%m-%d"), the commits in this repository before this
attestation were authored by [YOUR NAME]. All commits from this date
forward will be GPG-signed.

Git email: [your@email.com]
GPG Key ID: [YOUR_KEY_ID]
SHA-256 of this attestation: $(shasum -a 256 /tmp/attestation.md | cut -d' ' -f1)
EOF

cp /tmp/attestation.md docs/ip-protection/ATTESTATION.md
git add docs/ip-protection/ATTESTATION.md
git commit -S -m "Authorship attestation; all future commits GPG-signed"
git push
```

---

## Trust Chain Summary

After setup:
- ✅ Every new commit is cryptographically signed
- ✅ GitHub displays "Verified" badges
- ✅ Anyone cloning the repo can verify `git log --show-signature`
- ✅ Tamper-evident authorship trail for all future IP work

The GPG public key is public; only you hold the private key. Keep the private key + passphrase backed up securely (encrypted USB drive or password manager).
