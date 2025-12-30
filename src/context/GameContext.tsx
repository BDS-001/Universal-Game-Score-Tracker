import { createContext, useContext, useState, ReactNode } from 'react';
import { GameSave } from '../types/game';
import { StorageManager } from '../utils/storage';

interface GameContextType {
  games: Record<string, GameSave>;
  testFunction: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Record<string, GameSave>>(() => {
    return StorageManager.loadData();
  });

  const testFunction = () => {
    console.log('Context is working!', games);
  };

  return (
    <GameContext.Provider value={{ games, testFunction }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};
