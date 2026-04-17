# Provisional Patent Application: FHIR R4 Extensions for Dementia Monitoring

**Docket No.:** GR-21-PROV | **Tier:** 3

## 1. TITLE
FHIR R4 Extension Set and Integration Method for Dementia Cognitive Monitoring

## 6. SUMMARY
Five custom FHIR R4 extensions for dementia-specific cognitive monitoring: cognitive-stage, biomarker-confidence, risk-prediction, decline-rate, session-engagement. Direct SNOMED CT terminology mapping for dementia subtypes.

## 8. DETAILED DESCRIPTION

### 8.1 Extension URIs
```
https://gentlereminder.health/fhir/StructureDefinition/cognitive-stage
https://gentlereminder.health/fhir/StructureDefinition/biomarker-confidence
https://gentlereminder.health/fhir/StructureDefinition/risk-prediction
https://gentlereminder.health/fhir/StructureDefinition/decline-rate
https://gentlereminder.health/fhir/StructureDefinition/session-engagement
```

### 8.2 Extension Semantics
- `cognitive-stage`: CodeableConcept {mild | moderate | severe}
- `biomarker-confidence`: decimal [0, 1]
- `risk-prediction`: structured object with risk type + probability
- `decline-rate`: decimal representing percent change per month
- `session-engagement`: structured object with session metrics

### 8.3 SNOMED Mapping
- Alzheimer's disease → SCT 26929004
- Vascular dementia → SCT 429998004
- Lewy body dementia → SCT 80098002
- Frontotemporal dementia → SCT 73768007
- Mixed dementia → SCT 75543006
- MCI → SCT 386805003

### 8.4 Reference Implementation
`packages/fhir/src/ExtensionHandler.ts`

## 9. CLAIMS

**Claim 1:** A system for integrating cognitive monitoring data with FHIR R4 electronic health records, comprising a set of five custom FHIR extensions uniquely identified by URIs under gentlereminder.health, wherein the extensions comprise: cognitive-stage as a coded severity indicator; biomarker-confidence as a decimal confidence score; risk-prediction as a structured object containing risk type and probability; decline-rate as a decimal percentage change per month; and session-engagement as a structured object containing session metrics; and a mapping layer providing direct SNOMED CT codes for dementia subtypes.

**Claims 2-4:** Dependent, system, CRM.

## 10. ABSTRACT

A FHIR R4 extension set for dementia cognitive monitoring defines five custom extensions (cognitive-stage, biomarker-confidence, risk-prediction, decline-rate, session-engagement) under a dedicated namespace, enabling interoperability with electronic health records, and maps dementia subtypes to SNOMED CT codes (Alzheimer's 26929004, vascular 429998004, Lewy body 80098002, frontotemporal 73768007, mixed 75543006, MCI 386805003).

Codebase: `packages/fhir/src/ExtensionHandler.ts`
