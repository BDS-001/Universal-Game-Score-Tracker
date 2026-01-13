import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import styles from './gameScore.module.css';

export default function GameScore() {
  const { games, currentGameId, setCurrentPlayerId, setCurrentGameId } =
    useGameContext();
  const { setCurrentScene, openModal } = useUIContext();

  if (!currentGameId || !games[currentGameId]) {
    return <div>No game selected</div>;
  }

  const game = games[currentGameId];
  const playerArray = Object.values(game.players);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => {
            setCurrentScene('gameList');
            setCurrentGameId(null);
            setCurrentPlayerId(null);
          }}
        >
          ← Back
        </button>
        <h1 className={styles.title}>{game.gameName}</h1>
        <div className={styles.headerActions}>
          <button onClick={() => openModal('gameSettings')}>Settings</button>
          <button
            className={styles.addPlayerButton}
            onClick={() => openModal('newPlayer')}
          >
            + Add Player
          </button>
        </div>
      </div>

      {game.settings.winningPoints && (
        <div className={styles.winningScore}>
          Win at: {game.settings.winningPoints}
        </div>
      )}

      <h2 className={styles.playersTitle}>Players</h2>
      {playerArray.length === 0 ? (
        <p className={styles.emptyMessage}>
          No players yet. Add one to get started!
        </p>
      ) : (
        <div className={styles.playersList}>
          {playerArray.map((player) => (
            <button
              key={player.id}
              className={styles.playerCard}
              onClick={() => {
                setCurrentPlayerId(player.id);
                setCurrentScene('playerScore');
              }}
            >
              <span className={styles.playerName}>{player.name}</span>
              <span className={styles.playerScore}>{player.score}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
