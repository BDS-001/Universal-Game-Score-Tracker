import { useUIContext } from '../context/UIContext';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal() {
  const { closeModal, confirmationData } = useUIContext();

  if (!confirmationData) return null;

  const handleConfirm = () => {
    confirmationData.onConfirm();
    closeModal('confirmation');
  };

  const handleCancel = () => {
    closeModal('confirmation');
  };

  return (
    <div className={`modal-overlay ${styles.overlay}`}>
      <div className="modal-content">
        <h2>{confirmationData.title}</h2>
        <p>{confirmationData.message}</p>
        <button onClick={handleCancel}>
          {confirmationData.cancelText || 'Cancel'}
        </button>
        <button onClick={handleConfirm}>
          {confirmationData.confirmText || 'Confirm'}
        </button>
      </div>
    </div>
  );
}
