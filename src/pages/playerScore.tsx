import { useGameContext } from '../context/GameContext';
import { useUIContext } from '../context/UIContext';
import { useState } from 'react';
import styles from './playerScore.module.css';

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
  const [scoreAnimKey, setScoreAnimKey] = useState(0);
  const [inputAnimKey, setInputAnimKey] = useState(0);
  const difference = newScore - player.score;
  const pointsAway = game.settings.winningPoints
    ? game.settings.winningPoints - player.score
    : null;

  const updateScore = (val: number) => {
    setNewScore(val);
    setInputValue(val.toString());
    setInputAnimKey((key) => key + 1);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || value === '-') {
      setInputValue(value);
      setNewScore(0);
      setInputAnimKey((key) => key + 1);
      return;
    }

    const cleaned = value.replace(/^0+(?=\d)/, '');
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed)) {
      setInputValue(cleaned);
      setNewScore(parsed);
      setInputAnimKey((key) => key + 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => {
            setCurrentPlayerId(null);
            setCurrentScene('gamePage');
          }}
        >
          ← Back
        </button>
        <h1 className={styles.playerName}>{player.name}</h1>
      </div>

      <button
        className={styles.historyButton}
        onClick={() => openModal('scoreHistory')}
      >
        View History
      </button>

      <div className={styles.scoreSection}>
        <div className={styles.currentScore}>
          <div className={styles.label}>Current Score</div>
          <div
            key={scoreAnimKey}
            className={`${styles.score} ${scoreAnimKey > 0 ? styles.animated : ''}`}
          >
            {player.score}
          </div>
        </div>

        <div className={styles.scoreEditor}>
          <div className={styles.label}>New Score</div>
          <div className={styles.inputWrapper}>
            <input
              className={styles.scoreInput}
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleScoreChange}
              onFocus={(e) => e.target.select()}
            />
            <span
              key={inputAnimKey}
              className={`${styles.scoreOverlay} ${inputAnimKey > 0 ? styles.animated : ''}`}
            >
              {inputValue}
            </span>
          </div>
          <div className={styles.incrementButtons}>
            <button
              className={styles.decrementButton}
              onClick={() => updateScore(newScore - 1)}
            >
              −1
            </button>
            <button
              className={styles.incrementButton}
              onClick={() => updateScore(newScore + 1)}
            >
              +1
            </button>
          </div>
          <button
            className={styles.calculatorButton}
            onClick={() =>
              openCalculator(
                (result) => updateScore(Math.round(result)),
                player.score
              )
            }
          >
            Calculator
          </button>
          <button
            className={styles.applyButton}
            onClick={() => {
              updatePlayerScore(currentGameId, currentPlayerId, newScore);
              setScoreAnimKey((k) => k + 1);
            }}
            disabled={difference === 0}
          >
            Apply Score
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <div
          className={`${styles.infoCard} ${difference === 0 ? styles.hidden : ''}`}
        >
          <span className={styles.infoLabel}>Change:</span>
          <span className={difference >= 0 ? styles.positive : styles.negative}>
            {difference >= 0 ? '+' : ''}
            {difference}
          </span>
        </div>

        {pointsAway !== null && pointsAway > 0 && (
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>To Win:</span>
            <span className={styles.infoValue}>{pointsAway}</span>
          </div>
        )}

        {pointsAway !== null && pointsAway <= 0 && (
          <div className={styles.winnerCard}>Winner!</div>
        )}
      </div>
    </div>
  );
}
