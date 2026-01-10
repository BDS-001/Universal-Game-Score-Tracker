import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';
import styles from './ScoreHistoryModal.module.css';

export default function ScoreHistoryModal() {
  const { closeModal } = useUIContext();
  const { games, currentGameId, currentPlayerId } = useGameContext();

  if (!currentGameId || !currentPlayerId) return null;

  const game = games[currentGameId];
  if (!game) return null;

  const player = game.players[currentPlayerId];
  if (!player) return null;

  const history = [...player.scoreHistory].reverse();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={() => closeModal('scoreHistory')}
        >
          ×
        </button>
        <h2>Score History - {player.name}</h2>
        <div className={styles.historyList}>
          {history.length === 0 ? (
            <p className={styles.noHistory}>No score history yet</p>
          ) : (
            history.map((entry, index) => (
              <div key={index} className={styles.historyItem}>
                <div className={styles.timestamp}>
                  {formatDate(entry.timestamp)}
                </div>
                <div className={styles.scoreChange}>
                  <span
                    className={
                      entry.change >= 0 ? styles.positive : styles.negative
                    }
                  >
                    {entry.change >= 0 ? '+' : ''}
                    {entry.change}
                  </span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.newTotal}>{entry.newTotal}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
