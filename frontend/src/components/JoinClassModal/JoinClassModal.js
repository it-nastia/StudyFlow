import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./JoinClassModal.module.css";

const JoinClassModal = ({ isOpen, onClose, onJoin }) => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    onJoin(classCode.trim());
    setClassCode("");
    setError("");
  };

  const handleClose = () => {
    setClassCode("");
    setError("");
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={20} />
        </button>

        <h2 className={styles.modalTitle}>Join Class</h2>
        <p className={styles.modalDescription}>
          Enter the class code provided by your teacher to join the class.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="classCode" className={styles.label}>
              Class Code
            </label>
            <input
              id="classCode"
              type="text"
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value);
                setError("");
              }}
              placeholder="Enter class code"
              className={styles.input}
              autoFocus
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.joinButton}`}
            >
              Join Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClassModal;
