import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Safety check for root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

// Initialize React app with error handling
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  // Fallback error display if React fails to initialize
  console.error('Failed to initialize React app:', error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="text-align: center; max-width: 600px;">
        <h1 style="color: #ef4444; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          The application failed to load. Please refresh the page or contact support if the problem persists.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="padding: 12px 24px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
        >
          Refresh Page
        </button>
        ${import.meta.env.DEV ? `<pre style="margin-top: 24px; padding: 16px; background: #f3f4f6; border-radius: 8px; text-align: left; overflow-x: auto;">${error.toString()}</pre>` : ''}
      </div>
    </div>
  `;
}