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
  updateGameSettings: (
    gameId: string,
    settings: {
      gameName?: string;
      startingPoints: number;
      winningPoints: number | null;
    }
  ) => void;
  updatePlayerScore: (
    gameId: string,
    playerId: string,
    newScore: number
  ) => void;
  updatePlayerName: (gameId: string, playerId: string, newName: string) => void;
  deletePlayer: (gameId: string, playerId: string) => void;
  isGameNameTaken: (name: string) => boolean;
  isPlayerNameTaken: (name: string, gameId: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Record<string, GameSave>>(() => {
    return StorageManager.loadData();
  });

  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  const updateGame = (
    gameId: string,
    updater: (game: GameSave) => GameSave
  ) => {
    const game = games[gameId];
    if (!game) return;

    const updatedGames = { ...games, [gameId]: updater(game) };
    setGames(updatedGames);
    StorageManager.saveData(updatedGames);
  };

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

  const updateGameSettings = (
    gameId: string,
    settings: {
      gameName?: string;
      startingPoints: number;
      winningPoints: number | null;
    }
  ) => {
    const { gameName, startingPoints, winningPoints } = settings;

    updateGame(gameId, (game) => ({
      ...game,
      ...(gameName && { gameName }),
      settings: {
        ...game.settings,
        startingPoints,
        winningPoints,
      },
    }));
  };

  const updatePlayerScore = (
    gameId: string,
    playerId: string,
    newScore: number
  ) => {
    updateGame(gameId, (game) => {
      const player = game.players[playerId];
      if (!player) return game;

      const change = newScore - player.score;
      return {
        ...game,
        players: {
          ...game.players,
          [playerId]: {
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
          },
        },
      };
    });
  };

  const updatePlayerName = (
    gameId: string,
    playerId: string,
    newName: string
  ) => {
    updateGame(gameId, (game) => {
      const player = game.players[playerId];
      if (!player) return game;

      return {
        ...game,
        players: {
          ...game.players,
          [playerId]: {
            ...player,
            name: newName,
          },
        },
      };
    });
  };

  const deletePlayer = (gameId: string, playerId: string) => {
    updateGame(gameId, (game) => {
      const { [playerId]: _, ...remainingPlayers } = game.players;
      return {
        ...game,
        players: remainingPlayers,
      };
    });
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
        updateGameSettings,
        updatePlayerScore,
        updatePlayerName,
        deletePlayer,
        isGameNameTaken,
        isPlayerNameTaken,
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
