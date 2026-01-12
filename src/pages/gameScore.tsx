import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';

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
    <div>
      <button onClick={() => setCurrentScene('gameList')}>Back to Games</button>
      <h1>{gameName}</h1>
      <button onClick={() => openModal('gameSettings')}>Settings</button>
      <button onClick={() => openModal('newPlayer')}>Add Player</button>
      {settings.winningPoints && (
        <div>Winning Score: {settings.winningPoints}</div>
      )}

      <h2>Players</h2>
      {playerArray.length === 0 ? (
        <p>No players yet</p>
      ) : (
        <div>
          {playerArray.map((player) => (
            <button key={player.id} onClick={() => goToPlayerScore(player.id)}>
              <span>{player.name}</span>
              <span>{player.score}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
