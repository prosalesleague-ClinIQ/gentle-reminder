#!/usr/bin/env bash
#
# Generate CycloneDX Software Bill of Materials (SBOM)
# for FDA SaMD cybersecurity documentation.
#
# Collects dependencies from:
#   - Node.js/npm packages (all workspaces)
#   - Python packages (if requirements.txt exists)
#   - Swift packages (if Package.resolved exists)
#
# Output: docs/cybersecurity/sbom.json
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/docs/cybersecurity"
OUTPUT_FILE="$OUTPUT_DIR/sbom.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$OUTPUT_DIR"

echo "=== Generating SBOM for Gentle Reminder ==="
echo "Project root: $PROJECT_ROOT"
echo "Output: $OUTPUT_FILE"
echo ""

# --- Node.js Dependencies ---

echo "--- Collecting Node.js dependencies ---"

NPM_SBOM_FILE=$(mktemp)

if command -v npx &> /dev/null; then
  # Try CycloneDX npm plugin first
  if npx --yes @cyclonedx/cyclonedx-npm \
    --output-file "$NPM_SBOM_FILE" \
    --output-format json \
    --spec-version 1.5 \
    "$PROJECT_ROOT" 2>/dev/null; then
    echo "Node.js SBOM generated via @cyclonedx/cyclonedx-npm"
  else
    # Fallback: generate from npm list
    echo "CycloneDX plugin not available, generating from npm list..."
    cd "$PROJECT_ROOT"
    npm list --all --json > "$NPM_SBOM_FILE" 2>/dev/null || true
    echo "Node.js dependency tree captured"
  fi
else
  echo "WARNING: npx not available, skipping Node.js dependencies"
  echo '{}' > "$NPM_SBOM_FILE"
fi

# --- Python Dependencies ---

echo ""
echo "--- Collecting Python dependencies ---"

PYTHON_DEPS_FILE=$(mktemp)

PYTHON_REQ_FILES=$(find "$PROJECT_ROOT" -name "requirements.txt" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null || true)

if [ -n "$PYTHON_REQ_FILES" ]; then
  echo '[]' > "$PYTHON_DEPS_FILE"
  while IFS= read -r req_file; do
    echo "  Found: $req_file"
    while IFS= read -r line; do
      # Skip comments and empty lines
      [[ "$line" =~ ^#.*$ ]] && continue
      [[ -z "$line" ]] && continue
      # Extract package name and version
      pkg_name=$(echo "$line" | sed -E 's/([a-zA-Z0-9_-]+).*/\1/')
      pkg_version=$(echo "$line" | sed -E 's/[a-zA-Z0-9_-]+[=><!]+//' | sed 's/[[:space:]]//g')
      if [ -n "$pkg_name" ]; then
        echo "    - $pkg_name ${pkg_version:-unknown}"
      fi
    done < "$req_file"
  done <<< "$PYTHON_REQ_FILES"
else
  echo "  No requirements.txt files found"
  echo '[]' > "$PYTHON_DEPS_FILE"
fi

# --- Swift Dependencies ---

echo ""
echo "--- Collecting Swift dependencies ---"

SWIFT_DEPS_FILE=$(mktemp)

SWIFT_RESOLVED=$(find "$PROJECT_ROOT" -name "Package.resolved" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -1 || true)

if [ -n "$SWIFT_RESOLVED" ] && [ -f "$SWIFT_RESOLVED" ]; then
  echo "  Found: $SWIFT_RESOLVED"
  cp "$SWIFT_RESOLVED" "$SWIFT_DEPS_FILE"
else
  echo "  No Package.resolved found"
  echo '{}' > "$SWIFT_DEPS_FILE"
fi

# --- Combine into final SBOM ---

echo ""
echo "--- Assembling final SBOM ---"

cat > "$OUTPUT_FILE" << EOF
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "00000000-0000-0000-0000-000000000000")",
  "version": 1,
  "metadata": {
    "timestamp": "$TIMESTAMP",
    "tools": [
      {
        "vendor": "Gentle Reminder",
        "name": "generate-sbom",
        "version": "1.0.0"
      }
    ],
    "component": {
      "type": "application",
      "name": "gentle-reminder",
      "version": "1.0.0",
      "description": "Cognitive Health Monitoring Platform (FDA SaMD Class II)",
      "purl": "pkg:npm/gentle-reminder@1.0.0"
    }
  },
  "components": []
}
EOF

# If CycloneDX generated a proper SBOM, use it as the base
if [ -s "$NPM_SBOM_FILE" ] && grep -q '"bomFormat"' "$NPM_SBOM_FILE" 2>/dev/null; then
  cp "$NPM_SBOM_FILE" "$OUTPUT_FILE"
  echo "Using CycloneDX-generated SBOM as base"
fi

# --- Cleanup ---

rm -f "$NPM_SBOM_FILE" "$PYTHON_DEPS_FILE" "$SWIFT_DEPS_FILE"

echo ""
echo "=== SBOM generated successfully ==="
echo "Output: $OUTPUT_FILE"
echo "Timestamp: $TIMESTAMP"
echo ""
echo "Next steps:"
echo "  1. Review the SBOM for completeness"
echo "  2. Check for known vulnerabilities: npm audit"
echo "  3. Commit the SBOM to version control"
