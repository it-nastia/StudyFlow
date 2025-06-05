import React, { useState } from "react";
import styles from "./CreateClassModal.module.css";
import { X } from "lucide-react";

const CreateClassModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    meetingLink: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }
    if (!formData.meetingLink.trim()) {
      newErrors.meetingLink = "Meeting link is required";
    } else if (!isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = "Please enter a valid URL";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const classData = {
          name: formData.name.trim(),
          meetingLink: formData.meetingLink.trim(),
          description: formData.description.trim(),
        };
        await onSubmit(classData);
        // Reset form
        setFormData({
          name: "",
          meetingLink: "",
          description: "",
        });
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to create class",
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create New Class</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.submit && <div className={styles.error}>{errors.submit}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="name">Class Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter class name"
              className={errors.name ? styles.errorInput : ""}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="meetingLink">Meeting Link*</label>
            <input
              type="url"
              id="meetingLink"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://link-to-meeting..."
              className={errors.meetingLink ? styles.errorInput : ""}
            />
            {errors.meetingLink && (
              <span className={styles.error}>{errors.meetingLink}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter class description"
              rows="4"
              className={errors.description ? styles.errorInput : ""}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
