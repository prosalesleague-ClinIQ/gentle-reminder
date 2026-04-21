# Connecting gentlereminderapp@gmail.com to GHL

**Purpose:** Enable GHL (GoHighLevel) to send and log email from `gentlereminderapp@gmail.com`, so every outreach gets tracked, every reply threads into a contact, and automations (Day-7 follow-up, meeting-scheduled → send deck, etc.) can fire from the right address.
**Gmail type assumed:** free/personal Gmail account (gmail.com), not Google Workspace. If you later migrate to a Workspace account on a custom domain (e.g. `christo@gentlereminder.com`), the OAuth path below is simpler.
**Time:** 15–20 minutes.

---

## Quick decision: which connection method?

| Method | Use when | Effort | Notes |
|--------|----------|--------|-------|
| **OAuth (recommended)** | GHL has enabled Google OAuth integration for Gmail personal accounts | ~5 min | Cleanest; no app password to rotate; tracks opens + replies automatically. Supported in GHL's "Conversations → Email" settings in most sub-accounts. |
| **SMTP + App Password** | OAuth unavailable or you want full control of SMTP routing | ~15 min | Works with any Gmail account that has 2-Step Verification enabled; requires an App Password you generate in Google. |
| **SendGrid / Mailgun relay** | You want a separate sending reputation + deliverability dashboard | ~30 min | Out of scope for this week — revisit post-entity. |

**Decision for Week 0:** try OAuth first. If GHL's Gmail OAuth isn't available for your account, fall back to SMTP + App Password. Both paths work; OAuth is easier to maintain.

---

## Path A — OAuth (try this first)

### 1. Log into GHL as the sub-account owner

- Open your GHL dashboard (the specific sub-account for Gentle Reminder if you have multi-location setup)
- Settings → **Email Services** (or **Conversations → Email** depending on GHL version)

### 2. Look for "Connect Gmail" / "Connect Google Account"

- If you see a button that says something like "Connect Gmail", "Sign in with Google", or "Add Google Workspace Account" → click it
- GHL redirects to Google's consent screen
- Sign in as `gentlereminderapp@gmail.com`
- Grant the requested permissions (read, send, modify — typical scope for CRM email)
- Google redirects back to GHL; connection status should show "Connected"

### 3. Set as default sending address

- In GHL Settings → Email Services, mark `gentlereminderapp@gmail.com` as the **default sending email**
- If GHL asks for a "from name," set it to: `Christo Mack · Gentle Reminder`

### 4. Send a test email

- GHL → Conversations → New Conversation → compose a test message to yourself
- Verify it arrives in `gentlereminderapp@gmail.com`'s inbox
- Verify the test message also appears in GHL's Conversations log (inbound and outbound both tracked)

**If OAuth works: you're done. Skip Path B.**

---

## Path B — SMTP + App Password (fallback)

Use this if Path A's OAuth button doesn't exist in your GHL or fails.

### 1. Enable 2-Step Verification on the Google account

*Required before you can generate an App Password.*

- Sign into `https://myaccount.google.com` as `gentlereminderapp@gmail.com`
- Left sidebar → **Security**
- Find "2-Step Verification" → click to enable
- Walk through the setup (phone number, backup codes, etc.)
- Confirm 2SV shows "On"

### 2. Generate an App Password for GHL

- Still on `https://myaccount.google.com/security`
- Search for "App passwords" OR navigate to `https://myaccount.google.com/apppasswords`
- Google may prompt for password re-confirmation
- Create new App Password:
  - App name: `GHL — Gentle Reminder`
  - Click Generate
- Google shows a 16-character password like `abcd efgh ijkl mnop` — **copy it now**, Google won't show it again
- Store the password in your password manager (1Password / Bitwarden); label it "GHL SMTP — gentlereminderapp"

### 3. Configure SMTP in GHL

