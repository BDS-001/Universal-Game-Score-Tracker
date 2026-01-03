import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './globals.css';
import App from './layouts/App';
import { GameProvider } from './context/GameContext';
import { UIProvider } from './context/UIContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </GameProvider>
  </StrictMode>
);
