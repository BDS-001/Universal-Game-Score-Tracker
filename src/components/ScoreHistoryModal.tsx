import { useUIContext } from '../context/UIContext';
import { useGameContext } from '../context/GameContext';

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
        <button onClick={() => closeModal('scoreHistory')}>×</button>
        <h2>Score History - {player.name}</h2>
        <div>
          {history.length === 0 ? (
            <p>No score history yet</p>
          ) : (
            history.map((entry, index) => (
              <div key={index}>
                <div>{formatDate(entry.timestamp)}</div>
                <div>
                  <span>
                    {entry.change >= 0 ? '+' : ''}
                    {entry.change}
                  </span>
                  <span> → </span>
                  <span>{entry.newTotal}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
