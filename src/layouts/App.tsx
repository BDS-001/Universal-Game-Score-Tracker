import { useUIContext } from '../context/UIContext';
import GameSelector from '../pages/gameSelect';
import NewGameModal from '../components/NewGameModal';

function App() {
  const { currentScene, modals } = useUIContext();

  return (
    <div>
      {currentScene === 'gameList' && <GameSelector />}
      {currentScene === 'gamePage' && <div>Game Page (TODO)</div>}
      {modals.newGame && <NewGameModal />}
    </div>
  );
}

export default App;
