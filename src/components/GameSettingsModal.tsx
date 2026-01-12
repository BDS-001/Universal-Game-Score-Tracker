import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import { createNewGame } from '../templates/gameTemplates';

export default function GameSettingsModal() {
  const { closeModal, showConfirmation } = useUIContext();
  const {
    games,
    currentGameId,
    addGame,
    updateGameSettings,
    updatePlayerName,
    deletePlayer,
    isGameNameTaken,
    isPlayerNameTaken,
  } = useGameContext();

  const editingGame = currentGameId ? games[currentGameId] : null;
  const isEditMode = !!editingGame;

  const [gameName, setGameName] = useState('');
  const [startingPoints, setStartingPoints] = useState(0);
  const [winningPoints, setWinningPoints] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');

  const trimmedGameName = useMemo(() => gameName.trim(), [gameName]);

  const resetForm = useCallback(() => {
    setGameName('');
    setStartingPoints(0);
    setWinningPoints('');
  }, []);

  useEffect(() => {
    if (editingGame) {
      setGameName(editingGame.gameName);
      setStartingPoints(editingGame.settings.startingPoints);
      setWinningPoints(editingGame.settings.winningPoints?.toString() || '');
    } else {
      resetForm();
    }
  }, [editingGame, resetForm]);

  const nameTaken =
    trimmedGameName &&
    isGameNameTaken(trimmedGameName) &&
    (!isEditMode || trimmedGameName !== editingGame?.gameName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedGameName || nameTaken) return;

    if (isEditMode && currentGameId) {
      updateGameSettings(currentGameId, {
        gameName: trimmedGameName,
        startingPoints,
        winningPoints: winningPoints === '' ? null : Number(winningPoints),
      });
    } else {
      const newGame = createNewGame(trimmedGameName);
      newGame.settings.startingPoints = startingPoints;
      newGame.settings.winningPoints =
        winningPoints === '' ? null : Number(winningPoints);
      addGame(newGame);
    }

    closeModal('gameSettings');
    resetForm();
  };

  const handleEditPlayerName = (playerId: string, currentName: string) => {
    setEditingPlayerId(playerId);
    setEditingPlayerName(currentName);
  };

  const handleSavePlayerName = (playerId: string) => {
    if (!currentGameId) return;

    updatePlayerName(currentGameId, playerId, editingPlayerName.trim());
    setEditingPlayerId(null);
    setEditingPlayerName('');
  };

  const handleDeletePlayer = (playerId: string) => {
    const player = editingGame?.players[playerId];
    if (!player || !currentGameId) return;

    showConfirmation({
      title: 'Delete Player',
      message: `Are you sure you want to delete "${player.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        deletePlayer(currentGameId, playerId);
      },
    });
  };

  const playerArray = editingGame ? Object.values(editingGame.players) : [];

  const isEditingPlayerNameTaken =
    !!editingPlayerId &&
    !!editingPlayerName.trim() &&
    isPlayerNameTaken(editingPlayerName.trim(), currentGameId || '') &&
    editingPlayerName.trim() !== editingGame?.players[editingPlayerId]?.name;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={() => closeModal('gameSettings')}>×</button>
        <h2>{isEditMode ? 'Edit Game Settings' : 'Create New Game'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Game Name:
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              autoFocus
            />
            {nameTaken && <span>Name already taken</span>}
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
          {isEditMode && playerArray.length > 0 && (
            <div>
              <h3>Players</h3>
              <div>
                {playerArray.map((player) => (
                  <div key={player.id}>
                    {editingPlayerId === player.id ? (
                      <>
                        <div>
                          <input
                            type="text"
                            value={editingPlayerName}
                            onChange={(e) =>
                              setEditingPlayerName(e.target.value)
                            }
                            autoFocus
                          />
                          {isEditingPlayerNameTaken && (
                            <span>Name already taken</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSavePlayerName(player.id)}
                          disabled={
                            !editingPlayerName.trim() ||
                            isEditingPlayerNameTaken
                          }
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPlayerId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{player.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleEditPlayerName(player.id, player.name)
                          }
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={() => closeModal('gameSettings')}>
            Cancel
          </button>
          <button type="submit">{isEditMode ? 'Save' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
}
