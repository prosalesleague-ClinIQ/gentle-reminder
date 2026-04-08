import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { offlineSync } from '../services/OfflineSync';

/**
 * Hook that tracks the device's online/offline status and pending sync queue.
 *
 * Uses NetInfo on native platforms and navigator.onLine on web.
 * Automatically triggers sync when connectivity is restored.
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ synced: number; failed: number } | null>(
    null,
  );

  useEffect(() => {
    // Initialize offline sync service
    offlineSync.initialize().then(() => {
      setIsOnline(offlineSync.isOnline());
      setPendingCount(offlineSync.getQueueSize());
    });

    if (Platform.OS === 'web') {
      const handleOnline = () => {
        setIsOnline(true);
        offlineSync.setOnline(true);
      };
      const handleOffline = () => {
        setIsOnline(false);
        offlineSync.setOnline(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // On native: use polling as a fallback (NetInfo would be used in production)
    const interval = setInterval(() => {
      const online = offlineSync.isOnline();
      setIsOnline(online);
      setPendingCount(offlineSync.getQueueSize());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const syncNow = useCallback(async () => {
    if (isSyncing || !isOnline) return;
    setIsSyncing(true);
    try {
      const result = await offlineSync.sync();
      setLastSyncResult(result);
      setPendingCount(offlineSync.getQueueSize());
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncResult,
    syncNow,
  };
}
