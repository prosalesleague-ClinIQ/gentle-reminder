import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/messages.controller.js';

const router = Router();

router.use(authenticate);

router.get('/:userId', controller.getConversations);
router.post('/', controller.sendMessage);
router.get('/thread/:threadId', controller.getThreadMessages);

export default router;
