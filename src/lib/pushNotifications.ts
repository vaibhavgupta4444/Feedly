import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Helper function to convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  const base64Safe = (base64 + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = atob(base64Safe);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);

  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i);
  }

  // Check if this is a DER-encoded key (91 bytes) instead of raw key (65 bytes)
  if (output.length === 91) {
    console.log('🔧 Detected DER-encoded key, extracting raw public key...');
    // DER-encoded P-256 public key structure:
    // - ASN.1 header (26 bytes)
    // - Raw public key (65 bytes starting with 0x04)
    // Extract the last 65 bytes which is the raw uncompressed public key
    const rawKey = output.slice(-65);
    console.log('✅ Extracted raw key:', rawKey.length, 'bytes');
    console.log('   First byte:', rawKey[0], '(should be 4)');
    return rawKey;
  }

  return output;
}


class PushNotificationService {
  private vapidPublicKey: string | null = null;

  /**
   * Check if push notifications are supported by the browser
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  /**
   * Get the current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Check if the user is currently subscribed to push notifications
   */
  async isSubscribed(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Get the VAPID public key from the backend
   */
  private async getVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) {
      return this.vapidPublicKey;
    }

    try {
      console.log('📡 Fetching VAPID key from:', `${API_URL}/vapid/public-key`);
      const response = await axios.get(`${API_URL}/vapid/public-key`);
      console.log('📡 Full response:', response.data);
      
      this.vapidPublicKey = response.data.public_key;
      
      if (!this.vapidPublicKey) {
        throw new Error('VAPID public key not configured on server');
      }
      
      console.log('✅ VAPID key received:');
      console.log('   Length:', this.vapidPublicKey.length);
      console.log('   First 30 chars:', this.vapidPublicKey.substring(0, 30));
      console.log('   Last 30 chars:', this.vapidPublicKey.substring(this.vapidPublicKey.length - 30));
      console.log('   Has whitespace:', /\s/.test(this.vapidPublicKey));
      console.log('   Has newlines:', /\n/.test(this.vapidPublicKey));
      
      return this.vapidPublicKey;
    } catch (error) {
      console.error('Failed to get VAPID public key:', error);
      throw new Error('Could not retrieve VAPID public key from server');
    }
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported in this browser');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribe(token: string): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported in this browser');
    }
    
    // Check permission
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Get VAPID public key
    const publicKey = await this.getVapidPublicKey();
    
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      try {
        // Subscribe to push notifications
        const applicationServerKey = urlBase64ToUint8Array(publicKey);
        
        if (applicationServerKey.length !== 65) {
          throw new Error(`Invalid VAPID key length: ${applicationServerKey.length} bytes (expected 65)`);
        }
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });
        
      } catch (error: unknown) {
          throw new Error('Invalid VAPID public key. Check console for details.',
             error as Error);
      }
    } else {
      console.log('ℹ️  Already subscribed to push notifications');
    }
    
    // Send subscription to backend
    await axios.post(
      `${API_URL}/push-subscriptions/`,
      subscription.toJSON(),
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // console.log('✅ Successfully subscribed to push notifications!');
    // console.log('📱 Subscription details:');
    // console.log('   Endpoint:', subscription.endpoint);
    // // console.log('   Keys:', Object.keys(subscription.toJSON().keys));
    // console.log('');
    // console.log('🎉 You will now receive notifications even when the site is closed!');
    // console.log('   To test: Close this tab and have someone interact with your content.');
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(token: string): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Remove subscription from backend
        await axios.delete(`${API_URL}/push-subscriptions/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: subscription.toJSON()
        });
        
        // Unsubscribe from browser
        await subscription.unsubscribe();
        // console.log('✅ Unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }

  /**
   * Send a test notification (for debugging)
   */
  async sendTestNotification(): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported');
    }

    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    new Notification('Test Notification', {
      body: 'This is a test notification from the browser',
      icon: '/vite.svg',
      badge: '/vite.svg',
    });
  }
}

export const pushNotificationService = new PushNotificationService();
