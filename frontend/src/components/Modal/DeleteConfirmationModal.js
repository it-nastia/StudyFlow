import React from "react";
import styles from "./Modal.module.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Confirm Deletion</h2>
        <p className={styles.modalText}>
          Are you sure you want to delete this {itemType}? This action cannot be
          undone.
        </p>
        <div className={styles.modalButtons}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalButton} ${styles.deleteButton}`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
