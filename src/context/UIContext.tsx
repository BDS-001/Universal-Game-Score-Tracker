import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalState {
  newGame: boolean;
  calculator: boolean;
  settings: boolean;
}

interface UIContextType {
  currentScene: string;
  setCurrentScene: (scene: string) => void;
  modals: ModalState;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState('gameList');

  const [modals, setModals] = useState<ModalState>({
    newGame: false,
    calculator: false,
    settings: false,
  });

  const openModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  return (
    <UIContext.Provider
      value={{
        currentScene,
        setCurrentScene,
        modals,
        openModal,
        closeModal,
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
