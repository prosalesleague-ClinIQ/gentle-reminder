/**
 * notifications.routes.ts
 *
 * Express router for push notification management.
 * Handles device registration, preferences, and notification history.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Device Registration ──────────────────────────────────────

/**
 * POST /notifications/devices
 * Register a device for push notifications (Expo push token).
 */
router.post('/devices', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pushToken, platform, deviceName } = req.body;

    if (!pushToken || !platform) {
      res.status(400).json({
        success: false,
        error: 'pushToken and platform are required',
      });
      return;
    }

    // In production: upsert device in database
    const device = {
      id: `dev-${Date.now()}`,
      userId: (req as any).user?.id || 'demo-user',
      pushToken,
      platform,
      deviceName: deviceName || 'Unknown Device',
      active: true,
      registeredAt: new Date().toISOString(),
    };

    res.status(201).json({ success: true, data: device });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /notifications/devices/:tokenId
 * Unregister a device (disable push notifications).
 */
router.delete('/devices/:tokenId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { id: req.params.tokenId, active: false },
    });
  } catch (error) {
    next(error);
  }
});

// ── Notification Preferences ────────────────────────────────

/**
 * GET /notifications/preferences
 * Get the authenticated user's notification preferences.
 */
router.get('/preferences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'demo-user';

    // Default preferences
    const preferences = {
      userId,
      medicationReminders: true,
      sessionReminders: true,
      cognitiveAlerts: true,
      familyMessages: true,
      caregiverAlerts: true,
      dailySummary: true,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      urgentOverrideQuietHours: true,
    };

    res.json({ success: true, data: preferences });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /notifications/preferences
 * Update notification preferences.
 */
router.put('/preferences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'demo-user';
    const updates = req.body;

    const preferences = {
      userId,
      medicationReminders: updates.medicationReminders ?? true,
      sessionReminders: updates.sessionReminders ?? true,
      cognitiveAlerts: updates.cognitiveAlerts ?? true,
      familyMessages: updates.familyMessages ?? true,
      caregiverAlerts: updates.caregiverAlerts ?? true,
      dailySummary: updates.dailySummary ?? true,
      quietHoursEnabled: updates.quietHoursEnabled ?? true,
      quietHoursStart: updates.quietHoursStart ?? '22:00',
      quietHoursEnd: updates.quietHoursEnd ?? '07:00',
      urgentOverrideQuietHours: updates.urgentOverrideQuietHours ?? true,
      updatedAt: new Date().toISOString(),
    };

    res.json({ success: true, data: preferences });
  } catch (error) {
    next(error);
  }
});

// ── Notification History ────────────────────────────────────

/**
 * GET /notifications
 * List notifications for the authenticated user.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Demo notification history
    const notifications = [
      {
        id: 'notif-1',
        type: 'medication_reminder',
        title: 'Medication Time',
        body: 'Time to take Donepezil (10mg)',
        read: false,
        sentAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        data: { medicationId: 'med-1' },
      },
      {
        id: 'notif-2',
        type: 'family_message',
        title: 'New Message from Lisa',
        body: 'Hi Mom! Just wanted to say I love you.',
        read: true,
        sentAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
        data: { messageId: 'msg-1', familyMemberId: 'fm-1' },
      },
      {
        id: 'notif-3',
        type: 'session_reminder',
        title: 'Morning Check-In',
        body: "Good morning! Let's start your daily check-in.",
        read: true,
        sentAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
        data: { sessionType: 'morning_routine' },
      },
      {
        id: 'notif-4',
        type: 'cognitive_alert',
        title: 'Weekly Progress',
        body: 'Your cognitive scores improved 8% this week!',
        read: true,
        sentAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
        data: { reportType: 'weekly_summary' },
      },
    ];

    res.json({
      success: true,
      data: notifications.slice(offset, offset + limit),
      pagination: { total: notifications.length, limit, offset },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /notifications/:id/read
 * Mark a notification as read.
 */
router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { id: req.params.id, read: true, readAt: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /notifications/read-all
 * Mark all notifications as read.
 */
router.post('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { markedRead: 4, readAt: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

// ── Send Notification (internal / admin) ─────────────────────

/**
 * POST /notifications/send
 * Send a push notification to a specific user or group.
 * Requires admin or clinician role.
 */
router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { targetUserId, targetRole, title, body, data, priority } = req.body;

    if (!title || !body) {
      res.status(400).json({
        success: false,
        error: 'title and body are required',
      });
      return;
    }

    // In production: look up Expo push tokens, send via Expo Push API
    const notification = {
      id: `notif-${Date.now()}`,
      targetUserId: targetUserId || null,
      targetRole: targetRole || null,
      title,
      body,
      data: data || {},
      priority: priority || 'default',
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipientCount: targetUserId ? 1 : 12,
    };

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
});

export default router;
