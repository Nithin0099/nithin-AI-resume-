import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Import the default export App
import ErrorBoundary from './Errorboundary.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App /> {/* Render App, which includes the router */}
    </ErrorBoundary>
  </StrictMode>
);