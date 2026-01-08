import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import styles from './gameSelect.module.css';

export default function GameSelector() {
  const { games, setCurrentGameId, deleteGame } = useGameContext();
  const { openModal, setCurrentScene, showConfirmation } = useUIContext();

  const handleGameClick = (gameId: string) => {
    setCurrentGameId(gameId);
    setCurrentScene('gamePage');
  };

  const handleDeleteGame = (
    e: React.MouseEvent,
    gameId: string,
    gameName: string
  ) => {
    e.stopPropagation();
    showConfirmation({
      title: 'Delete Game',
      message: `Are you sure you want to delete "${gameName}"? This will delete all players and scores. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        deleteGame(gameId);
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Games</div>
      <button
        className={styles.createButton}
        onClick={() => openModal('gameSettings')}
      >
        Create New Game
      </button>
      <div className={styles.gameList}>
        {Object.entries(games).map(([key, game]) => (
          <div key={key} className={styles.gameItem}>
            <button
              className={styles.gameButton}
              onClick={() => handleGameClick(key)}
            >
              {game.gameName}
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDeleteGame(e, key, game.gameName)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
