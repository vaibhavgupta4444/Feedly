import { useEffect, useState } from 'react';
import { pushNotificationService } from '../pushNotifications';
import { socketService } from '../socket';

/**
 * Hook to automatically manage push notification subscription
 * Subscribes when user logs in (if permission granted)
 * Unsubscribes when user logs out
 */
export function useAutoSubscribePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    if (token && pushNotificationService.isSupported()) {
      // Check if already subscribed
      pushNotificationService.isSubscribed().then((subscribed: boolean) => {
        setIsSubscribed(subscribed);
        
        // Auto-subscribe if permission is already granted but not subscribed
        if (!subscribed && pushNotificationService.getPermissionStatus() === 'granted') {
          pushNotificationService.subscribe(token)
            .then(() => {
              setIsSubscribed(true);
              console.log('✅ Auto-subscribed to push notifications');
            })
            .catch((error: unknown) => {
              console.error('Failed to auto-subscribe to push notifications:', error);
            });
        }
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return { isSubscribed };
}

/**
 * Hook to check if user is online (socket connected)
 */
export function useSocketStatus() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setIsOnline(socketService.isConnected());
    };

    // Initial check
    checkStatus();

    // Check every 2 seconds
    const interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  return { isOnline };
}

/**
 * Comprehensive notification status hook
 */
export function useNotificationStatus() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    // Check push notification support
    setPushSupported(pushNotificationService.isSupported());

    // Check push subscription status
    if (pushNotificationService.isSupported()) {
      pushNotificationService.isSubscribed().then(setPushEnabled);
    }

    // Check socket connection status
    const checkSocket = () => {
      setSocketConnected(socketService.isConnected());
    };

    checkSocket();
    const interval = setInterval(checkSocket, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    pushEnabled,
    socketConnected,
    pushSupported,
    isFullyEnabled: pushEnabled && socketConnected,
    canReceiveNotifications: socketConnected || pushEnabled,
  };
}
