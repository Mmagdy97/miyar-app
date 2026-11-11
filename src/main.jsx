import { I18nProvider } from "./i18n";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './dark.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import CookieBanner from './components/CookieBanner.jsx'
import SharedView from './components/SharedView.jsx'

// Public client link: /?share=<snapshot> renders a read-only page, no login and no app shell.
const sharePayload = new URLSearchParams(window.location.search).get('share')

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Miyar PWA Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.warn('Miyar PWA Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ErrorBoundary>
        {sharePayload ? <SharedView payload={sharePayload} /> : <App />}
        <CookieBanner />
      </ErrorBoundary>
    </I18nProvider>
  </StrictMode>,
)
