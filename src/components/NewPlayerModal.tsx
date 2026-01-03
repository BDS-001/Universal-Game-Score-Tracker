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
      players: [...currentGame.players, newPlayer],
    };

    addGame(updatedGame);

    closeModal('newPlayer');
    setPlayerName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => closeModal('newPlayer')}>
          X
        </button>
        <h2>Add New Player</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Player Name:
            <input
              className={styles.formInput}
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              autoFocus
            />
            {nameTaken && (
              <span className={styles.error}>Name already taken</span>
            )}
          </label>
          <div className={styles.buttons}>
            <button className={styles.submitButton} type="submit">
              Add Player
            </button>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => closeModal('newPlayer')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
