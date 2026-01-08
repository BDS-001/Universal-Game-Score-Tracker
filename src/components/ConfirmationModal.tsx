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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{confirmationData.title}</h2>
        <p className={styles.message}>{confirmationData.message}</p>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            {confirmationData.confirmText || 'Confirm'}
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            {confirmationData.cancelText || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
