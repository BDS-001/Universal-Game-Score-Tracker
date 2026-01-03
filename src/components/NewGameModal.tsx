import { useState } from 'react';
import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import { createNewGame } from '../templates/gameTemplates';
import styles from './NewGameModal.module.css';

export default function NewGameModal() {
  const { closeModal } = useUIContext();
  const { addGame, isGameNameTaken } = useGameContext();
  const [gameName, setGameName] = useState('');
  const [startingPoints, setStartingPoints] = useState(0);
  const [winningPoints, setWinningPoints] = useState('');

  const nameTaken = gameName.trim() && isGameNameTaken(gameName.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim() || nameTaken) return;

    const newGame = createNewGame(gameName.trim());
    newGame.settings.startingPoints = startingPoints;
    newGame.settings.winningPoints =
      winningPoints === '' ? null : Number(winningPoints);

    addGame(newGame);

    closeModal('newGame');
    setGameName('');
    setStartingPoints(0);
    setWinningPoints('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => closeModal('newGame')}>
          X
        </button>
        <h2>Create New Game</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Game Name:
            <input
              className={styles.formInput}
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              autoFocus
            />
            {nameTaken && (
              <span className={styles.error}>Name already taken</span>
            )}
          </label>
          <label className={styles.formLabel}>
            Starting Points:
            <input
              className={styles.formInput}
              type="number"
              value={startingPoints}
              onChange={(e) => setStartingPoints(Number(e.target.value))}
            />
          </label>
          <label className={styles.formLabel}>
            Winning Points (optional):
            <input
              className={styles.formInput}
              type="number"
              value={winningPoints}
              onChange={(e) => setWinningPoints(e.target.value)}
              placeholder="Leave empty for no win condition"
            />
          </label>
          <div className={styles.buttons}>
            <button className={styles.submitButton} type="submit">
              Create
            </button>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => closeModal('newGame')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
