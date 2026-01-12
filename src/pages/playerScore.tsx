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

  if (!currentPlayerId || !currentGameId) return null;

  const game = games[currentGameId];
  if (!game) return null;

  const player = game.players[currentPlayerId];
  if (!player) return null;

  const [newScore, setNewScore] = useState(player.score);
  const [inputValue, setInputValue] = useState(player.score.toString());
  const difference = newScore - player.score;
  const pointsAway = game.settings.winningPoints
    ? game.settings.winningPoints - player.score
    : null;

  const updateScore = (val: number) => {
    setNewScore(val);
    setInputValue(val.toString());
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || value === '-') {
      setInputValue(value);
      setNewScore(0);
      return;
    }

    const cleaned = value.replace(/^0+(?=\d)/, '');
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed)) {
      setInputValue(cleaned);
      setNewScore(parsed);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setCurrentPlayerId(null);
          setCurrentScene('gamePage');
        }}
      >
        Back to Scores
      </button>
      <h1>{game.gameName}</h1>
      <h2>{player.name}</h2>
      <button onClick={() => openModal('scoreHistory')}>View History</button>

      <p>Current Score: {player.score}</p>

      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleScoreChange}
        onFocus={(e) => e.target.select()}
      />
      <button onClick={() => updateScore(newScore - 1)}>-</button>
      <button onClick={() => updateScore(newScore + 1)}>+</button>

      <button
        onClick={() =>
          openCalculator(
            (result) => updateScore(Math.round(result)),
            player.score
          )
        }
      >
        Calculator
      </button>

      <p>
        Difference: {difference >= 0 ? '+' : ''}
        {difference}
      </p>

      {pointsAway !== null && (
        <p>Points to Win: {pointsAway > 0 ? pointsAway : 'Winner!'}</p>
      )}

      <button
        onClick={() =>
          updatePlayerScore(currentGameId, currentPlayerId, newScore)
        }
        disabled={difference === 0}
      >
        Apply
      </button>
    </div>
  );
}
