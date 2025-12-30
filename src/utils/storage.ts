import { GameSave } from '../types/game';

export class StorageManager {
  static STORAGE_KEY = 'universalScoreTrackerData';

  static saveData(data: Record<string, GameSave>) {
    localStorage.setItem(StorageManager.STORAGE_KEY, JSON.stringify(data));
  }

  static loadData(): Record<string, GameSave> {
    const data = localStorage.getItem(StorageManager.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
}
