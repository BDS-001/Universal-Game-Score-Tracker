import { GameSettings, GameSave } from '../types/game';

export const defaultGameSettings: GameSettings = {
  startingPoints: 0,
  winningPoints: null,
  customButtons: [],
};

export const createNewGame = (gameName: string): GameSave => {
  return {
    id: crypto.randomUUID(),
    gameName,
    dateCreated: new Date().toISOString(),
    settings: { ...defaultGameSettings },
    players: {},
  };
};
