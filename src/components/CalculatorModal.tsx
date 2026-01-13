import { useUIContext } from '../context/UIContext';
import { useState } from 'react';
import Mexp from 'math-expression-evaluator';
import styles from './CalculatorModal.module.css';

interface CalculatorModalProps {
  onCalculate?: (result: number) => void;
  currentScore?: number;
}

export default function CalculatorModal({
  onCalculate,
  currentScore,
}: CalculatorModalProps) {
  const { closeModal } = useUIContext();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const validateExpression = (expr: string): boolean => {
    const validChars = /^[\d+\-*/().\s]*$/;
    return validChars.test(expr);
  };

  const evaluateExpression = (expr: string): number | null => {
    if (!expr.trim() || !validateExpression(expr)) {
      return null;
    }

    try {
      const calculatedResult = new Mexp().eval(expr);
      return typeof calculatedResult === 'number' && isFinite(calculatedResult)
        ? calculatedResult
        : null;
    } catch {
      return null;
    }
  };

  const calculateResult = (expr: string) => {
    setResult(evaluateExpression(expr));
  };

  const handleButtonClick = (value: string) => {
    const newExpression = expression + value;
    setExpression(newExpression);
    calculateResult(newExpression);
  };

  const handleClear = () => {
    setExpression('');
    setResult(null);
  };

  const handleBackspace = () => {
    const newExpression = expression.slice(0, -1);
    setExpression(newExpression);
    calculateResult(newExpression);
  };

  const handleAddCurrentScore = () => {
    if (currentScore !== undefined) {
      const newExpression = expression + currentScore.toString();
      setExpression(newExpression);
      calculateResult(newExpression);
    }
  };

  const handleCalculate = () => {
    const calculatedResult = evaluateExpression(expression);
    if (calculatedResult !== null) {
      setExpression(`${calculatedResult}`);
    }
  };

  const handleApply = () => {
    if (result !== null && onCalculate) {
      onCalculate(result);
      closeModal('calculator');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExpression = e.target.value;
    setExpression(newExpression);
    calculateResult(newExpression);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCalculate();
    } else if (e.key === 'Escape') {
      closeModal('calculator');
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${styles.calculator}`}>
        <button
          className="modal-close"
          onClick={() => closeModal('calculator')}
        >
          ×
        </button>
        <h2 className="modal-title">Calculator</h2>

        <div className={styles.display}>
          <input
            className={styles.input}
            type="text"
            value={expression}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="0"
            autoFocus
          />
          {result !== null && <div className={styles.result}>= {result}</div>}
        </div>

        {currentScore !== undefined && (
          <button
            className={styles.currentScoreButton}
            onClick={handleAddCurrentScore}
            type="button"
          >
            Current Score ({currentScore})
          </button>
        )}

        <div className={styles.buttonGrid}>
          <button onClick={handleClear} type="button">
            C
          </button>
          <button onClick={handleBackspace} type="button">
            ←
          </button>
          <button onClick={() => handleButtonClick('(')} type="button">
            (
          </button>
          <button onClick={() => handleButtonClick(')')} type="button">
            )
          </button>

          <button onClick={() => handleButtonClick('7')} type="button">
            7
          </button>
          <button onClick={() => handleButtonClick('8')} type="button">
            8
          </button>
          <button onClick={() => handleButtonClick('9')} type="button">
            9
          </button>
          <button
            className={styles.operator}
            onClick={() => handleButtonClick('/')}
            type="button"
          >
            ÷
          </button>

          <button onClick={() => handleButtonClick('4')} type="button">
            4
          </button>
          <button onClick={() => handleButtonClick('5')} type="button">
            5
          </button>
          <button onClick={() => handleButtonClick('6')} type="button">
            6
          </button>
          <button
            className={styles.operator}
            onClick={() => handleButtonClick('*')}
            type="button"
          >
            ×
          </button>

          <button onClick={() => handleButtonClick('1')} type="button">
            1
          </button>
          <button onClick={() => handleButtonClick('2')} type="button">
            2
          </button>
          <button onClick={() => handleButtonClick('3')} type="button">
            3
          </button>
          <button
            className={styles.operator}
            onClick={() => handleButtonClick('-')}
            type="button"
          >
            −
          </button>

          <button onClick={() => handleButtonClick('0')} type="button">
            0
          </button>
          <button onClick={() => handleButtonClick('.')} type="button">
            .
          </button>
          <button
            className={styles.operator}
            onClick={() => handleButtonClick('+')}
            type="button"
          >
            +
          </button>
          <button
            className={styles.equals}
            onClick={handleCalculate}
            type="button"
          >
            =
          </button>
        </div>

        <button
          className={styles.applyButton}
          onClick={handleApply}
          type="button"
          disabled={result === null}
        >
          Apply to Score
        </button>
      </div>
    </div>
  );
}
