import { useUIContext } from '../context/UIContext';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal() {
  const { closeModal, confirmationData } = useUIContext();

  if (!confirmationData) return null;

  return (
    <div className={`modal-overlay ${styles.overlay}`}>
      <div className="modal-content">
        <h2>{confirmationData.title}</h2>
        <p>{confirmationData.message}</p>
        <button onClick={() => closeModal('confirmation')}>
          {confirmationData.cancelText || 'Cancel'}
        </button>
        <button
          onClick={() => {
            confirmationData.onConfirm();
            closeModal('confirmation');
          }}
        >
          {confirmationData.confirmText || 'Confirm'}
        </button>
      </div>
    </div>
  );
}
