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
        <button
          className="modal-close"
          onClick={() => closeModal('scoreHistory')}
        >
          ×
        </button>
        <h2>Score History - {player.name}</h2>
        <div
          style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}
        >
          {history.length === 0 ? (
            <p
              style={{
                color: '#666',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              No score history yet
            </p>
          ) : (
            history.map((entry, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom:
                    index === history.length - 1 ? 'none' : '1px solid #e0e0e0',
                }}
              >
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  {formatDate(entry.timestamp)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  <span
                    style={{ color: entry.change >= 0 ? '#28a745' : '#dc3545' }}
                  >
                    {entry.change >= 0 ? '+' : ''}
                    {entry.change}
                  </span>
                  <span style={{ color: '#666', fontWeight: 'normal' }}>→</span>
                  <span
                    style={{
                      color: '#333',
                      minWidth: '60px',
                      textAlign: 'right',
                    }}
                  >
                    {entry.newTotal}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
