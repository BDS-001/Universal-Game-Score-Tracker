import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import styles from './gameSelect.module.css';

export default function GameSelector() {
  const { games, setCurrentGameId } = useGameContext();
  const { openModal, setCurrentScene } = useUIContext();

  const handleGameClick = (gameId: string) => {
    setCurrentGameId(gameId);
    setCurrentScene('gamePage');
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
          <button
            key={key}
            className={styles.gameButton}
            onClick={() => handleGameClick(key)}
          >
            {game.gameName}
          </button>
        ))}
      </div>
    </div>
  );
}
