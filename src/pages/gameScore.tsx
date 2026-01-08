import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import styles from './gameScore.module.css';

export default function GameScore() {
  const { games, currentGameId, setCurrentPlayerId } = useGameContext();
  const { setCurrentScene, openModal } = useUIContext();

  function goToPlayerScore(playerId: string) {
    setCurrentPlayerId(playerId);
    setCurrentScene('playerScore');
  }
  if (!currentGameId || !games[currentGameId]) {
    return <div>No game selected</div>;
  }

  const game = games[currentGameId];
  const { gameName, settings, players } = game;
  const playerArray = Object.values(players);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => setCurrentScene('gameList')}
        >
          Back to Games
        </button>
        <h1 className={styles.title}>{gameName}</h1>
        <div className={styles.actions}>
          <button
            className={styles.settingsButton}
            onClick={() => openModal('gameSettings')}
          >
            Settings
          </button>
          <button
            className={styles.addPlayerButton}
            onClick={() => openModal('newPlayer')}
          >
            Add Player
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => {
              // TODO: Implement delete game logic
            }}
          >
            Delete Game
          </button>
        </div>
        {settings.winningPoints && (
          <div className={styles.winningScore}>
            Winning Score: {settings.winningPoints}
          </div>
        )}
      </div>
      <div className={styles.playersSection}>
        <h2 className={styles.playersTitle}>Players</h2>
        {playerArray.length === 0 ? (
          <p className={styles.noPlayers}>No players yet</p>
        ) : (
          <div className={styles.playerList}>
            {playerArray.map((player) => (
              <button
                key={player.id}
                className={styles.playerButton}
                onClick={() => goToPlayerScore(player.id)}
              >
                <span>{player.name}</span>
                <span>{player.score}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
