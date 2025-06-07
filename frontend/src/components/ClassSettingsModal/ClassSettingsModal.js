import React, { useState } from "react";
import { Copy } from "lucide-react";
import styles from "./ClassSettingsModal.module.css";

const ClassSettingsModal = ({ isOpen, onClose, onSave, classData }) => {
  const [formData, setFormData] = useState({
    name: classData.name,
    meetingLink: classData.meetingLink || "",
    about: classData.about || "",
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const copyClassCode = async () => {
    try {
      await navigator.clipboard.writeText(classData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy class code:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Class Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Class Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="meetingLink">Meeting Link</label>
            <input
              type="url"
              id="meetingLink"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="about">About Class</label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              placeholder="Enter class description..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Class Code</label>
            <div className={styles.codeContainer}>
              <input
                type="text"
                value={classData.code}
                readOnly
                className={styles.codeInput}
              />
              <button
                type="button"
                onClick={copyClassCode}
                className={styles.copyButton}
                title="Copy class code"
              >
                <Copy size={20} />
              </button>
            </div>
            {copied && <span className={styles.copiedMessage}>Copied!</span>}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassSettingsModal;
