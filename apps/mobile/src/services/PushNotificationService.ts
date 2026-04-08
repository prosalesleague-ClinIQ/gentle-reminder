import { Platform } from 'react-native';

/**
 * Push Notification Service for Gentle Reminder.
 *
 * Handles Expo push notification registration, permission requests,
 * token management, and notification response handling.
 *
 * Notification types:
 * - medication_reminder: Time to take medication
 * - session_reminder: Daily cognitive session prompt
 * - family_message: New message from a family member
 * - cognitive_alert: Score change or progress update
 * - caregiver_alert: Urgent alert for caregiver
 * - daily_summary: End-of-day summary
 */

export interface PushNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  receivedAt: string;
}

export type NotificationHandler = (notification: PushNotification) => void;

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class PushNotificationService {
  private static instance: PushNotificationService;
  private pushToken: string | null = null;
  private handlers: Map<string, NotificationHandler[]> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize push notifications: request permissions, get token, register with server.
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    if (Platform.OS === 'web') {
      console.log('[PushNotifications] Web platform — push notifications not supported');
      this.initialized = true;
      return false;
    }

    try {
      // Dynamic import to avoid web bundling issues
      const Notifications = await import('expo-notifications').catch(() => null);
      if (!Notifications) {
        console.log('[PushNotifications] expo-notifications not available');
        this.initialized = true;
        return false;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[PushNotifications] Permission not granted');
        this.initialized = true;
        return false;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync();
      this.pushToken = tokenData.data;

      // Register token with backend
      await this.registerToken(this.pushToken);

      // Set up notification received handler
      Notifications.addNotificationReceivedListener((notification) => {
        const content = notification.request.content;
        const pushNotif: PushNotification = {
          id: notification.request.identifier,
          type: (content.data?.type as string) || 'general',
          title: content.title || '',
          body: content.body || '',
          data: content.data as Record<string, unknown>,
          receivedAt: new Date().toISOString(),
        };
        this.dispatchNotification(pushNotif);
      });

      // Set up notification response handler (user tapped notification)
      Notifications.addNotificationResponseReceivedListener((response) => {
        const content = response.notification.request.content;
        const type = (content.data?.type as string) || 'general';
        console.log(`[PushNotifications] User tapped notification: ${type}`);
        // Navigation logic would go here based on notification type
      });

      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medication', {
          name: 'Medication Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });
        await Notifications.setNotificationChannelAsync('alerts', {
          name: 'Alerts',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 250, 500],
          sound: 'default',
        });
        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
        });
      }

      this.initialized = true;
      console.log(`[PushNotifications] Initialized with token: ${this.pushToken?.slice(0, 20)}...`);
      return true;
    } catch (error) {
      console.error('[PushNotifications] Initialization error:', error);
      this.initialized = true;
      return false;
    }
  }

  /**
   * Register push token with the backend.
   */
  private async registerToken(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pushToken: token,
          platform: Platform.OS,
          deviceName: `${Platform.OS} device`,
        }),
      });
    } catch (error) {
      console.warn('[PushNotifications] Failed to register token:', error);
    }
  }

  /**
   * Subscribe to notifications of a specific type.
   */
  onNotification(type: string, handler: NotificationHandler): () => void {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);

    // Return unsubscribe function
    return () => {
      const current = this.handlers.get(type) || [];
      this.handlers.set(
        type,
        current.filter((h) => h !== handler),
      );
    };
  }

  /**
   * Dispatch a received notification to registered handlers.
   */
  private dispatchNotification(notification: PushNotification): void {
    // Type-specific handlers
    const typeHandlers = this.handlers.get(notification.type) || [];
    typeHandlers.forEach((h) => h(notification));

    // Wildcard handlers
    const wildcardHandlers = this.handlers.get('*') || [];
    wildcardHandlers.forEach((h) => h(notification));
  }

  /**
   * Schedule a local notification (e.g., medication reminder).
   */
  async scheduleLocal(params: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    trigger: { seconds: number } | { date: Date };
    channelId?: string;
  }): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const Notifications = await import('expo-notifications').catch(() => null);
      if (!Notifications) return null;

      const trigger =
        'seconds' in params.trigger
          ? { seconds: params.trigger.seconds }
          : { date: params.trigger.date };

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          data: params.data,
          sound: 'default',
        },
        trigger,
      });

      return id;
    } catch {
      return null;
    }
  }

  /**
   * Cancel a scheduled notification.
   */
  async cancelScheduled(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      const Notifications = await import('expo-notifications').catch(() => null);
      if (Notifications) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch {}
  }

  /**
   * Get the current push token (null if not registered).
   */
  getToken(): string | null {
    return this.pushToken;
  }
}

export const pushNotifications = PushNotificationService.getInstance();
export { PushNotificationService };
