import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./CreateWorkspaceModal.module.css";

const CreateWorkspaceModal = ({ isOpen, onClose, onSubmit }) => {
  const [workspaceName, setWorkspaceName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      onSubmit(workspaceName);
      setWorkspaceName("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create New Workspace</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.inputGroup}>
              <label htmlFor="workspaceName">Workspace Name</label>
              <input
                type="text"
                id="workspaceName"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
                required
              />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
