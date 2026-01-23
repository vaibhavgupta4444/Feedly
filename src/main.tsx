import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import router from './router.tsx';
import UserProvider from './providers/userProvider.tsx';
import { SocketProvider } from './contexts/socketContext.tsx';

// Register Service Worker for Push Notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
      })
      .catch(err => {
        console.error('❌ Service Worker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </UserProvider>
  </StrictMode>,
)
