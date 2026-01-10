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
      <div className={`modal-content ${styles.content}`}>
        <h2>{confirmationData.title}</h2>
        <p className={styles.message}>{confirmationData.message}</p>
        <div className={`form-buttons ${styles.buttons}`}>
          <button className="btn" onClick={handleCancel}>
            {confirmationData.cancelText || 'Cancel'}
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            {confirmationData.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
