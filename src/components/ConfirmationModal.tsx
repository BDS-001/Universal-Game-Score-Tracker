import { useUIContext } from '../context/UIContext';

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
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h2>{confirmationData.title}</h2>
        <p style={{ color: '#666', lineHeight: 1.5 }}>
          {confirmationData.message}
        </p>
        <div className="form-buttons" style={{ justifyContent: 'flex-end' }}>
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