- GHL → Settings → **Email Services** → **SMTP Setup** (or equivalent)
- Enter:
  - **SMTP Server / Host:** `smtp.gmail.com`
  - **Port:** `587`
  - **Encryption:** `TLS` (or STARTTLS)
  - **Username:** `gentlereminderapp@gmail.com`
  - **Password:** the 16-character App Password from step 2 (no spaces when pasting into GHL)
  - **From Name:** `Christo Mack · Gentle Reminder`
  - **From Email:** `gentlereminderapp@gmail.com`
- Save

### 4. Send a test email

- GHL → Conversations → test send to yourself at `gentlereminderapp@gmail.com`
- Check inbox + sent log
- If GHL offers an "Inbound Email" connector (IMAP): add IMAP server `imap.gmail.com`, port `993`, SSL/TLS, same username + App Password. This lets replies thread back into GHL Conversations.

---

## IMAP (inbound) — for reply tracking

OAuth handles this automatically. For SMTP path:

- **IMAP Server:** `imap.gmail.com`
- **Port:** `993`
- **Encryption:** `SSL/TLS`
- **Username:** `gentlereminderapp@gmail.com`
- **Password:** same 16-char App Password

Once configured, every reply to your outreach threads into the corresponding GHL contact automatically.

---

## Verify the full loop

1. **Outbound:** from GHL, send a test to `gentlereminderapp+outbound-test@gmail.com` (plus-addressing). Verify it arrives.
2. **Inbound:** reply to that test from the receiving side. Verify the reply shows up in GHL Conversations threaded with the outbound.
3. **Attachments:** attach a small PDF. Verify it arrives intact.
4. **DKIM / SPF:** check that the test email doesn't land in spam. Gmail handles DKIM/SPF automatically for `@gmail.com` addresses. If spam-filtered, check the "Authentication-Results" header in the received email — all three of `SPF`, `DKIM`, `DMARC` should show `pass`.

---

## Rate limits

- Gmail free accounts cap at **500 outbound emails / day** across all clients. GHL sends + your manual sends from `/private/send` count against this same limit.
- Google may throttle sustained bursts (e.g., > 20 emails/minute). Space automations out if you're running a daily follow-up campaign.
- Workspace accounts have higher limits (2,000/day).

For Week-0 outreach (15 drafts split across Tier 1–5), you are nowhere near this cap. Just be aware.

---

## What changes in the pitch-site repo

Short answer: nothing automatic — but you'll likely want to update the `SIGNATURE` constant and BCC address in the repo from `mack@matrixadvancedsolutions.com` to `gentlereminderapp@gmail.com` so `/private/send` drafts use the new address by default.

Change sites (do after confirming the connection works):
- `apps/pitch-site/src/content/send-priority.ts` — `SIGNATURE` constant (replace email in footer)
- `apps/pitch-site/src/app/private/send/page.tsx` — `BCC_SELF` constant (auto-BCC target)
- `apps/pitch-site/src/content/response-templates.ts` — `SIGNATURE` constant
- `apps/pitch-site/src/content/pitch-deck.ts` — `DECK_DATA.email` (Slide 1 + Slide 16)
- `scripts/deck/generate-pitch-deck.js` — two hardcoded `mack@matrixadvancedsolutions.com` strings
- `apps/pitch-site/src/content/advisor-outreach-templates.ts` — signature
- `apps/pitch-site/src/content/email-templates.ts` — signature
- `apps/pitch-site/src/content/execute-plan.ts` — if referenced
- `docs/legal/pre-entity-outreach-safety.md` — incidental mentions
- `docs/clinical-validation/*` — PI/sponsor contact fields

After updating: regenerate PPTX + PDF (`node scripts/deck/generate-pitch-deck.js` + Chrome headless PDF), commit, redeploy Vercel.

