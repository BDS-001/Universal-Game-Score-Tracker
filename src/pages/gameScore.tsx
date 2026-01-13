import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';

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
    <div>
      <button
        onClick={() => {
          setCurrentScene('gameList');
          setCurrentGameId(null);
          setCurrentPlayerId(null);
        }}
      >
        Back to Games
      </button>
      <h1>{game.gameName}</h1>
      <button onClick={() => openModal('gameSettings')}>Settings</button>
      <button onClick={() => openModal('newPlayer')}>Add Player</button>
      {game.settings.winningPoints && (
        <div>Winning Score: {game.settings.winningPoints}</div>
      )}

      <h2>Players</h2>
      {playerArray.length === 0 ? (
        <p>No players yet</p>
      ) : (
        playerArray.map((player) => (
          <button
            key={player.id}
            onClick={() => {
              setCurrentPlayerId(player.id);
              setCurrentScene('playerScore');
            }}
          >
            {player.name} - {player.score}
          </button>
        ))
      )}
    </div>
  );
}
