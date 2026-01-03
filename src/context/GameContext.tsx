import { createContext, useContext, useState, ReactNode } from 'react';
import { GameSave } from '../types/game';
import { StorageManager } from '../utils/storage';

interface GameContextType {
  games: Record<string, GameSave>;
  currentGameId: string | null;
  setCurrentGameId: (gameId: string | null) => void;
  currentPlayerId: string | null;
  setCurrentPlayerId: (gameId: string | null) => void;
  addGame: (game: GameSave) => void;
  updatePlayerScore: (
    gameId: string,
    playerId: string,
    newScore: number
  ) => void;
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
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

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
    return Object.values(game.players).some(
      (player) => player.name.toLowerCase() === name.toLowerCase()
    );
  };

  const updatePlayerScore = (
    gameId: string,
    playerId: string,
    newScore: number
  ) => {
    const game = games[gameId];
    if (!game) return;

    const player = game.players[playerId];
    if (!player) return;

    const change = newScore - player.score;
    const updatedPlayer = {
      ...player,
      score: newScore,
      scoreHistory: [
        ...player.scoreHistory,
        {
          change,
          timestamp: new Date().toISOString(),
          newTotal: newScore,
        },
      ],
    };

    const updatedGames = {
      ...games,
      [gameId]: {
        ...game,
        players: {
          ...game.players,
          [playerId]: updatedPlayer,
        },
      },
    };

    setGames(updatedGames);
    StorageManager.saveData(updatedGames);
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
        currentPlayerId,
        setCurrentPlayerId,
        addGame,
        updatePlayerScore,
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
