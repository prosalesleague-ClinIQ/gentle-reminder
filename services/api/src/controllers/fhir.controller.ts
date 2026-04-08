/**
 * fhir.controller.ts
 *
 * Express request handlers for FHIR R4 REST endpoints.
 * Sets Content-Type to application/fhir+json and returns
 * OperationOutcome resources on errors.
 */

import { Request, Response, NextFunction } from 'express';
import * as fhirService from '../services/fhir.service.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sendFHIR(res: Response, data: any, status = 200): void {
  res.status(status).set('Content-Type', 'application/fhir+json').json(data);
}

function sendOperationOutcome(
  res: Response,
  status: number,
  severity: 'error' | 'warning' | 'information',
  code: string,
  diagnostics: string,
): void {
  res.status(status).set('Content-Type', 'application/fhir+json').json({
    resourceType: 'OperationOutcome',
    issue: [
      {
        severity,
        code,
        diagnostics,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/**
 * GET /fhir/metadata
 * Returns the CapabilityStatement (no authentication required).
 */
export async function getCapabilityStatement(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const capabilityStatement = fhirService.getCapabilityStatement();
    sendFHIR(res, capabilityStatement);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /fhir/Patient/:id
 * Returns a single FHIR Patient resource.
 */
export async function getPatient(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const patient = fhirService.getPatientAsFHIR(req.params.id);
    if (!patient) {
      sendOperationOutcome(res, 404, 'error', 'not-found', `Patient/${req.params.id} not found`);
      return;
    }
    sendFHIR(res, patient);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /fhir/Patient/:id/$everything
 * Returns a Bundle with all resources related to the patient.
 */
export async function getPatientEverything(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bundle = fhirService.getPatientEverything(req.params.id);
    if (!bundle) {
      sendOperationOutcome(res, 404, 'error', 'not-found', `Patient/${req.params.id} not found`);
      return;
    }
    sendFHIR(res, bundle);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /fhir/Observation
 * Searches Observations by patient, category, date, and code.
 */
export async function searchObservations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bundle = fhirService.searchObservations({
      patient: req.query.patient as string | undefined,
      category: req.query.category as string | undefined,
      date: req.query.date as string | undefined,
      code: req.query.code as string | undefined,
    });
    sendFHIR(res, bundle);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /fhir/MedicationRequest
 * Searches MedicationRequests by patient.
 */
export async function searchMedicationRequests(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bundle = fhirService.searchMedicationRequests({
      patient: req.query.patient as string | undefined,
    });
    sendFHIR(res, bundle);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /fhir/CarePlan
 * Searches CarePlans by patient.
 */
export async function searchCarePlans(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bundle = fhirService.searchCarePlans({
      patient: req.query.patient as string | undefined,
    });
    sendFHIR(res, bundle);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /fhir/DiagnosticReport
 * Searches DiagnosticReports by patient.
 */
export async function searchDiagnosticReports(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bundle = fhirService.searchDiagnosticReports({
      patient: req.query.patient as string | undefined,
    });
    sendFHIR(res, bundle);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /fhir/Bundle
 * Accepts a transaction Bundle, validates entries, and returns a response Bundle.
 */
export async function postBundle(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bundle = req.body;

    if (!bundle || bundle.resourceType !== 'Bundle') {
      sendOperationOutcome(
        res,
        400,
        'error',
        'invalid',
        'Request body must be a FHIR Bundle resource',
      );
      return;
    }

    if (bundle.type !== 'transaction' && bundle.type !== 'batch') {
      sendOperationOutcome(
        res,
        400,
        'error',
        'invalid',
        'Only transaction and batch Bundles are supported',
      );
      return;
    }

    // Validate each entry
    const entries = bundle.entry || [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.resource) {
        const validation = fhirService.validateResource(entry.resource);
        if (!validation.valid) {
          sendOperationOutcome(
            res,
            422,
            'error',
            'processing',
            `Validation failed for entry[${i}]: ${validation.errors.map((e: any) => e.message).join('; ')}`,
          );
          return;
        }
      }
    }

    const responseBundle = fhirService.createTransactionBundle(entries);
    sendFHIR(res, responseBundle, 200);
  } catch (error) {
    next(error);
  }
}
