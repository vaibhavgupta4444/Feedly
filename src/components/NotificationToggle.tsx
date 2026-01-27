import { useState, useEffect } from 'react';
import { pushNotificationService } from '../lib/pushNotifications';


interface NotificationToggleProps {
  token: string;
  onSubscriptionChange?: (isSubscribed: boolean) => void;
}

export default function NotificationToggle({ token, onSubscriptionChange }: NotificationToggleProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const supported = pushNotificationService.isSupported();
    setIsSupported(supported);

    if (supported) {
      const perm = pushNotificationService.getPermissionStatus();
      setPermission(perm);

      const subscribed = await pushNotificationService.isSubscribed();
      setIsSubscribed(subscribed);
    }
  };

  const handleToggle = async () => {
    if (!token) {
      alert('You must be logged in to enable notifications');
      return;
    }

    setIsLoading(true);
    try {
      if (isSubscribed) {
        // Unsubscribe
        await pushNotificationService.unsubscribe(token);
        setIsSubscribed(false);
        onSubscriptionChange?.(false);
      } else {
        // Subscribe
        await pushNotificationService.subscribe(token);

        setIsSubscribed(true);
        setPermission('granted');
        onSubscriptionChange?.(true);
      }
    } catch (error: unknown) {
      console.error('Error toggling notifications:', error);

      if (error instanceof Error) {
        if (error.message.includes("permission")) {
          alert("Please allow notifications in your browser settings.");
        } else if (error.message.includes("VAPID")) {
          alert("Push notifications are not configured on the server.");
        } else {
          alert("Failed to update notification settings.");
        }
      } else {
        alert("An unexpected error occurred.");
      }

      // Recheck status
      await checkStatus();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ Push notifications are not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🔔 Push Notifications
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isSubscribed
              ? 'Receive notifications even when the app is closed'
              : 'Enable to receive notifications when you\'re not on the site'}
          </p>
          {permission === 'denied' && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </div>

        <button
          onClick={handleToggle}
          disabled={isLoading || permission === 'denied'}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isSubscribed ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white
              transition-transform duration-200 ease-in-out
              ${isSubscribed ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {isLoading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          <span>Updating notification settings...</span>
        </div>
      )}

      {/* Status indicator */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span className={`inline-block w-2 h-2 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
        <span>{isSubscribed ? 'Active' : 'Inactive'}</span>
      </div>
    </div>
  );
}
