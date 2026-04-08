/**
 * fhir.routes.ts
 *
 * Express router for FHIR R4 REST endpoints.
 * /metadata is unauthenticated; all other routes require authentication.
 */

import { Router } from 'express';
import * as fhirController from '../controllers/fhir.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// CapabilityStatement (unauthenticated per FHIR spec)
router.get('/metadata', fhirController.getCapabilityStatement);

// Patient
router.get('/Patient/:id', authenticate, fhirController.getPatient);
router.get('/Patient/:id/\\$everything', authenticate, fhirController.getPatientEverything);

// Observation search (patient, category, date, code)
router.get('/Observation', authenticate, fhirController.searchObservations);

// MedicationRequest search
router.get('/MedicationRequest', authenticate, fhirController.searchMedicationRequests);

// CarePlan search
router.get('/CarePlan', authenticate, fhirController.searchCarePlans);

// DiagnosticReport search
router.get('/DiagnosticReport', authenticate, fhirController.searchDiagnosticReports);

// Bundle transaction
router.post('/Bundle', authenticate, fhirController.postBundle);

export default router;
