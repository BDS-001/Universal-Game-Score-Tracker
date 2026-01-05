import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import styles from './playerScore.module.css';
import { useState } from 'react';

export default function PlayerScore() {
  const {
    games,
    currentPlayerId,
    setCurrentPlayerId,
    currentGameId,
    updatePlayerScore,
  } = useGameContext();
  const { setCurrentScene, openModal } = useUIContext();

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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={returnToScorePage}>
            Back to Scores
          </button>
          <h1 className={styles.title}>{gameName}</h1>
          <h2 className={styles.playerName}>{player.name}</h2>
          <button
            className={styles.historyButton}
            onClick={() => openModal('scoreHistory')}
          >
            View History
          </button>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.currentScore}>
            <span className={styles.label}>Current Score:</span>
            <span className={styles.value}>{player.score}</span>
          </div>

          <div className={styles.scoreControls}>
            <button
              className={styles.decrementButton}
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={styles.newScore}
              value={inputValue}
              onChange={handleScoreChange}
              onFocus={(e) => e.target.select()}
            />
            <button
              className={styles.incrementButton}
              onClick={handleIncrement}
            >
              +
            </button>
          </div>

          <div className={styles.difference}>
            <span className={styles.label}>Difference:</span>
            <span
              className={difference >= 0 ? styles.positive : styles.negative}
            >
              {difference >= 0 ? '+' : ''}
              {difference}
            </span>
          </div>

          {pointsAway !== null && (
            <div className={styles.pointsToWin}>
              <span className={styles.label}>Points to Win:</span>
              <span
                className={pointsAway > 0 ? styles.pointsAway : styles.winner}
              >
                {pointsAway > 0 ? pointsAway : 'Winner!'}
              </span>
            </div>
          )}

          <button
            className={styles.applyButton}
            onClick={handleApply}
            disabled={difference === 0}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
