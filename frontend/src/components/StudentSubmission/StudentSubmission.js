import React, { useState, useRef, useEffect } from "react";
import axios from "../../utils/axios";
import { Plus, X, Paperclip, Send, Upload } from "lucide-react";
import styles from "./StudentSubmission.module.css";

const StudentSubmission = ({ taskId, onSubmissionUpdate }) => {
  const [files, setFiles] = useState([]);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingFileIds, setDeletingFileIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchExistingSubmission();
  }, [taskId]);

  const fetchExistingSubmission = async () => {
    try {
      const response = await axios.get(
        `/api/reports/tasks/${taskId}/my-report`
      );

      console.log("Fetched existing submission:", response.data);
      setExistingSubmission(response.data);

      // Handle different possible data structures for files
      const report = response.data?.report || response.data;
      const files = report?.files || response.data?.files;

      if (files && Array.isArray(files)) {
        setFiles(files.map((f) => f.file || f));
      }
    } catch (error) {
      // No existing submission found, which is fine
      console.log("No existing submission found:", error.response?.status);
      setExistingSubmission(null);
      setFiles([]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      isNew: true,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    event.target.value = "";

    // Clear any previous messages
    setError(null);
    setSuccess(null);
  };

  const handleRemoveFile = async (fileId) => {
    try {
      const fileToRemove = files.find((file) => file.id === fileId);

      if (!fileToRemove) {
        console.warn("File not found in files list");
        return;
      }

      // Check if this is an uploaded file (has no 'file' property and has a numeric id)
      const isUploadedFile =
        !fileToRemove.file && typeof fileToRemove.id === "number";

      if (isUploadedFile) {
        console.log(
          `Deleting uploaded file: ${fileToRemove.name} (ID: ${fileToRemove.id})`
        );

        // Add to deleting set to show loading state
        setDeletingFileIds((prev) => new Set(prev).add(fileId));

        // Delete the entire submission if it only has this file
        if (existingSubmission && files.length === 1) {
          const report = existingSubmission.report || existingSubmission;
          const reportId = report?.id;

          if (reportId) {
            await axios.delete(`/api/reports/${reportId}`);
            setExistingSubmission(null);
            console.log("Deleted entire submission");
          } else {
            console.warn("Cannot delete submission: no report ID found");
          }
        } else {
          // For now, we'll just remove from local state
          // In a full implementation, you'd need separate endpoints for individual file deletion
          console.log("Individual file deletion not implemented yet");
        }

        // Remove from deleting set
        setDeletingFileIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      } else {
        console.log(`Removing local file: ${fileToRemove.name}`);
      }

      // Remove from local state
      setFiles((prev) => prev.filter((file) => file.id !== fileId));

      if (onSubmissionUpdate) {
        onSubmissionUpdate();
      }
    } catch (error) {
      console.error("Error removing file:", error);

      // Remove from deleting set on error
      setDeletingFileIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });

      // Still remove from local state even if server deletion fails
      setFiles((prev) => prev.filter((file) => file.id !== fileId));

      setError(error.response?.data?.error || "Failed to delete file");
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to submit");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Only upload new files
      const newFiles = files.filter((file) => file.isNew);

      if (newFiles.length === 0) {
        setError("No new files to submit");
        return;
      }

      const formData = new FormData();
      newFiles.forEach((fileObj) => {
        formData.append("files", fileObj.file);
      });

      const response = await axios.post(
        `/api/reports/tasks/${taskId}/submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Submission successful:", response.data);
      setSuccess("Assignment submitted successfully!");
      setExistingSubmission(response.data);

      // Update local files to mark them as uploaded
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          isNew: false,
          id: file.isNew ? Math.random() : file.id, // Keep original ID for uploaded files
        }))
      );

      if (onSubmissionUpdate) {
        onSubmissionUpdate();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to submit assignment"
      );
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = () => {
    if (!existingSubmission) {
      return null;
    }

    // Handle different possible data structures
    const report = existingSubmission.report || existingSubmission;
    const uploadDate =
      report?.uploadDate || report?.createdAt || report?.created_at;
    const grade = report?.grade;

    if (!uploadDate) {
      console.warn("No upload date found in submission:", existingSubmission);
      return (
        <div className={styles.submissionStatus}>
          <div className={styles.statusBadge}>✓ Submitted</div>
          <div className={styles.statusDate}>Submission received</div>
          {grade && (
            <div className={styles.statusGrade}>Grade: {grade}/100</div>
          )}
        </div>
      );
    }

    try {
      const submissionDate = new Date(uploadDate);
      if (isNaN(submissionDate.getTime())) {
        throw new Error("Invalid date");
      }

      return (
        <div className={styles.submissionStatus}>
          <div className={styles.statusBadge}>✓ Submitted</div>
          <div className={styles.statusDate}>
            Submitted on: {submissionDate.toLocaleString()}
          </div>
          {grade && (
            <div className={styles.statusGrade}>Grade: {grade}/100</div>
          )}
        </div>
      );
    } catch (dateError) {
      console.error("Error parsing submission date:", dateError, uploadDate);
      return (
        <div className={styles.submissionStatus}>
          <div className={styles.statusBadge}>✓ Submitted</div>
          <div className={styles.statusDate}>Submission received</div>
          {grade && (
            <div className={styles.statusGrade}>Grade: {grade}/100</div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.submissionContainer}>
      <h3 className={styles.title}>
        <Upload size={20} />
        My Assignment Submission
      </h3>

      {getSubmissionStatus()}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {success && <div className={styles.successMessage}>{success}</div>}

      <div className={styles.fileSection}>
        <div className={styles.attachmentBox}>
          {files.length === 0 ? (
            <p className={styles.noFiles}>No files selected</p>
          ) : (
            <ul className={styles.fileList}>
              {files.map((file) => (
                <li key={file.id} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <Paperclip size={16} className={styles.fileIcon} />
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      ({formatFileSize(file.size)})
                    </span>
                    {file.isNew && <span className={styles.newBadge}>New</span>}
                  </div>
                  <button
                    className={styles.removeFile}
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={deletingFileIds.has(file.id) || loading}
                    title="Remove file"
                  >
                    {deletingFileIds.has(file.id) ? (
                      <span style={{ fontSize: "12px" }}>...</span>
                    ) : (
                      <X size={16} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.actionButtons}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className={styles.hiddenInput}
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
          />

          <button
            type="button"
            className={styles.addFileButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Plus size={16} />
            <span>Add Files</span>
          </button>

          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || files.filter((f) => f.isNew).length === 0}
          >
            <Send size={16} />
            <span>{loading ? "Submitting..." : "Submit Assignment"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmission;
