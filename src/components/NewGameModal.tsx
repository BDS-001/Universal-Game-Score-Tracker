import { useState } from 'react';
import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import { createNewGame } from '../templates/gameTemplates';
import { StorageManager } from '../utils/storage';

export default function NewGameModal() {
  const { closeModal } = useUIContext();
  const { games } = useGameContext();
  const [gameName, setGameName] = useState('');
  const [startingPoints, setStartingPoints] = useState(0);
  const [winningPoints, setWinningPoints] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    const newGame = createNewGame(gameName.trim());
    newGame.settings.startingPoints = startingPoints;
    newGame.settings.winningPoints = winningPoints === '' ? null : Number(winningPoints);

    const updatedGames = { ...games, [newGame.id]: newGame };
    StorageManager.saveData(updatedGames);

    closeModal('newGame');
    setGameName('');
    setStartingPoints(0);
    setWinningPoints('');
  };

  return (
    <div>
      <button onClick={() => closeModal('newGame')}>X</button>
      <h2>Create New Game</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Game Name:
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            autoFocus
          />
        </label>
        <label>
          Starting Points:
          <input
            type="number"
            value={startingPoints}
            onChange={(e) => setStartingPoints(Number(e.target.value))}
          />
        </label>
        <label>
          Winning Points (optional):
          <input
            type="number"
            value={winningPoints}
            onChange={(e) => setWinningPoints(e.target.value)}
            placeholder="Leave empty for no win condition"
          />
        </label>
        <button type="submit">Create</button>
        <button type="button" onClick={() => closeModal('newGame')}>
          Cancel
        </button>
      </form>
    </div>
  );
}