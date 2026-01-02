import { createContext, useContext, useState, ReactNode } from 'react';
import { GameSave } from '../types/game';
import { StorageManager } from '../utils/storage';

interface GameContextType {
  games: Record<string, GameSave>;
  currentGameId: string | null;
  setCurrentGameId: (gameId: string | null) => void;
  addGame: (game: GameSave) => void;
  isGameNameTaken: (name: string) => boolean;
  isPlayerNameTaken: (name: string, gameId: string) => boolean;
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

  const isGameNameTaken = (name: string) => {
    return Object.values(games).some(
      (game) => game.gameName.toLowerCase() === name.toLowerCase()
    );
  };

  const isPlayerNameTaken = (name: string, gameId: string) => {
    const game = games[gameId];
    if (!game) return false;
    return game.players.some(
      (player) => player.name.toLowerCase() === name.toLowerCase()
    );
  };

  const testFunction = () => {
    console.log('Context is working!', games);
  };

  return (
    <GameContext.Provider
      value={{
        games,
        currentGameId,
        setCurrentGameId,
        addGame,
        isGameNameTaken,
        isPlayerNameTaken,
        testFunction,
      }}
    >
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
