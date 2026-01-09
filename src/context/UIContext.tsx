import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalState {
  gameSettings: boolean;
  newPlayer: boolean;
  calculator: boolean;
  scoreHistory: boolean;
  confirmation: boolean;
}

export interface ConfirmationData {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface UIContextType {
  currentScene: string;
  setCurrentScene: (scene: string) => void;
  modals: ModalState;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
  confirmationData: ConfirmationData | null;
  showConfirmation: (data: ConfirmationData) => void;
  calculatorCallback: ((result: number) => void) | null;
  calculatorCurrentScore: number | undefined;
  openCalculator: (
    callback: (result: number) => void,
    currentScore?: number
  ) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState('gameList');

  const [modals, setModals] = useState<ModalState>({
    gameSettings: false,
    newPlayer: false,
    calculator: false,
    scoreHistory: false,
    confirmation: false,
  });

  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);

  const [calculatorCallback, setCalculatorCallback] = useState<
    ((result: number) => void) | null
  >(null);

  const [calculatorCurrentScore, setCalculatorCurrentScore] = useState<
    number | undefined
  >(undefined);

  const openModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
    if (modal === 'confirmation') {
      setConfirmationData(null);
    }
    if (modal === 'calculator') {
      setCalculatorCallback(null);
      setCalculatorCurrentScore(undefined);
    }
  };

  const showConfirmation = (data: ConfirmationData) => {
    setConfirmationData(data);
    openModal('confirmation');
  };

  const openCalculator = (
    callback: (result: number) => void,
    currentScore?: number
  ) => {
    setCalculatorCallback(() => callback);
    setCalculatorCurrentScore(currentScore);
    openModal('calculator');
  };

  return (
    <UIContext.Provider
      value={{
        currentScene,
        setCurrentScene,
        modals,
        openModal,
        closeModal,
        confirmationData,
        showConfirmation,
        calculatorCallback,
        calculatorCurrentScore,
        openCalculator,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIProvider');
  }
  return context;
};
