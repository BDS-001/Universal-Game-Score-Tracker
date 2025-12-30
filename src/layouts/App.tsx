import { useGameContext } from '../context/GameContext';
import GameSelector from '../pages/gameSelect';

function App() {
  const { testFunction } = useGameContext();

  return (
    <div>
      <button onClick={testFunction}>Test Context</button>
      <GameSelector />
    </div>
  );
}

export default App;
