import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';

export default function GameSelector() {
  const { games, setCurrentGameId } = useGameContext();
  const { openModal, setCurrentScene } = useUIContext();

  const handleGameClick = (gameId: string) => {
    setCurrentGameId(gameId);
    setCurrentScene('gamePage');
  };

  return (
    <>
      <div className="title">Games</div>
      <button onClick={() => openModal('newGame')}>Create New Game</button>
      {Object.entries(games).map(([key, game]) => (
        <button key={key} onClick={() => handleGameClick(key)}>
          {game.gameName}
        </button>
      ))}
    </>
  );
}
