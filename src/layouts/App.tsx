import { useUIContext } from '../context/UIContext';
import GameSelector from '../pages/gameSelect';
import GameScore from '../pages/gameScore';
import PlayerScore from '../pages/playerScore';
import NewGameModal from '../components/NewGameModal';
import NewPlayerModal from '../components/NewPlayerModal';
import ScoreHistoryModal from '../components/ScoreHistoryModal';

function App() {
  const { currentScene, modals } = useUIContext();

  return (
    <div>
      {currentScene === 'gameList' && <GameSelector />}
      {currentScene === 'gamePage' && <GameScore />}
      {currentScene === 'playerScore' && <PlayerScore />}
      {modals.newGame && <NewGameModal />}
      {modals.newPlayer && <NewPlayerModal />}
      {modals.scoreHistory && <ScoreHistoryModal />}
    </div>
  );
}

export default App;
