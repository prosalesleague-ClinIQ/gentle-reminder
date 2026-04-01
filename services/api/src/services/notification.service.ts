/**
 * Notification Service
 * Manages push notifications for caregivers and family members.
 * Uses an in-memory queue for demo; production would use FCM/APNs.
 */

interface Notification {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: 'alert' | 'reminder' | 'update' | 'message';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

const notifications: Notification[] = [];
let nextId = 1;

export function sendNotification(params: {
  recipientId: string;
  title: string;
  body: string;
  type: Notification['type'];
  priority?: Notification['priority'];
  data?: Record<string, unknown>;
}): Notification {
  const notification: Notification = {
    id: String(nextId++),
    recipientId: params.recipientId,
    title: params.title,
    body: params.body,
    type: params.type,
    priority: params.priority || 'normal',
    data: params.data,
    read: false,
    createdAt: new Date(),
  };
  notifications.push(notification);
  console.log(`[NOTIFICATION] ${notification.priority.toUpperCase()} -> ${notification.recipientId}: ${notification.title}`);
  return notification;
}

export function getNotifications(recipientId: string, unreadOnly = false): Notification[] {
  return notifications
    .filter(n => n.recipientId === recipientId && (!unreadOnly || !n.read))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function markAsRead(notificationId: string): boolean {
  const n = notifications.find(n => n.id === notificationId);
  if (n) { n.read = true; return true; }
  return false;
}

export function getUnreadCount(recipientId: string): number {
  return notifications.filter(n => n.recipientId === recipientId && !n.read).length;
}

// Auto-generate demo notifications
export function seedDemoNotifications(): void {
  sendNotification({ recipientId: 'caregiver-1', title: 'Session Complete', body: 'Margaret completed her morning session (82%)', type: 'update', priority: 'normal' });
  sendNotification({ recipientId: 'caregiver-1', title: 'Medication Alert', body: 'Harold missed his 12pm Memantine', type: 'alert', priority: 'high' });
  sendNotification({ recipientId: 'caregiver-1', title: 'New Message', body: 'Lisa Thompson sent a message', type: 'message', priority: 'normal' });
  sendNotification({ recipientId: 'family-1', title: 'Daily Report', body: "Margaret had a good day - score 78%", type: 'update', priority: 'normal' });
  sendNotification({ recipientId: 'caregiver-1', title: 'Fall Risk Alert', body: 'Frank Anderson fall risk elevated to HIGH', type: 'alert', priority: 'urgent' });
}
