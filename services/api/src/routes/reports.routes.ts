import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { auditPhiAccess } from "../middleware/audit.js";

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("reports"));
router.use(authenticate);

router.get('/daily/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    // In production, this would use the report-generator package
    res.json({
      success: true,
      data: {
        patientId,
        date,
        type: 'daily',
        sections: [
          { title: 'Summary', content: 'Patient completed 2 sessions with average score of 78%.' },
          { title: 'Cognitive Scores', content: 'Orientation: 82%, Identity: 88%, Memory: 64%' },
          { title: 'Medications', content: 'All medications taken on schedule.' },
          { title: 'Alerts', content: 'No alerts today.' },
        ],
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) { next(error); }
});

router.get('/weekly/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    res.json({
      success: true,
      data: {
        patientId,
        type: 'weekly',
        sessions: 5,
        avgScore: 76,
        trend: 'stable',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) { next(error); }
});

export default router;