**Recommendation:** don't do this wholesale repo update today. Fire off the 3 Tier 1 drafts manually with the updated signature (they'll open in your Gmail compose already logged into `gentlereminderapp@gmail.com`, and the BCC + signature in the draft body already point at the new address). Do the repo update in a single commit after you've confirmed the workflow works end-to-end.

---

## Troubleshooting

### "Username and Password not accepted" on SMTP save
- You used your main Google password instead of the App Password. Regenerate an App Password and paste that.
- 2-Step Verification isn't enabled on the Google account. Enable it first.

### Sent emails land in spam on the recipient side
- Likely fine for cold outreach to professional firms — most filter politely rather than spam.
- Add the recipient to GHL's "Warmed-up" list if you're about to send high-volume.
- Avoid sending > 50 cold emails/day from a new address; ramp gradually.

### GHL shows "Connection failed — invalid credentials"
- Double-check the App Password (no spaces, 16 chars, lowercase)
- Verify the Gmail account wasn't locked out due to suspicious activity — check `https://myaccount.google.com/notifications`

### Replies don't thread in GHL
- IMAP not configured (Path B). Add IMAP per the "IMAP (inbound)" section above.
- Gmail's "All Mail" or "Inbox" labels — make sure IMAP is set to watch "All Mail" (default) not just Inbox.

### Emails from GHL look like they're from `<randomstring>@gohighlevel.com`
- You forgot to set the "From Email" field in SMTP Setup. Edit the SMTP config and set from-email = `gentlereminderapp@gmail.com`.

---

## Post-connection checklist

- [x] OAuth or SMTP + App Password configured in GHL — **SMTP (Path B) used, 2026-04-20**
- [x] Test send to self — MCP self-test queued successfully (messageId `SzeDZnLfiRCz3N43DlfV`, 2026-04-20); confirm inbox delivery to close the loop
- [x] Default sending address set to `gentlereminderapp@gmail.com`
- [ ] From Name set to `Christo Mack · Gentle Reminder` — verify in GHL Settings → Email Services
- [x] Rate limits documented (500/day on Gmail free tier)
- [x] App Password stored in password manager
- [x] (Later) repo-wide signature update committed + redeployed — done in Phase 38h (`Christo Mac` → `Christo Mack`)

## Execution log

**2026-04-20 — SMTP configured via Path B.**

OAuth (Path A) was not attempted because GHL's Email Services UI didn't offer a `Connect Gmail` button for this sub-account. Setup used:
- Google 2-Step Verification (already on)
- App Password generated at `myaccount.google.com/apppasswords`, labeled `GHL — Gentle Reminder`
- SMTP config: `smtp.gmail.com:587` / TLS / `gentlereminderapp@gmail.com` / [App Password]

**Security follow-up:** the App Password was pasted into the session chat to complete setup. **Rotate it** — delete the current App Password at `myaccount.google.com/apppasswords` and generate a new one, then update GHL's SMTP password field with the new value. 60-second task, closes the residual exposure risk.

**MCP self-test (2026-04-20):**
- Created throwaway contact `SMTP Self-Test (delete me)` (id `JRvIp26tF5bG891pskAR`, email `gentlereminderapp+smtptest@gmail.com`)
- Sent test email via `conversations_send-a-new-message` → API returned `"Email queued successfully."` with messageId `SzeDZnLfiRCz3N43DlfV`, conversationId `ouDeyAwu5Qwtn0eWeZ8j`
- Final confirmation: visual check of `gentlereminderapp@gmail.com` inbox for the test message

Both the test contact and the test message can be deleted from GHL once the inbox delivery is confirmed.

## Related documents

| Document | Location |
|----------|----------|
| GHL Playbook README | `docs/crm-ghl/README.md` |
| Pipeline stages | `docs/crm-ghl/pipeline-config.md` |
| Email snippets | `docs/crm-ghl/snippets.md` |
| Automation recipes | `docs/crm-ghl/automations.md` |
| Pre-entity outreach safety | `docs/legal/pre-entity-outreach-safety.md` |
