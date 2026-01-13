import { useUIContext } from '../context/UIContext';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal() {
  const { closeModal, confirmationData } = useUIContext();

  if (!confirmationData) return null;

  return (
    <div className={`modal-overlay ${styles.overlay}`}>
      <div className="modal-content">
        <h2 className="modal-title">{confirmationData.title}</h2>
        <p className={styles.message}>{confirmationData.message}</p>
        <div className={styles.actions}>
          <button onClick={() => closeModal('confirmation')}>
            {confirmationData.cancelText || 'Cancel'}
          </button>
          <button
            className={styles.confirmButton}
            onClick={() => {
              confirmationData.onConfirm();
              closeModal('confirmation');
            }}
          >
            {confirmationData.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
