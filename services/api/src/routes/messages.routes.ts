import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { auditPhiAccess } from "../middleware/audit.js";
import * as controller from '../controllers/messages.controller.js';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("messages"));

router.use(authenticate);

router.get('/:userId', controller.getConversations);
router.post('/', controller.sendMessage);
router.get('/thread/:threadId', controller.getThreadMessages);

export default router;
