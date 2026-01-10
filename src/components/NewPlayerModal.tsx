import { useState } from 'react';
import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import { Player } from '../types/game';

export default function NewPlayerModal() {
  const { closeModal } = useUIContext();
  const { games, currentGameId, addGame, isPlayerNameTaken } = useGameContext();
  const [playerName, setPlayerName] = useState('');

  if (!currentGameId) return null;

  const currentGame = games[currentGameId];
  if (!currentGame) return null;

  const nameTaken =
    playerName.trim() && isPlayerNameTaken(playerName.trim(), currentGameId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || nameTaken) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: playerName.trim(),
      score: currentGame.settings.startingPoints,
      scoreHistory: [
        {
          change: currentGame.settings.startingPoints,
          timestamp: new Date().toISOString(),
          newTotal: currentGame.settings.startingPoints,
        },
      ],
    };

    const updatedGame = {
      ...currentGame,
      players: { ...currentGame.players, [newPlayer.id]: newPlayer },
    };

    addGame(updatedGame);

    closeModal('newPlayer');
    setPlayerName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => closeModal('newPlayer')}>
          ×
        </button>
        <h2>Add New Player</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Player Name:
            <input
              className="form-input"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              autoFocus
            />
            {nameTaken && (
              <span className="form-error">Name already taken</span>
            )}
          </label>
          <div className="form-buttons">
            <button
              className="btn"
              type="button"
              onClick={() => closeModal('newPlayer')}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
