import { useUIContext } from '../context/UIContext';
import GameSelector from '../pages/gameSelect';
import GameScore from '../pages/gameScore';
import PlayerScore from '../pages/playerScore';
import GameSettingsModal from '../components/GameSettingsModal';
import NewPlayerModal from '../components/NewPlayerModal';
import ScoreHistoryModal from '../components/ScoreHistoryModal';
import ConfirmationModal from '../components/ConfirmationModal';
import CalculatorModal from '../components/CalculatorModal';

function App() {
  const { currentScene, modals, calculatorCallback, calculatorCurrentScore } =
    useUIContext();

  return (
    <div>
      {currentScene === 'gameList' && <GameSelector />}
      {currentScene === 'gamePage' && <GameScore />}
      {currentScene === 'playerScore' && <PlayerScore />}
      {modals.gameSettings && <GameSettingsModal />}
      {modals.newPlayer && <NewPlayerModal />}
      {modals.scoreHistory && <ScoreHistoryModal />}
      {modals.calculator && (
        <CalculatorModal
          onCalculate={calculatorCallback || undefined}
          currentScore={calculatorCurrentScore}
        />
      )}
      {modals.confirmation && <ConfirmationModal />}
    </div>
  );
}

export default App;
