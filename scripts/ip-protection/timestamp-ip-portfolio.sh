#!/bin/bash
# Timestamp the entire Gentle Reminder IP portfolio using OpenTimestamps.
#
# Requires: pip install opentimestamps-client
# Produces: .ots proof files alongside each .md + a master manifest
#
# Legal effect: Creates cryptographic evidence of file existence at or before
# a specific Bitcoin blockchain block. Does NOT establish USPTO patent priority —
# only formal provisional patent filings do that.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IP_DIR="$PROJECT_ROOT/docs/ip"
MANIFEST="$PROJECT_ROOT/docs/ip-protection/ip-portfolio-manifest.txt"

# Check for ots command
if ! command -v ots >/dev/null 2>&1; then
  echo "ERROR: ots (OpenTimestamps client) not installed."
  echo "Install with: pip3 install opentimestamps-client"
  echo "Or via Docker: docker run opentimestamps/client"
  exit 1
fi

echo "==============================================================="
echo "  Gentle Reminder IP Portfolio — Cryptographic Timestamping"
echo "==============================================================="
echo ""
echo "This script:"
echo "  1. Computes SHA-256 of each IP document"
echo "  2. Generates OpenTimestamps (.ots) proofs"
echo "  3. Creates master manifest with all hashes"
echo "  4. Timestamps the manifest itself"
echo ""
echo "Proceeding in 3 seconds... (Ctrl+C to abort)"
sleep 3
echo ""

# Build manifest
echo "# Gentle Reminder IP Portfolio Manifest" > "$MANIFEST"
echo "# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")" >> "$MANIFEST"
echo "# This file lists SHA-256 hashes of every document in the IP portfolio." >> "$MANIFEST"
echo "# It is itself timestamped via OpenTimestamps for integrity verification." >> "$MANIFEST"
echo "" >> "$MANIFEST"

TOTAL=0
STAMPED=0

# Timestamp all .md files in docs/ip/
find "$IP_DIR" -type f -name "*.md" | while read -r FILE; do
  TOTAL=$((TOTAL + 1))
  REL_PATH="${FILE#$PROJECT_ROOT/}"
  HASH=$(shasum -a 256 "$FILE" | cut -d' ' -f1)

  echo "$HASH  $REL_PATH" >> "$MANIFEST"

  # Check if already timestamped (idempotent)
  if [ -f "${FILE}.ots" ]; then
    echo "  ⏭  SKIP (already stamped): $REL_PATH"
  else
    echo "  📎 STAMP: $REL_PATH"
    if ots stamp "$FILE" 2>&1 | grep -v "^Submitting\|^Got 1 attestation" | head -3; then
      STAMPED=$((STAMPED + 1))
    fi
  fi
done

# Timestamp the manifest itself
echo ""
echo "Timestamping master manifest..."
if [ -f "${MANIFEST}.ots" ]; then
  rm "${MANIFEST}.ots"  # always re-stamp manifest to include latest state
fi
ots stamp "$MANIFEST" 2>&1 | tail -3

echo ""
echo "==============================================================="
echo "  COMPLETE"
echo "==============================================================="
echo ""
echo "Files timestamped. Key artifacts:"
echo "  - Individual .ots proofs next to each .md file"
echo "  - Master manifest: docs/ip-protection/ip-portfolio-manifest.txt"
echo "  - Manifest timestamp proof: docs/ip-protection/ip-portfolio-manifest.txt.ots"
echo ""
echo "NEXT STEPS:"
echo ""
echo "  1. COMMIT these artifacts:"
echo "       git add docs/"
echo "       git commit -m 'IP portfolio cryptographic timestamps (OpenTimestamps)'"
echo "       git push"
echo ""
echo "  2. WAIT 2-24 HOURS for Bitcoin confirmation of your timestamps, then run:"
echo "       find docs/ip -name '*.ots' -exec ots upgrade {} \\;"
echo "       ots upgrade docs/ip-protection/ip-portfolio-manifest.txt.ots"
echo ""
echo "  3. COMMIT upgraded proofs:"
echo "       git add docs/"
echo "       git commit -m 'IP portfolio timestamps: upgraded with Bitcoin attestations'"
echo "       git push"
echo ""
echo "  4. VERIFY anytime:"
echo "       ots verify docs/ip/tier-1/01-gentle-feedback-scoring.md.ots"
echo ""
echo "  5. BACKUP: copy docs/ to a second location (external drive, encrypted cloud)"
echo ""
echo "IMPORTANT: Keep the .md files bitwise-identical after timestamping."
echo "Any modification (even whitespace) invalidates the timestamp."
echo "If you need to revise, re-timestamp the revised version as a new record."
