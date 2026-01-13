import { useState } from 'react';
import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import { Player } from '../types/game';
import styles from './NewPlayerModal.module.css';

export default function NewPlayerModal() {
  const { closeModal } = useUIContext();
  const { games, currentGameId, addGame, isPlayerNameTaken } = useGameContext();
  const [playerName, setPlayerName] = useState('');

  if (!currentGameId) return null;

  const currentGame = games[currentGameId];
  if (!currentGame) return null;

  const trimmedName = playerName.trim();
  const nameTaken =
    trimmedName && isPlayerNameTaken(trimmedName, currentGameId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedName || nameTaken) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: trimmedName,
      score: currentGame.settings.startingPoints,
      scoreHistory: [
        {
          change: currentGame.settings.startingPoints,
          timestamp: new Date().toISOString(),
          newTotal: currentGame.settings.startingPoints,
        },
      ],
    };

    addGame({
      ...currentGame,
      players: { ...currentGame.players, [newPlayer.id]: newPlayer },
    });

    closeModal('newPlayer');
    setPlayerName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => closeModal('newPlayer')}>
          ×
        </button>
        <h2 className="modal-title">Add New Player</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Player Name:
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              autoFocus
            />
            {nameTaken && (
              <span className="error-text">Name already taken</span>
            )}
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={() => closeModal('newPlayer')}>
              Cancel
            </button>
            <button className={styles.submitButton} type="submit">
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
