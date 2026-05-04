import './styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <HashRouter basename="">
      <App />
    </HashRouter>
  </StrictMode>
);
