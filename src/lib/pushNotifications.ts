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

  /**
   * Subscribe to push notifications
   */
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
    
    console.log('🔑 Converting VAPID key to Uint8Array...');
    console.log('   Original key:', publicKey.substring(0, 50) + '...');
    
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      try {
        // Subscribe to push notifications
        const applicationServerKey = urlBase64ToUint8Array(publicKey);
        
        console.log('✅ Converted to Uint8Array:');
        console.log('   Byte length:', applicationServerKey.length);
        console.log('   Expected: 65 bytes (P-256 uncompressed)');
        console.log('   First 10 bytes:', Array.from(applicationServerKey.slice(0, 10)));
        console.log('   Buffer type:', applicationServerKey.constructor.name);
        
        if (applicationServerKey.length !== 65) {
          console.error('❌ INVALID KEY LENGTH!');
          console.error('   P-256 public keys must be exactly 65 bytes');
          console.error('   Your key is', applicationServerKey.length, 'bytes');
          throw new Error(`Invalid VAPID key length: ${applicationServerKey.length} bytes (expected 65)`);
        }
        
        // First byte should be 0x04 for uncompressed P-256 key
        if (applicationServerKey[0] !== 4) {
          console.warn('⚠️  Warning: First byte is', applicationServerKey[0], 'expected 4');
          console.warn('   This suggests the key might not be a valid P-256 uncompressed public key');
        }
        
        console.log('🔔 Attempting to subscribe to push notifications...');
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });
        
        console.log('✅ Successfully subscribed!');
        console.log('   Endpoint:', subscription.endpoint);
        
      } catch (error: any) {
        console.error('❌ Subscription failed!');
        console.error('   Error name:', error.name);
        console.error('   Error message:', error.message);
        console.error('   Full error:', error);
        
        if (error.name === 'InvalidAccessError') {
          console.error('');
          console.error('═══════════════════════════════════════════════════════');
          console.error('🚨 INVALID VAPID KEY ERROR');
          console.error('═══════════════════════════════════════════════════════');
          console.error('');
          console.error('The browser rejected your VAPID public key.');
          console.error('');
          console.error('COMMON CAUSES:');
          console.error('1. Using PRIVATE key instead of PUBLIC key');
          console.error('2. Key is corrupted or has extra characters');
          console.error('3. Key not generated with web-push');
          console.error('');
          console.error('HOW TO FIX:');
          console.error('');
          console.error('Step 1: Generate new VAPID keys');
          console.error('   npm install -g web-push');
          console.error('   web-push generate-vapid-keys');
          console.error('');
          console.error('Step 2: Copy the PUBLIC KEY (not private!)');
          console.error('   It should start with: B...');
          console.error('   It should be 87-88 characters long');
          console.error('');
          console.error('Step 3: Update your backend .env');
          console.error('   VAPID_PUBLIC_KEY=B...your-public-key...');
          console.error('   VAPID_PRIVATE_KEY=...your-private-key...');
          console.error('');
          console.error('Step 4: Restart backend and clear this.vapidPublicKey cache');
          console.error('');
          console.error('To verify your key:');
          console.error('   curl http://localhost:8000/vapid/public-key');
          console.error('   Should return: {"public_key": "B..."}}');
          console.error('');
          console.error('═══════════════════════════════════════════════════════');
          console.error('');
          
          throw new Error('Invalid VAPID public key. Check console for details.');
        }
        
        throw error;
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

    console.log('✅ Successfully subscribed to push notifications!');
    console.log('📱 Subscription details:');
    console.log('   Endpoint:', subscription.endpoint);
    // console.log('   Keys:', Object.keys(subscription.toJSON().keys));
    console.log('');
    console.log('🎉 You will now receive notifications even when the site is closed!');
    console.log('   To test: Close this tab and have someone interact with your content.');
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
        console.log('✅ Unsubscribed from push notifications');
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
