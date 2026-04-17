# Provisional Patent Application: 21 CFR Part 11 Hash-Chain Audit Trail

**Docket No.:** GR-18-PROV | **Tier:** 3

## 1. TITLE
Hash-Chain Audit Trail System for 21 CFR Part 11 Electronic Record Compliance

## 4. FIELD
Regulatory compliance audit systems for FDA 21 CFR Part 11 (electronic records and signatures).

## 6. SUMMARY
SHA-256 hash chain where each audit entry includes the checksum of the previous entry, enabling tamper detection. Electronic signatures include a meaning field (approval vs review) per CFR Part 11 requirements.

## 8. DETAILED DESCRIPTION

### 8.1 Hash Chain Structure
```
AuditEntry {
  timestamp: ISO8601
  actor: userId
  action: string
  data: JSON
  previousHash: SHA256 (of previous entry)
  entryHash: SHA256 (of this entry's content + previousHash)
  signature: { actorSignature, meaning: 'approval' | 'review' | 'responsibility' }
}
```

### 8.2 Verification Algorithm
Walks the chain forward, recomputes each hash, and detects any modification.

### 8.3 Reference Implementation
`packages/clinical-export/src/CFR11Compliance.ts`

## 9. CLAIMS

**Claim 1:** A method for maintaining a tamper-evident audit trail for electronic records subject to 21 CFR Part 11, comprising:
(a) generating each audit entry with fields including timestamp, actor, action, data, previous-entry hash, and current-entry hash computed over entry content plus previous-entry hash;
(b) upon recording an electronic signature, storing a signature meaning field selected from at least: approval, review, and responsibility;
(c) providing a verification function that walks the chain forward and detects any modification to prior entries by recomputing hashes.

**Claim 2-5:** Dependent, system, CRM.

## 10. ABSTRACT

A 21 CFR Part 11 audit trail system uses SHA-256 hash chains where each audit entry includes the cryptographic hash of the previous entry, enabling tamper-evident records. Electronic signatures include a meaning field indicating approval, review, or responsibility per CFR Part 11 requirements. A verification function detects any modification to historical entries.

Codebase: `packages/clinical-export/src/CFR11Compliance.ts`
