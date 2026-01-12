import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';

export default function GameSelector() {
  const { games, setCurrentGameId, deleteGame } = useGameContext();
  const { openModal, setCurrentScene, showConfirmation } = useUIContext();

  const handleGameClick = (gameId: string) => {
    setCurrentGameId(gameId);
    setCurrentScene('gamePage');
  };

  const handleDeleteGame = (
    e: React.MouseEvent,
    gameId: string,
    gameName: string
  ) => {
    e.stopPropagation();
    showConfirmation({
      title: 'Delete Game',
      message: `Are you sure you want to delete "${gameName}"? This will delete all players and scores. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        deleteGame(gameId);
      },
    });
  };

  return (
    <div>
      <h1>Games</h1>
      <button onClick={() => openModal('gameSettings')}>Create New Game</button>
      {Object.entries(games).map(([key, game]) => (
        <div key={key}>
          <button onClick={() => handleGameClick(key)}>{game.gameName}</button>
          <button onClick={(e) => handleDeleteGame(e, key, game.gameName)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
