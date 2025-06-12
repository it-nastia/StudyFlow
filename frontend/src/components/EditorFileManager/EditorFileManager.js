import React, { useState, useRef, useEffect } from "react";
import axios from "../../utils/axios";
import { Plus, X, Paperclip, Upload, FileText, Trash2 } from "lucide-react";
import styles from "./EditorFileManager.module.css";

const EditorFileManager = ({
  type,
  itemId,
  existingFiles = [],
  onFilesUpdate,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingFileIds, setDeletingFileIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

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

        // Delete from server
        await axios.delete(`/api/files/${fileToRemove.id}`);
        console.log(`File deleted from server: ${fileToRemove.name}`);

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

      if (onFilesUpdate) {
        onFilesUpdate();
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

      setError(
        error.response?.data?.error || "Failed to delete file from server"
      );
    }
  };

  const handleUploadFiles = async () => {
    const newFiles = files.filter((file) => file.isNew);

    if (newFiles.length === 0) {
      setError("No new files to upload");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Upload files to Azure Storage
      const formData = new FormData();
      newFiles.forEach((fileObj) => {
        formData.append("files", fileObj.file);
      });

      const filesResponse = await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Link files with the task or lecture
      const endpoint =
        type === "task"
          ? `/api/tasks/${itemId}/files`
          : `/api/lectures/${itemId}/files`;

      await axios.post(endpoint, {
        fileIds: filesResponse.data.map((file) => file.id),
      });

      console.log("Files uploaded successfully:", filesResponse.data);
      setSuccess(`Successfully uploaded ${filesResponse.data.length} file(s)!`);

      // Update local files to mark them as uploaded
      setFiles((prev) =>
        prev.map((file) => {
          if (file.isNew) {
            const uploadedFile = filesResponse.data.find(
              (f) => f.name === file.name
            );
            return uploadedFile ? { ...uploadedFile, isNew: false } : file;
          }
          return file;
        })
      );

      if (onFilesUpdate) {
        onFilesUpdate();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to upload files"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.managerContainer}>
      <h3 className={styles.title}>
        <FileText size={20} />
        Manage Additional Files
        <span className={styles.subtitle}>
          ({type === "task" ? "Task" : "Lecture"} files that students can view)
        </span>
      </h3>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {success && <div className={styles.successMessage}>{success}</div>}

      <div className={styles.fileSection}>
        <div className={styles.attachmentBox}>
          {files.length === 0 ? (
            <p className={styles.noFiles}>No additional files</p>
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
                  <div className={styles.fileActions}>
                    {!file.isNew && file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewFile}
                        title="View file"
                      >
                        <FileText size={16} />
                      </a>
                    )}
                    <button
                      className={styles.removeFile}
                      onClick={() => handleRemoveFile(file.id)}
                      disabled={deletingFileIds.has(file.id) || loading}
                      title="Delete file"
                    >
                      {deletingFileIds.has(file.id) ? (
                        <span style={{ fontSize: "12px" }}>...</span>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
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
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar,.ppt,.pptx,.xls,.xlsx"
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

          {files.some((f) => f.isNew) && (
            <button
              type="button"
              className={styles.uploadButton}
              onClick={handleUploadFiles}
              disabled={loading}
            >
              <Upload size={16} />
              <span>{loading ? "Uploading..." : "Upload New Files"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorFileManager;
