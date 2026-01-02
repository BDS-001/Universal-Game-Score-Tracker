import { useUIContext } from '../context/UIContext';
import GameSelector from '../pages/gameSelect';
import GameScore from '../pages/gameScore';
import NewGameModal from '../components/NewGameModal';

function App() {
  const { currentScene, modals } = useUIContext();

  return (
    <div>
      {currentScene === 'gameList' && <GameSelector />}
      {currentScene === 'gamePage' && <GameScore />}
      {modals.newGame && <NewGameModal />}
    </div>
  );
}

export default App;
