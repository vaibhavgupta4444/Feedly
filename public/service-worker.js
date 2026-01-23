// Service Worker for Web Push Notifications
// Version: 1.0.1

console.log('🚀 Service Worker script loaded');

self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installing...');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activating...');
  // Claim all clients immediately
  event.waitUntil(
    clients.claim().then(() => {
      console.log('✅ Service Worker: Activated and claimed clients');
    })
  );
});

self.addEventListener('push', function(event) {
  console.log('🔔 Push notification received!', new Date().toISOString());
  console.log('   Event:', event);
  
  if (!event.data) {
    console.log('❌ Push event but no data');
    // Show a default notification anyway
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification',
        icon: '/vite.svg',
        badge: '/vite.svg',
      })
    );
    return;
  }

  try {
    const data = event.data.json();
    console.log('✅ Push data:', data);
    
    const title = data.title || 'New Notification';
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: data.data?.notification_id || 'notification',
      data: data.data || {},
      requireInteraction: false,
      vibrate: [200, 100, 200],
    };

    console.log('📢 Showing notification:', title);

    event.waitUntil(
      self.registration.showNotification(title, options).then(() => {
        console.log('✅ Notification displayed successfully!');
      }).catch(error => {
        console.error('❌ Failed to show notification:', error);
      })
    );
  } catch (error) {
    console.error('❌ Error parsing push data:', error);
    // Show default notification on error
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification',
        icon: '/vite.svg',
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/notifications');
      }
    })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('🔕 Notification closed:', event.notification);
});

// Add a simple fetch handler to ensure service worker stays registered
// This makes the service worker "functional" in Chrome's eyes
self.addEventListener('fetch', (event) => {
  // Just pass through all requests, don't intercept
  // This handler exists only to keep the service worker active
  return;
});
