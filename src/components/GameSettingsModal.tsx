import { useState, useEffect } from 'react';
import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import { createNewGame } from '../templates/gameTemplates';
import styles from './GameSettingsModal.module.css';

export default function GameSettingsModal() {
  const { closeModal } = useUIContext();
  const { games, currentGameId, addGame, updateGameSettings, isGameNameTaken } =
    useGameContext();

  const editingGame = currentGameId ? games[currentGameId] : null;
  const isEditMode = !!editingGame;

  const [gameName, setGameName] = useState('');
  const [startingPoints, setStartingPoints] = useState(0);
  const [winningPoints, setWinningPoints] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');

  useEffect(() => {
    if (editingGame) {
      setGameName(editingGame.gameName);
      setStartingPoints(editingGame.settings.startingPoints);
      setWinningPoints(editingGame.settings.winningPoints?.toString() || '');
    } else {
      setGameName('');
      setStartingPoints(0);
      setWinningPoints('');
    }
  }, [editingGame]);

  const nameTaken =
    gameName.trim() &&
    isGameNameTaken(gameName.trim()) &&
    (!isEditMode || gameName.trim() !== editingGame?.gameName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim() || nameTaken) return;

    if (isEditMode && currentGameId) {
      updateGameSettings(currentGameId, {
        gameName: gameName.trim(),
        startingPoints,
        winningPoints: winningPoints === '' ? null : Number(winningPoints),
      });
    } else {
      const newGame = createNewGame(gameName.trim());
      newGame.settings.startingPoints = startingPoints;
      newGame.settings.winningPoints =
        winningPoints === '' ? null : Number(winningPoints);
      addGame(newGame);
    }

    closeModal('gameSettings');
    setGameName('');
    setStartingPoints(0);
    setWinningPoints('');
  };

  const handleEditPlayerName = (playerId: string, currentName: string) => {
    setEditingPlayerId(playerId);
    setEditingPlayerName(currentName);
  };

  const handleSavePlayerName = (playerId: string) => {
    if (!editingPlayerName.trim()) return;
    // TODO: Implement rename player logic
    setEditingPlayerId(null);
    setEditingPlayerName('');
  };

  const handleDeletePlayer = (playerId: string) => {
    // TODO: Implement delete player logic
  };

  const playerArray = editingGame ? Object.values(editingGame.players) : [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={() => closeModal('gameSettings')}
        >
          X
        </button>
        <h2>{isEditMode ? 'Edit Game Settings' : 'Create New Game'}</h2>
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
          {isEditMode && playerArray.length > 0 && (
            <div className={styles.playersSection}>
              <h3 className={styles.sectionTitle}>Players</h3>
              <div className={styles.playerList}>
                {playerArray.map((player) => (
                  <div key={player.id} className={styles.playerItem}>
                    {editingPlayerId === player.id ? (
                      <>
                        <input
                          className={styles.playerInput}
                          type="text"
                          value={editingPlayerName}
                          onChange={(e) => setEditingPlayerName(e.target.value)}
                          autoFocus
                        />
                        <button
                          className={styles.saveButton}
                          type="button"
                          onClick={() => handleSavePlayerName(player.id)}
                        >
                          Save
                        </button>
                        <button
                          className={styles.cancelEditButton}
                          type="button"
                          onClick={() => setEditingPlayerId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={styles.playerName}>{player.name}</span>
                        <div className={styles.playerActions}>
                          <button
                            className={styles.renameButton}
                            type="button"
                            onClick={() => handleEditPlayerName(player.id, player.name)}
                          >
                            Rename
                          </button>
                          <button
                            className={styles.deletePlayerButton}
                            type="button"
                            onClick={() => handleDeletePlayer(player.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.buttons}>
            <button className={styles.submitButton} type="submit">
              {isEditMode ? 'Save' : 'Create'}
            </button>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => closeModal('gameSettings')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
