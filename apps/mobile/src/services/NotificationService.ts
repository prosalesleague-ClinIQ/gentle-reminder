import { Platform } from 'react-native';

/**
 * Push Notification Service for Gentle Reminder.
 *
 * Handles medication reminders, exercise prompts, caregiver alerts,
 * and family messages using expo-notifications (native) or
 * web Notification API (web).
 *
 * All notifications use warm, non-alarming language appropriate
 * for dementia patients.
 */

export interface NotificationConfig {
  medicationReminders: boolean;
  exercisePrompts: boolean;
  familyMessages: boolean;
  caregiverAlerts: boolean;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledAt: Date;
  type: 'medication' | 'exercise' | 'message' | 'alert' | 'companion';
  data?: Record<string, unknown>;
}

const DEFAULT_CONFIG: NotificationConfig = {
  medicationReminders: true,
  exercisePrompts: true,
  familyMessages: true,
  caregiverAlerts: true,
};

class NotificationService {
  private static instance: NotificationService;
  private config: NotificationConfig = { ...DEFAULT_CONFIG };
  private initialized: boolean = false;
  private expoPushToken: string | null = null;
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize the notification system.
   * Requests permissions and registers for push notifications.
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      if (Platform.OS === 'web') {
        return this.initializeWeb();
      }
      return await this.initializeNative();
    } catch (error) {
      console.warn('[Notifications] Initialization failed:', error);
      return false;
    }
  }

  private async initializeNative(): Promise<boolean> {
    try {
      const Notifications = require('expo-notifications');

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('[Notifications] Permission not granted');
        return false;
      }

      // Configure notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Get push token (for remote notifications)
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        this.expoPushToken = tokenData.data;
      } catch {
        // Push token may not be available in development
      }

      this.initialized = true;
      return true;
    } catch {
      // expo-notifications not available
      this.initialized = true;
      return false;
    }
  }

  private initializeWeb(): boolean {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      this.initialized = true;
      return true;
    }
    if (typeof Notification !== 'undefined' && Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') this.initialized = true;
      });
    }
    this.initialized = true;
    return true;
  }

  /**
   * Schedule a medication reminder.
   */
  async scheduleMedicationReminder(
    medicationName: string,
    dosage: string,
    scheduledTime: Date,
  ): Promise<string> {
    if (!this.config.medicationReminders) return '';

    const notification: ScheduledNotification = {
      id: `med-${Date.now()}`,
      title: 'Time for your medication',
      body: `It's time to take ${medicationName} (${dosage}). Tap to mark as taken.`,
      scheduledAt: scheduledTime,
      type: 'medication',
      data: { medicationName, dosage },
    };

    return this.scheduleNotification(notification);
  }

  /**
   * Schedule a gentle exercise prompt.
   */
  async scheduleExercisePrompt(scheduledTime: Date): Promise<string> {
    if (!this.config.exercisePrompts) return '';

    const prompts = [
      'Ready for some gentle brain exercises? I\'d love to do them with you.',
      'How about a quick brain game? It\'ll be fun!',
      'Time for a little mental workout. I\'ll guide you through it.',
    ];

    const notification: ScheduledNotification = {
      id: `exercise-${Date.now()}`,
      title: 'Brain Exercise Time',
      body: prompts[Math.floor(Math.random() * prompts.length)],
      scheduledAt: scheduledTime,
      type: 'exercise',
    };

    return this.scheduleNotification(notification);
  }

  /**
   * Send an immediate notification for a new message.
   */
  async notifyNewMessage(senderName: string, relationship: string, preview: string): Promise<void> {
    if (!this.config.familyMessages) return;

    await this.sendImmediate({
      title: `Message from ${senderName}`,
      body: `Your ${relationship} says: "${preview.slice(0, 80)}${preview.length > 80 ? '...' : ''}"`,
      type: 'message',
      data: { senderName, relationship },
    });
  }

  /**
   * Send a caregiver alert notification.
   */
  async notifyCaregiverAlert(alertType: string, message: string): Promise<void> {
    if (!this.config.caregiverAlerts) return;

    await this.sendImmediate({
      title: alertType,
      body: message,
      type: 'alert',
      data: { alertType },
    });
  }

  /**
   * Cancel a scheduled notification.
   */
  async cancelNotification(id: string): Promise<void> {
    this.scheduledNotifications.delete(id);
    if (Platform.OS !== 'web') {
      try {
        const Notifications = require('expo-notifications');
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {}
    }
  }

  /**
   * Cancel all scheduled notifications.
   */
  async cancelAll(): Promise<void> {
    this.scheduledNotifications.clear();
    if (Platform.OS !== 'web') {
      try {
        const Notifications = require('expo-notifications');
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch {}
    }
  }

  /**
   * Update notification preferences.
   */
  setConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // ── Internal ────────────────────────────────────────────────

  private async scheduleNotification(notification: ScheduledNotification): Promise<string> {
    this.scheduledNotifications.set(notification.id, notification);

    const delayMs = notification.scheduledAt.getTime() - Date.now();
    if (delayMs <= 0) {
      await this.sendImmediate(notification);
      return notification.id;
    }

    if (Platform.OS === 'web') {
      setTimeout(() => this.sendWebNotification(notification), delayMs);
    } else {
      try {
        const Notifications = require('expo-notifications');
        await Notifications.scheduleNotificationAsync({
          identifier: notification.id,
          content: {
            title: notification.title,
            body: notification.body,
            sound: 'default',
            data: notification.data || {},
          },
          trigger: { seconds: Math.round(delayMs / 1000) },
        });
      } catch {}
    }

    return notification.id;
  }

  private async sendImmediate(notification: Partial<ScheduledNotification> & { title: string; body: string }): Promise<void> {
    if (Platform.OS === 'web') {
      this.sendWebNotification(notification as ScheduledNotification);
    } else {
      try {
        const Notifications = require('expo-notifications');
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            sound: 'default',
            data: notification.data || {},
          },
          trigger: null, // Immediate
        });
      } catch {}
    }
  }

  private sendWebNotification(notification: ScheduledNotification): void {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(notification.title, { body: notification.body });
    }
  }
}

export const notificationService = NotificationService.getInstance();
export { NotificationService };
