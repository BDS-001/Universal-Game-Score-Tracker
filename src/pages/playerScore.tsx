import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import { useState } from 'react';

export default function PlayerScore() {
  const {
    games,
    currentPlayerId,
    setCurrentPlayerId,
    currentGameId,
    updatePlayerScore,
  } = useGameContext();
  const { setCurrentScene, openModal, openCalculator } = useUIContext();

  function returnToScorePage() {
    setCurrentPlayerId(null);
    setCurrentScene('gamePage');
  }

  if (!currentPlayerId || !currentGameId) {
    return null;
  }

  const game = games[currentGameId];
  if (!game) {
    return null;
  }

  const { gameName, players, settings } = game;
  const player = players[currentPlayerId];

  if (!player) {
    return null;
  }

  const [newScore, setNewScore] = useState(player.score);
  const [inputValue, setInputValue] = useState(player.score.toString());
  const difference = newScore - player.score;
  const pointsAway = settings.winningPoints
    ? settings.winningPoints - player.score
    : null;

  const handleIncrement = () => {
    const newVal = newScore + 1;
    setNewScore(newVal);
    setInputValue(newVal.toString());
  };

  const handleDecrement = () => {
    const newVal = newScore - 1;
    setNewScore(newVal);
    setInputValue(newVal.toString());
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || value === '-') {
      setInputValue(value);
      setNewScore(0);
      return;
    }

    let cleaned = value.replace(/^0+(?=\d)/, '');

    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed)) {
      setInputValue(cleaned);
      setNewScore(parsed);
    }
  };

  const handleApply = () => {
    updatePlayerScore(currentGameId, currentPlayerId, newScore);
  };

  const handleCalculatorResult = (result: number) => {
    const rounded = Math.round(result);
    setNewScore(rounded);
    setInputValue(rounded.toString());
  };

  return (
    <div>
      <button onClick={returnToScorePage}>Back to Scores</button>
      <h1>{gameName}</h1>
      <h2>{player.name}</h2>
      <button onClick={() => openModal('scoreHistory')}>View History</button>

      <div>
        <span>Current Score: </span>
        <span>{player.score}</span>
      </div>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleScoreChange}
        onFocus={(e) => e.target.select()}
      />
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleIncrement}>+</button>

      <button
        onClick={() => openCalculator(handleCalculatorResult, player.score)}
      >
        Calculator
      </button>

      <div>
        <span>Difference: </span>
        <span>
          {difference >= 0 ? '+' : ''}
          {difference}
        </span>
      </div>

      {pointsAway !== null && (
        <div>
          <span>Points to Win: </span>
          <span>{pointsAway > 0 ? pointsAway : 'Winner!'}</span>
        </div>
      )}

      <button onClick={handleApply} disabled={difference === 0}>
        Apply
      </button>
    </div>
  );
}
