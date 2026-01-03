export interface ScoreHistoryEntry {
  change: number;
  timestamp: string;
  newTotal: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  scoreHistory: ScoreHistoryEntry[];
}

export interface CustomButton {
  id: string;
  label: string;
  value: number;
}

export interface GameSettings {
  startingPoints: number;
  winningPoints: number | null;
  customButtons: CustomButton[];
}

export interface GameSave {
  id: string;
  gameName: string;
  dateCreated: string;
  settings: GameSettings;
  players: Record<string, Player>;
}
