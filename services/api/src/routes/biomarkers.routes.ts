import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { auditPhiAccess } from "../middleware/audit.js";

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("biomarkers"));
router.use(authenticate);

router.get('/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    res.json({
      success: true,
      data: {
        patientId,
        scores: [
          { type: 'cognitive_response_delay', score: 0.38, trend: 'stable', confidence: 0.85 },
          { type: 'routine_disruption', score: 0.35, trend: 'increasing', confidence: 0.78 },
          { type: 'sleep_irregularity', score: 0.42, trend: 'increasing', confidence: 0.82 },
          { type: 'medication_adherence', score: 0.78, trend: 'improving', confidence: 0.92 },
          { type: 'speech_hesitation', score: 0.29, trend: 'improving', confidence: 0.75 },
        ],
        compositeScore: 0.72,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) { next(error); }
});

router.get('/:patientId/history', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    res.json({
      success: true,
      data: {
        patientId,
        period: `${days} days`,
        history: Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          compositeScore: 0.7 + Math.random() * 0.15,
        })),
      },
    });
  } catch (error) { next(error); }
});

export default router;
