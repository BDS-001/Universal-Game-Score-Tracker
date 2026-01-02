import { createContext, useContext, useState, ReactNode } from 'react';
import { GameSave } from '../types/game';
import { StorageManager } from '../utils/storage';

interface GameContextType {
  games: Record<string, GameSave>;
  currentGameId: string | null;
  setCurrentGameId: (gameId: string | null) => void;
  addGame: (game: GameSave) => void;
  testFunction: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Record<string, GameSave>>(() => {
    return StorageManager.loadData();
  });

  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const addGame = (game: GameSave) => {
    const updatedGames = { ...games, [game.id]: game };
    setGames(updatedGames);
    StorageManager.saveData(updatedGames);
  };

  const testFunction = () => {
    console.log('Context is working!', games);
  };

  return (
    <GameContext.Provider value={{ games, currentGameId, setCurrentGameId, addGame, testFunction }}>
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
