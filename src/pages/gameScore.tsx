import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';

export default function GameScore() {
  const { games, currentGameId } = useGameContext();
  const { setCurrentScene } = useUIContext();

  if (!currentGameId || !games[currentGameId]) {
    return <div>No game selected</div>;
  }

  const game = games[currentGameId];
  const { gameName, settings, players } = game;

  return (
    <>
      <button onClick={() => setCurrentScene('gameList')}>Back to Games</button>
      <h1>{gameName}</h1>
      <button>Settings</button>
      <button>Add Player</button>
      {settings.winningPoints && <div>Winning Score: {settings.winningPoints}</div>}
      <div>
        <h2>Players</h2>
        {players.length === 0 ? (
          <p>No players yet</p>
        ) : (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name} - {player.score}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
