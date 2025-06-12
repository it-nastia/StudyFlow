import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./JoinClassModal.module.css";

const JoinClassModal = ({ isOpen, onClose, onJoin }) => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateClassCode = (code) => {
    if (!code || code.trim().length === 0) {
      return "Please enter a class code";
    }
    // Add any additional validation rules here
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateClassCode(classCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      await onJoin(classCode.trim());
    } catch (err) {
      console.error("Error joining class:", err);
      setError(err.message || "Failed to join class");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClassCode("");
    setError("");
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setClassCode(value);
    setError("");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          disabled={isLoading}
        >
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
              onChange={handleInputChange}
              placeholder="Enter class code"
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              disabled={isLoading}
              autoFocus
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.joinButton}`}
              disabled={isLoading || !classCode.trim()}
            >
              {isLoading ? "Joining..." : "Join Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClassModal;
